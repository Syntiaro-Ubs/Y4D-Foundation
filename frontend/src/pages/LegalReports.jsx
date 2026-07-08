// src/pages/LegalReports.jsx
import React, { useEffect, useState } from "react";
import "./LegalReports.css";
import { bannerService } from "../api/services/banners.service";
import { impactService } from "../api/services/impact.service";
import { UPLOADS_BASE } from "../config/api";
import logger from "../utils/logger";
import { useRegion } from "../hooks/useRegion";
import { GLOBAL_BANK_DETAILS } from "../config/legalData";

const LegalReports = () => {
  const region = useRegion();
  const [reports, setReports] = useState([]);
  const [legalBanners, setLegalBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  // Fetch legal page banners
  useEffect(() => {
    const fetchLegalBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log('🔄 Fetching legal page banners...');
        const bannersData = await bannerService.getBanners('legal-status', 'hero');
        logger.log('✅ Legal banners received:', bannersData);
        setLegalBanners(bannersData);
      } catch (error) {
        logger.error('❌ Error fetching legal banners:', error);
        setLegalBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchLegalBanners();
  }, []);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Get published reports (public endpoint)
        const reportsData = await impactService.getReports();
        setReports(reportsData);
        logger.log("📊 Reports fetched:", reportsData.length);
      } catch (err) {
        logger.error("Error fetching reports:", err);
        setReports([]);
      }
    };
    fetchReports();
  }, []);

  const legalStatusData = region === 'global' ? [
    { title: "1) Registered Charity Number (EIN)", value: "39-3932034" },
    { title: "2) Primary Office", value: "1401 21st Street, Sacramento, California, 95811" },
    { title: "3) Additional Office", value: "100 Bellis Ct., Bridgewater, New Jersey, 08807" },
    { title: "4) Legal Status", value: "FCRA-approved and PAN India-recognized NGO" },
    { title: "5) Focus Areas", value: "Education, Digital Empowerment, Livelihood Development, and Innovation" },
    { title: "6) Global Reach", value: "Active operations across USA, India, Kenya, and Nigeria" },
    { title: "7) Governance", value: "Managed through transparent systems and trusted banking partnerships to facilitate secure global collaborations" },
    { title: "Bank Details", value: " " },
    { title: "i) Routing Number", value: GLOBAL_BANK_DETAILS.routingNumber },
    { title: "ii) Account Number", value: GLOBAL_BANK_DETAILS.accountNumber },

  ] : [
    { title: "1) Niti Ayog (Darpan)", value: "MH/2015/0093159" },
    { title: "2) Public Trust Act, 1950", value: "E-7269 (24/09/2015)" },
    { title: "3) PAN Card", value: "AAATY4684J" },
    {
      title: "4) Income Tax Exemption",
      value: (
        <>
          12AA 664/242/2015-16 <br />
          80G 6974/228/2016-17
        </>
      ),
    },
    { title: "5) Foreign contribution", value: "FCRA No.- 083930725" },
    { title: "6) Goods and Service Tax (GST)", value: "27AAATY4684J1ZU" },
    { title: "7) TAN", value: "88302012554372" },
    { title: "8) CSR Registration Number", value: "CSR00000374" },
    { title: "9) MSME", value: "MH20D0001233" },
  ];

  // Render dynamic banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="legal-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (legalBanners.length === 0) {
      return (
        <div className="legal-banner">
          <div className="no-banner-message">
            <p>Legal page banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="legal-banner">
        {legalBanners.map((banner) => (
          <div key={banner.id} className="banner-container">
            {banner.media_type === 'image' ? (
              <img
                src={`${UPLOADS_BASE}/banners/${banner.media}`}
                alt={`Legal Reports Banner - ${banner.page}`}
                className="banner-image"
              />
            ) : (
              <video
                src={`${UPLOADS_BASE}/banners/${banner.media}`}
                className="banner-video"
                autoPlay
                muted
                loop
                playsInline
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="legal-page">
      {/* Dynamic Banner */}
      {renderBanner()}

      {/* Legal Status Section */}
      <section className="legal-section">
        <div className="ls-header">
          <h2 className="ls-title">
            Legal Status<span></span>
          </h2>
        </div>

        <div className="table-container">
          <table>
            <tbody>
              {legalStatusData.map((item, index) => {
                const isBankDetailsTitle = item.title === "Bank Details";

                return (
                  <tr key={index}>
                    {isBankDetailsTitle ? (
                      <td colSpan="2" style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem", letterSpacing: "2px" }}>
                        {item.title}
                      </td>
                    ) : (
                      <>
                        <td>{item.title}</td>
                        <td>{item.value}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* All Reports Section */}
      <section className="legal-section">
        <div className="lr-header">
          <h2 className="lr-title">
            All Reports<span></span>
          </h2>
        </div>
        <div className="reports-container">
          {reports.length === 0 ? (
            <p>No reports available</p>
          ) : (
            reports.map((report) => (
              <div className="lr-card" key={report.id}>
                <div className="lr-image">
                  {report.image ? (
                    <img
                      src={`${UPLOADS_BASE}/reports/${report.image}`}
                      alt={report.title}
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="report-content-LR">
                  <h3>{report.title}</h3>
                  <p>{report.description}</p>
                </div>
                <div className="report-actions">
                  {report.pdf ? (
                    <a
                      href={`${UPLOADS_BASE}/reports/${report.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-btn"
                    >
                      Download
                    </a>
                  ) : (
                    <span className="no-pdf">No PDF</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default LegalReports;
