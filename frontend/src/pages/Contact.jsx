import React, { useState } from "react";
import "./Contact.css";
import { API_BASE } from "../config/api";
import { useRegion } from "../hooks/useRegion";

const Contact = () => {
  const region = useRegion();
  const [faqs, setFaqs] = useState([
    {
      question: "How can my company partner with Y4D Foundation?",
      answer:
        "Y4D collaborates with corporates through CSR initiatives, skill development programs, education projects, women empowerment, and sustainability interventions. To partner with us, you can reach out via our Partnership Inquiry Form or write to us at csr@y4d.ngo",
      open: false,
    },
    {
      question: "Does Y4D offer customized CSR solutions?",
      answer:
        "Yes, we design and implement tailor-made CSR projects aligned with your company’s sustainability goals, compliance requirements, and community needs.",
      open: false,
    },
    {
      question: "Can Y4D provide impact reporting for CSR initiatives?",
      answer:
        "Absolutely. We provide detailed reports, case studies, and impact stories with measurable outcomes to ensure transparency and accountability.",
      open: false,
    },
    {
      question: "How can I volunteer with Y4D Foundation?",
      answer:
        "You can register through our Volunteer Portal and choose from opportunities such as teaching, community outreach, awareness campaigns, and event support.",
      open: false,
    },
    {
      question: "Do I need specific skills to volunteer?",
      answer:
        "Not necessarily. While some roles require specialized skills, most opportunities simply need dedication and a willingness to make a difference.",
      open: false,
    },
    {
      question: "Can corporate employees volunteer through Y4D?",
      answer:
        "Yes, we facilitate employee engagement programs for corporates looking to involve their teams in meaningful volunteering activities.",
      open: false,
    },
    {
      question: "Does Y4D offer internships for students?",
      answer:
        "Yes, Y4D offers structured internships for students and young professionals in areas like social research, content creation, project management, and community engagement.",
      open: false,
    },
    {
      question: "How can I apply for an internship?",
      answer:
        "Interested candidates can apply via our Careers/Internship section.",
      open: false,
    },
    {
      question: "Are Y4D internships paid?",
      answer:
        "Some internships are paid, while others are volunteer-based. Details are shared at the time of application.",
      open: false,
    },
    {
      question: "How can I donate to Y4D Foundation?",
      answer:
        "Donations can be made easily through our Donate Now page via online payment, bank transfer, or UPI.",
      open: false,
    },
    {
      question: "Are donations tax-exempt?",
      answer:
        "Yes, Y4D Foundation is registered under relevant sections of the Income Tax Act, and donations are eligible for tax exemption under 80G.",
      open: false,
    },
    {
      question: "Can I donate in-kind (books, clothes, equipment)?",
      answer:
        "Yes, we welcome in-kind contributions. Please contact us in advance so we can guide you on current community requirements.",
      open: false,
    },
    {
      question: "What kind of career opportunities does Y4D Foundation offer?",
      answer:
        "Y4D offers diverse career opportunities in project management, communications, community outreach, research, training, and CSR program implementation.",
      open: false,
    },
    {
      question: "How can I apply for a job at Y4D Foundation?",
      answer:
        "You can explore current openings in the Careers Section of our website and apply online.",
      open: false,
    },
    {
      question:
        "Does Y4D provide growth and training opportunities for employees?",
      answer:
        "Yes, Y4D strongly believes in continuous learning. We provide capacity-building workshops, exposure visits, and skill development programs to support personal and professional growth.",
      open: false,
    },
    {
      question: "What qualities does Y4D look for in candidates?",
      answer:
        "We value passion for social change, problem-solving ability, teamwork, creativity, and a strong commitment to community development.",
      open: false,
    },
    {
      question: "Can freshers apply for roles at Y4D?",
      answer:
        "Yes, freshers who are motivated and willing to learn are welcome to apply. We often have entry-level positions and training-based roles.",
      open: false,
    },
    {
      question: "Are there remote or hybrid working opportunities at Y4D?",
      answer:
        "Depending on the project requirements, certain roles may allow remote or hybrid work. However, many positions involve field engagement and community interaction.",
      open: false,
    },
    {
      question: "Where does Y4D operate?",
      answer:
        "Y4D Foundation operates across multiple states in India, implementing projects in Education, Skilling, Women Empowerment, Environment, and SDGs.",
      open: false,
    },
    {
      question: "How can I stay updated on Y4D’s initiatives?",
      answer:
        "You can follow us on our social media channels, subscribe to our newsletter, or check our News & Updates section on the website.",
      open: false,
    },
    {
      question: "Who can I contact for general queries?",
      answer:
        "Please reach out to us at info@y4d.ngo for any general inquiries.",
      open: false,
    },
  ]);

  const toggleFAQ = (index) => {
    setFaqs(
      faqs.map((faq, i) => ({
        ...faq,
        open: i === index ? !faq.open : false,
      }))
    );
  };

  const offices = region === "global" ? [
    {
      name: "Postal Address",
      address: "322 Bellis Ct., Bridgewater, New Jersey, 08807.",
      mapsUrl: "https://www.google.com/maps/search/322+Bellis+Ct,+Bridgewater,+New+Jersey,+08807",
      iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3030.597653246342!2d-74.63673752399201!3d40.57262444613291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3be7a4d538e15%3A0xc6c76ebd58a36c61!2s322%20Bellis%20Ct%2C%20Bridgewater%2C%20NJ%2008807!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    },
    {
      name: "Registered Address",
      address: "1401, 21ST, Sacramento, California, 95811.",
      mapsUrl: "https://www.google.com/maps/search/1401,+21ST,+Sacramento,+California,+95811",
      iframeSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3119.8258380295!2d-121.48271162409051!3d38.572346067099044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ad12a7a41dd31%3A0xb328004fcf1cbbd2!2s1401%2021st%20St%2C%20Sacramento%2C%20CA%2095811!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    },
  ] : [
    {
      name: "Pune Office",
      address: "4th Floor, Near Euro School, Wakad, Pune 411057",
      mapsUrl:
        "https://www.google.com/maps/search/3rd+Floor,+The+Onyx,+Near+Euro+School,+Wakad,+Pune+411057/@18.5966469,73.7434204,14z",
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.8386706901415!2d73.7434204!3d18.5966469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf5f3f70b3bb%3A0x64cb7880da85d163!2sThe%20Onyx!5e0!3m2!1sen!2sin!4v1695822312345!5m2!1sen!2sin",
    },
    {
      name: "Mumbai Office",
      address: "305 A, Janmabhoomi Chambers, Ballard Estate, Mumbai-38",
      mapsUrl:
        "https://www.google.com/maps/place/Janmabhoomi+Chambers,+Ballard+Estate,+Mumbai+400038",
      iframeSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.848695864146!2d72.840918!3d18.940747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce1fdd4c85db%3A0x64f3cf123456abcd!2sJanmabhoomi%20Chambers!5e0!3m2!1sen!2sin!4v1695822312346!5m2!1sen!2sin",
    },
  ];

  const [selectedOffice, setSelectedOffice] = useState(offices[0]);

  // Ensure selectedOffice properly resets if the region changes
  React.useEffect(() => {
    setSelectedOffice(offices[0]);
  }, [region]);

  // Popup state
  const [popupType, setPopupType] = useState(null);

  // Success popup
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const closePopup = () => setPopupType(null);

  // FORM STATES
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");

  const [internName, setInternName] = useState("");
  const [internEmail, setInternEmail] = useState("");
  const [internPhone, setInternPhone] = useState("");
  const [internField, setInternField] = useState("");
  const [internMessage, setInternMessage] = useState("");

  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [volReason, setVolReason] = useState("");

  const [enqFirst, setEnqFirst] = useState("");
  const [enqLast, setEnqLast] = useState("");
  const [enqEmail, setEnqEmail] = useState("");
  const [enqPhone, setEnqPhone] = useState("");
  const [enqMessage, setEnqMessage] = useState("");

  // Generic helper to show success popup
  const handleSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setSuccessMessage("");
    }, 5000);
  };

  // Corporate partnership submit
  const handleCorporateSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/contact/corporate-partnership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, contact, details }),
      });

      const result = await res.json();

      if (result.success) {
        closePopup();
        handleSuccess("Your partnership form has been submitted.");
        setCompanyName("");
        setEmail("");
        setContact("");
        setDetails("");
      }
    } catch (err) {
      console.error("Corporate partnership submission error:", err);
      handleSuccess("An error occurred. Please try again.");
    }
  };

  // Internship submit
  const handleInternshipSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/contact/internship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: internName,
          email: internEmail,
          phone: internPhone,
          field: internField,
          message: internMessage,
        }),
      });

      const result = await res.json();

      if (result.success) {
        closePopup();
        handleSuccess("Your internship application has been submitted.");
      }
    } catch (err) {
      console.error("Internship submission error:", err);
      handleSuccess("An error occurred. Please try again.");
    }
  };

  // Volunteer submit
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/contact/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: volName,
          email: volEmail,
          phone: volPhone,
          reason: volReason,
        }),
      });

      const result = await res.json();

      if (result.success) {
        closePopup();
        handleSuccess("Your volunteer form has been submitted.");
      }
    } catch (err) {
      console.error("Volunteer submission error:", err);
      handleSuccess("An error occurred. Please try again.");
    }
  };

  // Enquiry submit
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/contact/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: enqFirst,
          lastName: enqLast,
          email: enqEmail,
          phone: enqPhone,
          message: enqMessage,
        }),
      });

      const result = await res.json();

      if (result.success) {
        closePopup();
        handleSuccess("Your enquiry has been submitted.");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      handleSuccess("An error occurred. Please try again.");
    }
  };

  return (
    <div className="contactus-page">
      <div className="heading">
        <h2>
          Get Involved <span></span>
        </h2>
      </div>

      {/* TOP BUTTONS */}
      <div className="contact-top-buttons">
        <button onClick={() => setPopupType("partnership")}>
          Corporate Partnership
        </button>
        <button onClick={() => setPopupType("internship")}>Internship</button>
        <button onClick={() => setPopupType("volunteer")}>Volunteers</button>
        <button onClick={() => setPopupType("enquiry")}>Enquiry Form</button>
        <button onClick={() => (window.location.href = "/careers")}>
          Career
        </button>
      </div>

      {/* POPUP FORMS */}
      {popupType && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ✕
            </button>

            {/* Partnership */}
            {popupType === "partnership" && (
              <>
                <h2>Corporate Partnership Form</h2>
                <form className="popup-form" onSubmit={handleCorporateSubmit}>
                  <input
                    type="text"
                    placeholder="Company Name"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />

                  <input
                    type="email"
                    placeholder="Official Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Contact Number"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />

                  <textarea
                    rows="4"
                    placeholder="Partnership Details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  ></textarea>

                  <button type="submit">Submit</button>
                </form>
              </>
            )}

            {/* Internship */}
            {popupType === "internship" && (
              <>
                <h2>Internship Application</h2>
                <form className="popup-form" onSubmit={handleInternshipSubmit}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={internName}
                    onChange={(e) => setInternName(e.target.value)}
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={internEmail}
                    onChange={(e) => setInternEmail(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    required
                    value={internPhone}
                    onChange={(e) => setInternPhone(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Preferred Field (Web Dev, Marketing, etc)"
                    value={internField}
                    onChange={(e) => setInternField(e.target.value)}
                  />

                  <textarea
                    placeholder="Why do you want to intern with Y4D?"
                    rows="4"
                    value={internMessage}
                    onChange={(e) => setInternMessage(e.target.value)}
                  ></textarea>

                  <button type="submit">Apply</button>
                </form>
              </>
            )}

            {/* Volunteer */}
            {popupType === "volunteer" && (
              <>
                <h2>Volunteer Registration</h2>
                <form className="popup-form" onSubmit={handleVolunteerSubmit}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Contact Number"
                    required
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                  />

                  <textarea
                    placeholder="Why do you want to volunteer?"
                    rows="4"
                    value={volReason}
                    onChange={(e) => setVolReason(e.target.value)}
                  ></textarea>

                  <button type="submit">Submit</button>
                </form>
              </>
            )}

            {/* Enquiry */}
            {popupType === "enquiry" && (
              <>
                <h2>General Enquiry</h2>
                <form className="popup-form" onSubmit={handleEnquirySubmit}>
                  <input
                    type="text"
                    placeholder="First Name"
                    required
                    value={enqFirst}
                    onChange={(e) => setEnqFirst(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Last Name"
                    required
                    value={enqLast}
                    onChange={(e) => setEnqLast(e.target.value)}
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={enqEmail}
                    onChange={(e) => setEnqEmail(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Mobile Number"
                    required
                    value={enqPhone}
                    onChange={(e) => setEnqPhone(e.target.value)}
                  />

                  <textarea
                    placeholder="Your Message"
                    rows="4"
                    value={enqMessage}
                    onChange={(e) => setEnqMessage(e.target.value)}
                  ></textarea>

                  <button type="submit">Submit</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="popup-overlay success-overlay">
          <div className="popup-content success-popup">
            <div className="success-icon">✔</div>
            <h2 className="success-title">Thank You!</h2>
            <p className="success-text">{successMessage}</p>
            <button
              className="success-ok-btn"
              onClick={() => {
                setShowSuccess(false);
                setSuccessMessage("");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* OFFICE SECTION */}
      <section className="contactus-section contactus-office">
        <div className="office-title">
          <h2>
            {region === "global" ? "Address" : "Office Addresses"}<span></span>
          </h2>
        </div>

        <div className="office-container">
          <div className="office-list new-office-list">
            {offices.map((office, index) => (
              <div
                key={index}
                className={`office-item ${selectedOffice.name === office.name ? "active" : ""
                  }`}
                onClick={() => setSelectedOffice(office)}
              >
                <div>
                  <h4>{office.name}</h4>
                  <p>{office.address}</p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="office-map"
            onClick={() => window.open(selectedOffice.mapsUrl, "_blank")}
          >
            <iframe
              src={selectedOffice.iframeSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="office-map"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS SECTION */}
      <section className="contactus-section contactus-details">
        <div className="contact-details-title">
          <h2>
            Contact Details<span></span>
          </h2>
        </div>
        <div className="contact-details-container">
          <div className="contact-detail-item">
            <div className="contact-icon">📧</div>
            <div className="contact-info">
              <h4>Email Address</h4>
              <p><a href="mailto:info@y4d.ngo">info@y4d.ngo</a></p>
            </div>
          </div>
          <div className="contact-detail-item">
            <div className="contact-icon">📞</div>
            <div className="contact-info">
              <h4>Mobile Number</h4>
              <p><a href="tel:+918282828811">+91 82828 28811</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="contactus-section contactus-faq">
        <div className="faq-title">
          <h2>
            Frequently Asked Questions<span></span>
          </h2>
        </div>

        <div className="contactus-faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`contactus-faq-item ${faq.open ? "open" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span className="faq-icon">•</span>
                <h3>{faq.question}</h3>
                <span className={`arrow ${faq.open ? "up" : "down"}`}>⌄</span>
              </div>

              {faq.open && (
                <div className="faq-answer">
                  <p>
                    <span className="faq-icon">{">"}</span> {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>


    </div>
  );
};

export default Contact;
