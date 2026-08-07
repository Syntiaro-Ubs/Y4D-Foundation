// src/pages/QualityEducation.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./QualityEducation.css";
import { bannerService } from "../api/services/banners.service";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const QualityEducation = () => {
  const [items, setItems] = useState([]);
  const [educationBanners, setEducationBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    adaptiveHeight: true,
  };

  // Fetch quality education page banners
  useEffect(() => {
    const fetchEducationBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log('🔄 Fetching quality education page banners...');
        const bannersData = await bannerService.getBanners('our-work', 'quality-education');
        logger.log('✅ Quality education banners received:', bannersData);
        setEducationBanners(bannersData);
      } catch (error) {
        logger.error('❌ Error fetching quality education banners:', error);
        setEducationBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchEducationBanners();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // Remove any leading slashes just in case
    const cleanPath = path.replace(
      /^\/?uploads\/our-work\/quality_education\//,
      ""
    );
    return `${UPLOADS_BASE}/our-work/quality_education/${cleanPath}`;
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsData = await ourworkService.getItemsByCategory("quality_education", { active_only: true });
      setItems(itemsData);
    } catch (error) {
      logger.error("Error fetching quality education programs:", error);
      setError("Failed to load quality education programs");
    } finally {
      setLoading(false);
    }
  };

  // Render dynamic banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="qe-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (educationBanners.length === 0) {
      return (
        <div className="qe-banner">
          <div className="no-banner-message">
            <p>Quality Education banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    // Use slider if there are banners (even 1, consistency is good, creates a wrapper)
    // If specifically want strictly image for 1, can add condition. But Slider works for 1.
    return (
      <div className="qe-banner-slider-container">
        <Slider {...sliderSettings} className="qe-banner-slider">
          {educationBanners.map((banner) => (
            <div key={banner.id} className="banner-slide">
              {banner.media_type === 'image' ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt={`Quality Education Banner - ${banner.page}`}
                  className="qe-banner-image"
                />
              ) : (
                <video
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  className="qe-banner-video"
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

  if (loading)
    return (
      <div className="qe-page">
        <div className="qe-loading">Loading Quality Education Programs...</div>
      </div>
    );
  if (error)
    return (
      <div className="qe-page">
        <div className="qe-error">{error}</div>
      </div>
    );

  return (
    <div className="qe-page">
      {/* Dynamic Banner */}
      {renderBanner()}

      <section className="qe-section">
        <div className="qe-container">
          <div className="qe-header">
            <h1 className="qe-title">
              Quality Education Programs <span></span>
            </h1>
          </div>

          <div className="qe-grid">
            {items.length === 0 ? (
              <div className="qe-empty">
                <h3>No quality education programs available at the moment</h3>
                <p>
                  We are working on bringing educational programs to communities
                  in need
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="qe-card">
                  {item.image_url && (
                    <div className="qe-card-image">
                      <img src={getImageUrl(item.image_url)} alt={item.title} />

                      {item.organization && (
                        <div className="qe-org-badge">{item.organization}</div>
                      )}
                    </div>
                  )}

                  <div className="qe-card-body">
                    <h2 className="qe-card-title">{item.title}</h2>
                    {item.description && (
                      <p className="qe-card-desc">{item.description}</p>
                    )}

                    {item.content && (
                      <SanitizedHTML
                        content={item.content}
                        className="qe-card-details"
                      />
                    )}

                    {/* Read More button */}
                    <div className="qe-card-footer">
                      <Link
                        to={`/quality-education/${item.id}`}
                        className="qe-read-more"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default QualityEducation;
