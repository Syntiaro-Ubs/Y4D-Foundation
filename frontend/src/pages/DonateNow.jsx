import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./DonateNow.css";
import { bannerService } from "../api/services/banners.service";
import { paymentService } from "../api/services/payment.service";
import { UPLOADS_BASE } from "../config/api";
import { useApi } from "../hooks/useApi";
import { useLoadingState } from "../hooks/useLoadingState";
import logger from "../utils/logger";
import toast from "../utils/toast";
import { useRegion } from "../hooks/useRegion";

const getPaymentCurrencyFromHost = () => {
  const hostname = window.location.hostname;
  const globalDomains = [
    "global.y4d.ngo",
    "global.y4dinfo.org",
    "y4d-global.netlify.app",
    "global.localhost",
  ];
  const isGlobalHost =
    globalDomains.some((domain) => hostname.includes(domain)) ||
    hostname.startsWith("global.");

  return isGlobalHost ? "USD" : "INR";
};

const DonateNow = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    pan: "",
    message: "",
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const region = useRegion();
  const isGlobal = region === 'global';
  const paymentCurrency = getPaymentCurrencyFromHost();
  const currencySymbol = paymentCurrency === "USD" ? "$" : "₹";
  const suggestedAmounts = paymentCurrency === "USD" ? [25, 50, 100, 150] : [500, 1000, 2000, 5000];

  // Use new useApi hook for banners
  const { data: donateBanners = [], loading: bannersLoading } = useApi(
    () => bannerService.getBanners("donate", "hero"),
    [],
    { defaultData: [] }
  );

  // State for payment processing
  const [isProcessing, setIsProcessing] = useState(false);

  /* Input Handler*/
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "pan" ? value.toUpperCase() : value,
    });
  };

  /* Enhanced Validation */
  const validateForm = () => {
    const { name, email, amount, pan, message } = formData;

    if (!name || !name.trim() || name.trim().length < 2)
      return "Name must be at least 2 characters";

    if (name.trim().length > 255)
      return "Name must be less than 255 characters";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim() || !emailPattern.test(email.trim()))
      return "Enter a valid email address";

    const donationAmount = Number(amount);
    if (!donationAmount || donationAmount <= 0 || isNaN(donationAmount))
      return `Enter a valid donation amount (minimum ${currencySymbol}1)`;

    // Match backend limit: 1 crore (10000000)
    const MAX_AMOUNT = 10000000;
    if (donationAmount > MAX_AMOUNT)
      return `Maximum donation amount is ${currencySymbol}${MAX_AMOUNT.toLocaleString("en-IN")}`;

    // PAN/EIN is optional but if provided, must be valid
    if (pan && pan.trim()) {
      if (!isGlobal) {
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panPattern.test(pan.trim()))
          return "Invalid PAN format (Format: ABCDE1234F)";
      }
    }

    // Message length validation
    if (message && message.trim().length > 1000)
      return "Message must be less than 1000 characters";

    return null;
  };

  /* Load Razorpay Script Once */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        return resolve(true);
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  /* Razorpay Checkout Logic*/
  const loadRazorpay = async () => {
    setIsProcessing(true);
    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Payment gateway failed to load. Please check your internet connection and try again.");
        setIsProcessing(false);
        return;
      }

      // Get Razorpay Key from backend using paymentService
      let keyData;
      try {
        const keyResponse = await paymentService.getRazorpayKey();
        keyData = { success: true, key: keyResponse };
      } catch (error) {
        logger.error("Error fetching Razorpay key:", error);
        toast.error("Unable to connect to payment service. Please try again later.");
        setIsProcessing(false);
        return;
      }

      if (!keyData.success || !keyData.key) {
        toast.error("Payment service is not configured. Please contact support.");
        setIsProcessing(false);
        return;
      }

      // Create order using paymentService
      let orderData;
      try {
        orderData = await paymentService.createOrder({
          amount: Number(formData.amount),
          name: formData.name.trim(),
          email: formData.email.trim(),
          pan: formData.pan?.trim() || "",
          message: formData.message?.trim() || "",
          currency: paymentCurrency,
        });
      } catch (error) {
        logger.error("Error creating order:", error);
        toast.error(error.message || "Failed to create payment order. Please check your details and try again.");
        setIsProcessing(false);
        return;
      }

      if (!orderData.success || !orderData.order) {
        const errorMsg = orderData.message || orderData.errors?.[0]?.msg || "Order creation failed";
        toast.error(errorMsg);
        setIsProcessing(false);
        return;
      }

      const { order } = orderData;

      // Configure Razorpay options
      const options = {
        key: keyData.key,
        amount: order.amount,
        currency: order.currency || paymentCurrency,
        name: "Y4D Foundation",
        description: "Donation to Y4D Foundation",
        order_id: order.id,
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
        theme: {
          color: "#4CAF50",
        },
        handler: async function (response) {
          try {
            // Show success immediately
            setShowSuccessPopup(true);
            setSuccessMessage("Verifying payment...");
            setIsProcessing(true);

            // Verify payment with backend using paymentService
            let verifyData;
            try {
              verifyData = await paymentService.verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
            } catch (error) {
              logger.error("Error verifying payment:", error);
              setSuccessMessage(
                "Payment completed but verification failed. Please contact support with Payment ID: " +
                response.razorpay_payment_id
              );
              setIsProcessing(false);
              return;
            }

            if (!verifyData.success) {
              setSuccessMessage(
                verifyData.message ||
                "Payment verification failed. Please contact support with Payment ID: " +
                response.razorpay_payment_id
              );
              setIsProcessing(false);
              return;
            }

            // Payment verified successfully
            setSuccessMessage(
              `Thank you for your generous contribution of ${currencySymbol}${Number(formData.amount).toLocaleString("en-IN")}!`
            );

            // Clear form
            setFormData({
              name: "",
              email: "",
              amount: "",
              pan: "",
              message: "",
            });

            setIsProcessing(false);
          } catch (error) {
            logger.error("Error in payment handler:", error);
            setSuccessMessage(
              "Payment completed but there was an error processing it. Please contact support with Payment ID: " +
              response.razorpay_payment_id
            );
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            // User closed the payment modal
            setIsProcessing(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        logger.error("Payment failed:", response);
        toast.error(
          `Payment failed: ${response.error?.description || "Unknown error"}. Please try again.`
        );
        setIsProcessing(false);
      });

      razorpayInstance.open();
    } catch (err) {
      logger.error("Error launching Razorpay:", err);
      toast.error("Failed to initialize payment. Please try again.");
      setIsProcessing(false);
    }
  };

  /*  Submit Handler*/
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isProcessing) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsProcessing(true);
    loadRazorpay();
  };

  /* Banner Rendering */
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="donate-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (donateBanners.length === 0) {
      return (
        <div className="donate-banner">
          <p>No banner added yet</p>
        </div>
      );
    }

    return (
      <div className="donate-banner">
        {donateBanners.map((banner) => (
          <div key={banner.id} className="banner-container">
            {banner.media_type === "image" ? (
              <img
                src={`${UPLOADS_BASE}/banners/${banner.media}`}
                alt="Donate Banner"
              />
            ) : (
              <video
                src={`${UPLOADS_BASE}/banners/${banner.media}`}
                autoPlay
                muted
                loop
                playsInline
              />
            )}

            {(banner.title || banner.description) && (
              <div className="banner-overlay">
                <div className="banner-content">
                  {banner.title && <h1>{banner.title}</h1>}
                  {banner.description && <p>{banner.description}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  /* RETURN JSX (Final UI) */
  return (
    <div className="donate-page">
      {renderBanner()}

      <div className="donate-content">
        {/* LEFT SECTION: Impact & Info */}
        <div className="donate-left" data-aos="fade-right">
          <h2>Why Donate to Y4D?</h2>
          <p className="donate-description">
            Your contribution helps us empower underprivileged communities through sustainable initiatives in education, healthcare, and livelihood. Together, we can create lasting change.
          </p>

          <ul className="impact-list">
            <li className="impact-item">
              <div className="impact-icon">📚</div>
              <div className="impact-text">
                <h4>Education Support</h4>
                <p>Providing quality education to underprivileged children.</p>
              </div>
            </li>
            <li className="impact-item">
              <div className="impact-icon">💼</div>
              <div className="impact-text">
                <h4>Livelihood Opportunities</h4>
                <p>Skill development and employment for youth & women.</p>
              </div>
            </li>
            <li className="impact-item">
              <div className="impact-icon">🏥</div>
              <div className="impact-text">
                <h4>Healthcare Access</h4>
                <p>Medical camps and health awareness in rural areas.</p>
              </div>
            </li>
            <li className="impact-item">
              <div className="impact-icon">🌱</div>
              <div className="impact-text">
                <h4>Environmental Protection</h4>
                <p>Tree plantation and sustainability drives.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* RIGHT SECTION: Donation Form */}
        <div className="donate-right" data-aos="fade-up">
          <h2>Make a Donation</h2>
          {!isGlobal && (
            <span className="donation-subtitle">
              Tax Exemption under Section 80G
            </span>
          )}

          <div className="suggested-amounts">
            <p>Select Amount:</p>
            <div className="amount-buttons">
              {suggestedAmounts.map((amt) => (
                <button
                  key={amt}
                  className={`suggest-btn ${formData.amount == amt ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, amount: amt })}
                >
                  {isGlobal ? `${amt}$` : `₹${amt.toLocaleString()}`}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="donation-form">
            <div className="form-group">
              <label>{isGlobal ? "Name" : "Full Name *"}</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength="2"
                maxLength="100"
                placeholder={isGlobal ? "" : "Enter your full name"}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={isGlobal ? "" : "Enter your email"}
              />
            </div>

            <div className="form-group">
              <label>Donation Amount</label>
              <input
                name="amount"
                type="number"
                min="1"
                max="10000000"
                step="1"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder={isGlobal ? "" : "Enter amount"}
              />
            </div>

            <div className="form-group">
              <label>{isGlobal ? "EIN (Optional)" : "PAN Card Number (Optional)"}</label>
              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                maxLength={isGlobal ? "15" : "10"}
                placeholder={isGlobal ? "" : "For 80G Tax Receipt"}
              />
              {!isGlobal && (
                <small className="form-hint">
                  Required for 80G tax exemption certificate.
                </small>
              )}
            </div>

            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                name="message"
                rows="3"
                maxLength="1000"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any note for us?"
              ></textarea>
            </div>

            <button className="submit-btn" disabled={isProcessing}>
              {isProcessing ? "Processing Securely..." : "Donate Now"}
            </button>
          </form>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box donate-success-box">
            <div className="donate-success-icon">✓</div>
            <h2 className="donate-success-title">Thank You!</h2>
            <p className="donate-success-text">{successMessage}</p>
            <div className="donate-success-footer">
              <p className="donate-success-note">
                A receipt has been sent to your email.
              </p>
              <button
                className="donate-success-btn"
                onClick={() => setShowSuccessPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateNow;
