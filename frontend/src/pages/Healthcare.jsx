// src/pages/Healthcare.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Healthcare.css";
import { bannerService } from "../api/services/banners.service";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Healthcare = () => {
  const [items, setItems] = useState([]);
  const [healthcareBanners, setHealthcareBanners] = useState([]);
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

  // Fetch healthcare page banners
  useEffect(() => {
    const fetchHealthcareBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log('🔄 Fetching healthcare page banners...');
        const bannersData = await bannerService.getBanners('our-work', 'healthcare');
        logger.log('✅ Healthcare banners received:', bannersData);
        setHealthcareBanners(bannersData);
      } catch (error) {
        logger.error('❌ Error fetching healthcare banners:', error);
        setHealthcareBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchHealthcareBanners();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // Remove any leading slashes just in case
    const cleanPath = path.replace(/^\/?uploads\/our-work\/healthcare\//, "");
    return `${UPLOADS_BASE}/our-work/healthcare/${cleanPath}`;
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsData = await ourworkService.getItemsByCategory("healthcare", { active_only: true });
      setItems(itemsData);
    } catch (error) {
      logger.error("Error fetching healthcare initiatives:", error);
      setError("Failed to load healthcare initiatives");
    } finally {
      setLoading(false);
    }
  };

  // Render dynamic banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="hc-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (healthcareBanners.length === 0) {
      return (
        <div className="hc-banner">
          <div className="no-banner-message">
            <p>Healthcare banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="hc-banner-slider-container">
        <Slider {...sliderSettings} className="hc-banner-slider">
          {healthcareBanners.map((banner) => (
            <div key={banner.id} className="banner-slide">
              {banner.media_type === 'image' ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt={`Healthcare Banner - ${banner.page}`}
                  className="hc-banner-image"
                />
              ) : (
                <video
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  className="hc-banner-video"
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
      <div className="hc-page">
        <div className="hc-loading">Loading Healthcare Initiatives...</div>
      </div>
    );

  if (error)
    return (
      <div className="hc-page">
        <div className="hc-error">{error}</div>
      </div>
    );

  return (
    <div className="hc-page">
      {/* Dynamic Banner */}
      {renderBanner()}

      <section className="hc-section">
        <div className="hc-container">
          <div className="hc-header">
            <h1 className="hc-title">
              Healthcare Initiatives <span></span>
            </h1>
          </div>

          <div className="hc-grid">
            {items.length === 0 ? (
              <div className="hc-empty">
                <h3>No healthcare initiatives available at the moment</h3>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="hc-card">
                  {item.image_url && (
                    <div className="hc-card-image">
                      <img src={getImageUrl(item.image_url)} alt={item.title} />
                      {item.organization && (
                        <div className="hc-org-badge">{item.organization}</div>
                      )}
                    </div>
                  )}

                  <div className="hc-card-body">
                    <h2 className="hc-card-title">{item.title}</h2>
                    {item.description && (
                      <p className="hc-card-desc">{item.description}</p>
                    )}

                    {item.content && (
                      <SanitizedHTML
                        content={item.content}
                        className="hc-card-details"
                      />
                    )}

                    <div className="hc-card-footer">
                      <Link
                        to={`/healthcare/${item.id}`}
                        className="hc-read-more"
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

export default Healthcare;
