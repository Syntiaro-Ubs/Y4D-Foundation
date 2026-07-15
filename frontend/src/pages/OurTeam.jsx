// src/pages/OurTeam.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./OurTeam.css";
import { bannerService } from "../api/services/banners.service";
import { impactService } from "../api/services/impact.service";
import { UPLOADS_BASE } from "../config/api";
import logger from "../utils/logger";
import { useRegion } from "../hooks/useRegion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const OurTeam = () => {
  const region = useRegion();
  const [mentors, setMentors] = useState([]);
  const [management, setManagement] = useState([]);
  const [trustees, setTrustees] = useState([]);
  const [teamBanners, setTeamBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [loadingManagement, setLoadingManagement] = useState(true);
  const [loadingTrustees, setLoadingTrustees] = useState(true);

  // Fetch team page banners
  useEffect(() => {
    const fetchTeamBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log("🔄 Fetching team page banners...");
        const bannersData = await bannerService.getBanners("our-team", "hero");
        logger.log("✅ Team banners received:", bannersData);
        setTeamBanners(bannersData);
      } catch (error) {
        logger.error("❌ Error fetching team banners:", error);
        setTeamBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchTeamBanners();
  }, []);

  // Fetch mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const data = await impactService.getMentors();
        setMentors(data);
        setLoadingMentors(false);
      } catch (error) {
        logger.error("❌ Error fetching mentors:", error);
        setLoadingMentors(false);
      }
    };
    fetchMentors();
  }, []);

  // Fetch management
  useEffect(() => {
    const fetchManagement = async () => {
      try {
        const data = await impactService.getManagement();
        setManagement(data);
        setLoadingManagement(false);
      } catch (error) {
        logger.error("❌ Error fetching management:", error);
        setLoadingManagement(false);
      }
    };
    fetchManagement();
  }, []);

  useEffect(() => {
    const fetchTrustees = async () => {
      try {
        const data = await impactService.getBoardTrustees();
        setTrustees(data);
        setLoadingTrustees(false);
      } catch (error) {
        logger.error("❌ Error fetching board trustees:", error);
        setLoadingTrustees(false);
      }
    };
    fetchTrustees();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  // Render dynamic banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (teamBanners.length === 0) {
      return (
        <div className="banner">
          <div className="no-banner-message">
            <p>Team page banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="banner">
        <Slider {...sliderSettings}>
          {teamBanners.map((banner) => (
            <div key={banner.id} className="banner-container">
              {banner.media_type === "image" ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt={`Our Team Banner - ${banner.page}`}
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
        </Slider>
      </div>
    );
  };

  return (
    <div className="advisory-page">
      {/* Dynamic Banner */}
      {renderBanner()}

      {/* Board of Trustee */}
      <section className="FOT-section">
        <h2 className="trustee-title">
          {region === "global" ? "Our Board of Directors" : "Our Board of Trustees"}<span></span>
        </h2>
        {loadingTrustees ? (
          <p>Loading board trustees...</p>
        ) : trustees.length === 0 ? (
          <div className="empty-box">
            <p>Content will be added soon...</p>
          </div>
        ) : (
          <div className="team-container">
            {trustees.map((trustee) => (
              <div key={trustee.id} className="team-card">
                {trustee.image ? (
                  <img
                    src={`${UPLOADS_BASE}/board-trustees/${trustee.image}`}
                    alt={trustee.name}
                  />
                ) : null}

                <h3>{trustee.name}</h3>
                <p className="role">{trustee.position}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Our Mentors */}
      {region !== "global" && (
        <section className="OT-section">
          <h2 className="mentors-title">
            Our Mentors <span></span>
          </h2>
          {loadingMentors ? (
            <p>Loading mentors...</p>
          ) : (
            <div className="team-container">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="team-card">
                  <img
                    src={`${UPLOADS_BASE}/mentors/${mentor.image}`}
                    alt={mentor.name}
                  />
                  <h3>{mentor.name}</h3>
                  <p className="role">{mentor.position}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* You May Find Useful */}
      <section className="OT-section">
        <h2 className="useful-title">
          You May Find Useful<span></span>
        </h2>
        <div className="useful-container">
          <div className="useful-card">
            <h3>About Us</h3>
            <p>Learn about our mission, vision, and core values.</p>
            <Link to="/about" className="use-btn">
              Read More
            </Link>
          </div>

          <div className="useful-card">
            <h3>Legal Status</h3>
            <p>Know our compliance, certifications, and registrations.</p>
            <Link to="/legalreports" className="use-btn">
              View Details
            </Link>
          </div>
          <div className="useful-card">
            <h3>Career</h3>
            <p>Explore exciting opportunities to grow with us.</p>
            <Link to="/careers" className="use-btn">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
