// src/pages/EnvironmentSustainability.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./EnvironmentSustainability.css";
import { bannerService } from "../api/services/banners.service";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/^\/?api\/uploads\//, "").replace(/^\/?uploads\//, "");
  if (!cleanPath.startsWith("our-work/environment_sustainability/")) {
    const fileOnly = cleanPath.replace(/^our-work\/environment_sustainability\//, "");
    return `${UPLOADS_BASE}/our-work/environment_sustainability/${fileOnly}`;
  }
  return `${UPLOADS_BASE}/${cleanPath}`;
};

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EnvironmentSustainability = () => {
  const [items, setItems] = useState([]);
  const [environmentBanners, setEnvironmentBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    adaptiveHeight: true,
  };

  // Fetch environment sustainability page banners
  useEffect(() => {
    const fetchEnvironmentBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log('🔄 Fetching environment sustainability page banners...');
        const bannersData = await bannerService.getBanners('our-work', 'environmental-sustainability');
        logger.log('✅ Environment sustainability banners received:', bannersData);
        setEnvironmentBanners(bannersData);
      } catch (error) {
        logger.error('❌ Error fetching environment sustainability banners:', error);
        setEnvironmentBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchEnvironmentBanners();
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsData = await ourworkService.getItemsByCategory("environment_sustainability", { active_only: true });
      setItems(itemsData);
    } catch (err) {
      logger.error("Error fetching environment sustainability programs:", err);
      setError("Failed to load environment sustainability programs");
    } finally {
      setLoading(false);
    }
  };

  // Render dynamic banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="es-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (environmentBanners.length === 0) {
      return (
        <div className="es-banner">
          <div className="no-banner-message">
            <p>Environment sustainability banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="es-banner-slider-container">
        <Slider {...sliderSettings} className="es-banner-slider">
          {environmentBanners.map((banner) => (
            <div key={banner.id} className="banner-slide">
              {banner.media_type === 'image' ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt={`Environment Sustainability Banner - ${banner.page}`}
                  className="es-banner-image"
                  style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                />
              ) : (
                <video
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  className="es-banner-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%' }}
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
      <div className="es-page">
        <div className="es-loading">
          Loading Environment Sustainability Programs...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="es-page">
        <div className="es-error">{error}</div>
      </div>
    );

  return (
    <div className="es-page">
      {/* Dynamic Banner */}
      {renderBanner()}

      <section className="es-section">
        <div className="es-container">
          <div className="es-header">
            <h1 className="es-title">
              Environment Sustainability <span></span>
            </h1>
          </div>

          <div className="es-grid">
            {items.length === 0 ? (
              <div className="es-empty">
                <h3>No programs available at the moment</h3>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="es-card">
                  {item.image_url && (
                    <div className="es-card-image">
                      <img src={getImageUrl(item.image_url)} alt={item.title} />
                      {item.organization && (
                        <div className="es-org-badge">{item.organization}</div>
                      )}
                    </div>
                  )}

                  <div className="es-card-body">
                    <h2 className="es-card-title">{item.title}</h2>
                    <p className="es-card-desc">{item.description}</p>

                    {item.content && (
                      <SanitizedHTML
                        content={item.content}
                        className="es-card-details"
                      />
                    )}

                    <div className="es-card-footer">
                      <Link
                        to={`/environment-sustainability/${item.id}`}
                        className="es-read-more"
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

export default EnvironmentSustainability;
