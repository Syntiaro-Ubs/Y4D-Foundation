// src/pages/Livelihood.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Livelihood.css";
import { bannerService } from "../api/services/banners.service";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Livelihood = () => {
  const [items, setItems] = useState([]);
  const [livelihoodBanners, setLivelihoodBanners] = useState([]);
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

  // Fetch livelihood page banners
  useEffect(() => {
    const fetchLivelihoodBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log('🔄 Fetching livelihood page banners...');
        const bannersData = await bannerService.getBanners('our-work', 'livelihood');
        logger.log('✅ Livelihood banners received:', bannersData);
        setLivelihoodBanners(bannersData);
      } catch (error) {
        logger.error('❌ Error fetching livelihood banners:', error);
        setLivelihoodBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchLivelihoodBanners();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // Remove any leading slashes just in case
    const cleanPath = path.replace(/^\/?uploads\/our-work\/livelihood\//, "");
    return `${UPLOADS_BASE}/our-work/livelihood/${cleanPath}`;
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsData = await ourworkService.getItemsByCategory("livelihood", { active_only: true });
      setItems(itemsData);
    } catch (error) {
      logger.error("Error fetching livelihood programs:", error);
      setError("Failed to load livelihood programs");
    } finally {
      setLoading(false);
    }
  };

  // Render dynamic banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="lv-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (livelihoodBanners.length === 0) {
      return (
        <div className="lv-banner">
          <div className="no-banner-message">
            <p>Livelihood banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="lv-banner-slider-container">
        <Slider {...sliderSettings} className="lv-banner-slider">
          {livelihoodBanners.map((banner) => (
            <div key={banner.id} className="banner-slide">
              {banner.media_type === 'image' ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt={`Livelihood Banner - ${banner.page}`}
                  className="lv-banner-image"
                />
              ) : (
                <video
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  className="lv-banner-video"
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
      <div className="lv-page">
        <div className="lv-loading">Loading Livelihood Programs...</div>
      </div>
    );

  if (error)
    return (
      <div className="lv-page">
        <div className="lv-error">{error}</div>
      </div>
    );

  return (
    <div className="lv-page">
      {/* Dynamic Banner */}
      {renderBanner()}

      <section className="lv-section">
        <div className="lv-container">
          <div className="lv-header">
            <h1 className="lv-title">
              Livelihood Programs <span></span>
            </h1>
          </div>

          <div className="lv-grid">
            {items.length === 0 ? (
              <div className="lv-empty">
                <h3>No livelihood programs available at the moment</h3>
                <p>
                  We are working on creating sustainable livelihood
                  opportunities
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="lv-card">
                  {item.image_url && (
                    <div className="lv-card-image">
                      <img src={getImageUrl(item.image_url)} alt={item.title} />
                      {item.organization && (
                        <div className="lv-org-badge">{item.organization}</div>
                      )}
                    </div>
                  )}

                  <div className="lv-card-body">
                    <h2 className="lv-card-title">{item.title}</h2>
                    {item.description && (
                      <p className="lv-card-desc">{item.description}</p>
                    )}

                    {item.content && (
                      <SanitizedHTML
                        content={item.content}
                        className="lv-card-details"
                      />
                    )}

                    {/* ✅ Read More button */}
                    <div className="lv-card-footer">
                      <Link
                        to={`/livelihood/${item.id}`}
                        className="lv-readmore-btn"
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

export default Livelihood;
