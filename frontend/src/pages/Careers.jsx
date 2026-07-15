// src/pages/Careers.jsx
import React, { useState } from "react";
import { careersService } from "../api/services/careers.service";
import { useApi } from "../hooks/useApi";
import { useLoadingState } from "../hooks/useLoadingState";
import "./Careers.css";
import bannerImg from "../assets/BannerImages/f.jpeg";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";
import toast from "../utils/toast";

const Careers = () => {
  const [selectedCareer, setSelectedCareer] = useState(null); // for popup modal
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    resume: null,
  });

  // Use useApi hook for fetching careers
  const { data: careers = [], loading, error } = useApi(
    () => careersService.getCareers(),
    [],
    { defaultData: [] }
  );

  // Use useLoadingState for form submission
  const { loading: isSubmitting, execute: executeSubmit } = useLoadingState();

  // Handle file change
  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      resume: e.target.files[0],
    });
  };

  const handleApplicationChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    await executeSubmit(async () => {
      try {
        const formData = new FormData();
        formData.append("name", applicationData.name);
        formData.append("email", applicationData.email);
        formData.append("phone", applicationData.phone);
        formData.append("message", applicationData.message);
        formData.append("careerId", selectedCareer.id);
        if (applicationData.resume) {
          formData.append("resume", applicationData.resume);
        }

        await careersService.applyForJob(formData);
        // ✅ Show success popup
        setShowSuccessPopup(true);
        setApplicationData({
          name: "",
          email: "",
          phone: "",
          message: "",
          resume: null,
        });
        setShowApplicationForm(false);
        // ✅ Close success popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
          setSelectedCareer(null);
        }, 3000);
      } catch (error) {
        logger.error("Error applying for job:", error);
        toast.error("Something went wrong. Please try again later.");
        throw error;
      }
    });
  };

  if (loading)
    return (
      <div className="careers-page">
        <div className="careers-loading">Loading career opportunities...</div>
      </div>
    );

  if (error)
    return (
      <div className="careers-page">
        <div className="careers-error">{error}</div>
      </div>
    );

  return (
    <div className="careers-page">
      <div className="careers-banner">
        <img src={bannerImg} alt="Careers Banner" />
      </div>
      <section className="careers-section">
        <div className="careers-container">
          <h2 className="careers-title">
            Career Opportunities<span></span>
          </h2>

          {careers.length === 0 ? (
            <div className="careers-no-openings">
              <p>Currently, we don't have any open positions.</p>
              <p>
                Please fill out the contact form below for future opportunities.
              </p>

              {/* Interest Form */}
              <div className="careers-form">
                <h3>Express Interest</h3>
                <form onSubmit={handleApplicationSubmit}>
                  <div className="careers-form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={applicationData.name}
                      onChange={handleApplicationChange}
                      required
                    />
                  </div>
                  <div className="careers-form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={applicationData.email}
                      onChange={handleApplicationChange}
                      required
                    />
                  </div>
                  <div className="careers-form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone"
                      value={applicationData.phone}
                      onChange={handleApplicationChange}
                    />
                  </div>
                  <div className="careers-form-group">
                    <textarea
                      name="message"
                      placeholder="Your Message / Areas of Interest"
                      value={applicationData.message}
                      onChange={handleApplicationChange}
                      rows="4"
                      required
                    />
                  </div>
                  <button type="submit" className="careers-btn">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="careers-list">
              {careers.map((career) => (
                <div key={career.id} className="careers-card">
                  <h4>{career.title}</h4>
                  <div className="careers-details">
                    <p>
                      <strong>Location:</strong> {career.location}
                    </p>
                    <p>
                      <strong>Type:</strong> {career.type}
                    </p>
                  </div>

                  <div className="careers-description">
                    {career.shortDescription || (
                      <SanitizedHTML
                        content={career.description.substring(0, 120) + "..."}
                      />
                    )}
                  </div>

                  <div className="careers-card-actions">
                    <button
                      className="careers-btn"
                      onClick={() => {
                        setSelectedCareer(career);
                        setShowApplicationForm(false);
                      }}
                    >
                      Apply Now
                    </button>
                    <button
                      className="careers-btn"
                      onClick={() => setSelectedCareer(career)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* -------- POPUP MODAL -------- */}
      {selectedCareer && (
        <div className="career-modal">
          <div className="career-modal-content">
            <button
              className="career-modal-close"
              onClick={() => {
                setSelectedCareer(null);
                setShowApplicationForm(false);
              }}
            >
              &times;
            </button>

            <h2>{selectedCareer.title}</h2>
            <p>
              <strong>Location:</strong> {selectedCareer.location}
            </p>
            <p>
              <strong>Type:</strong> {selectedCareer.type}
            </p>
            <p>
              <strong>Requirements:</strong> {selectedCareer.requirements}
            </p>

            <SanitizedHTML
              content={selectedCareer.description}
              className="career-modal-description"
            />

            {!showApplicationForm ? (
              <button
                className="careers-btn"
                onClick={() => setShowApplicationForm(true)}
              >
                Apply Now
              </button>
            ) : (
              <form className="careers-form" onSubmit={handleApplicationSubmit}>
                <div className="careers-form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={applicationData.name}
                    onChange={handleApplicationChange}
                    required
                  />
                </div>
                <div className="careers-form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={applicationData.email}
                    onChange={handleApplicationChange}
                    required
                  />
                </div>
                <div className="careers-form-group">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={applicationData.phone}
                    onChange={handleApplicationChange}
                  />
                </div>
                <div className="careers-form-group">
                  <textarea
                    name="message"
                    placeholder="Your Cover Letter / Message"
                    value={applicationData.message}
                    onChange={handleApplicationChange}
                    rows="4"
                    required
                  />
                </div>
                <div className="careers-form-group">
                  <label>Upload Resume (PDF)</label>
                  <input
                    type="file"
                    name="resume"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />
                </div>

                <button type="submit" className="careers-btn" disabled={isSubmitting}>
                  {isSubmitting ? <span className="spinner"></span> : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* -------- SUCCESS POPUP -------- */}
      {showSuccessPopup && (
        <div className="success-popup">
          <div className="success-popup-content">
            <h3>✅ Application Submitted</h3>
            <p>Thank you for applying! We will get back to you soon.</p>
          </div>
        </div>
      )}
      {isSubmitting && (
        <div className="loading-popup">
          <div className="loading-popup-content">
            <h3>⏳ Submitting...</h3>
            <p>Please wait while we process your application.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
