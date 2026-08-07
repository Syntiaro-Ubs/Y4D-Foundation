// src/pages/Stories.jsx
import React, { useState, useEffect } from "react";
import "./Stories.css";
import { bannerService } from "../api/services/banners.service";
import { mediaService } from "../api/services/media.service";
import { UPLOADS_BASE } from "../config/api";
import logger from "../utils/logger";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Stories = () => {
  const [stories, setStories] = useState([]);
  const [storiesBanners, setStoriesBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(null);

  // Fetch stories page banners
  useEffect(() => {
    const fetchStoriesBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log("🔄 Fetching stories page banners...");
        const bannersData = await bannerService.getBanners("media-corner", "stories");
        logger.log("✅ Stories banners received:", bannersData);
        setStoriesBanners(bannersData);
      } catch (error) {
        logger.error("❌ Error fetching stories banners:", error);
        setStoriesBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchStoriesBanners();
  }, []);

  useEffect(() => {
    fetchStories();
  }, []);

  const getPlainTextPreview = (text, maxLength = 150) => {
    if (!text) return "";
    const withoutTags = text.replace(/<[^>]+>/g, " ");
    const decoder = document.createElement("textarea");
    decoder.innerHTML = withoutTags;
    const plainText = decoder.value.replace(/\s+/g, " ").trim();
    return plainText.length > maxLength
      ? `${plainText.substring(0, maxLength)}...`
      : plainText;
  };

  const formatStoryContent = (content) => {
    if (!content) return "";
    const hasHTML = /<[a-z][\s\S]*>/i.test(content);
    if (hasHTML) {
      return content;
    }
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => `<p>${line}</p>`)
      .join("");
  };

  const fetchStories = async () => {
    try {
      const storiesData = await mediaService.getPublishedMedia("stories");
      setStories(storiesData);
    } catch (error) {
      logger.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const sliderSettings = {
    dots: true,
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
        <div className="stories-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (storiesBanners.length === 0) {
      return (
        <div className="stories-banner">
          <div className="no-banner-message">
            <p>Stories banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="stories-banner">
        <Slider {...sliderSettings}>
          {storiesBanners.map((banner) => (
            <div key={banner.id} className="banner-container">
              {banner.media_type === "image" ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt={`Stories Banner - ${banner.page}`}
                  className="stories-banner-image"
                />
              ) : (
                <video
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  className="stories-banner-video"
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

  const openStoryModal = (story) => setSelectedStory(story);
  const closeStoryModal = () => setSelectedStory(null);

  if (loading) {
    return (
      <div className="st-page">
        <div className="st-loading">Loading stories...</div>
      </div>
    );
  }

  return (
    <div className="stories-container">
      {/* Dynamic Banner */}
      {renderBanner()}
      <div className="st-page">
        <section className="st-section">
          <div className="st-container">
            <div className="st-header">
              <h1 className="st-title">
                Stories of Empowerment<span></span>
              </h1>
              <p className="st-subtitle">
                Inspiring success stories from our community
              </p>
            </div>

            <div className="st-grid">
              {stories.length === 0 ? (
                <div className="st-empty">
                  <h3>No stories available at the moment</h3>
                </div>
              ) : (
                stories.map((story) => (
                  <div key={story.id} className="st-card">
                    {story.image && (
                      <div className="st-card-image">
                        <img
                          src={`${UPLOADS_BASE}/media/stories/${story.image}`}
                          alt={story.title}
                          onError={(e) => {
                            e.target.src = "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    )}

                    <div className="st-card-body">
                      <h2 className="st-card-title">{story.title}</h2>
                      <p className="st-card-desc">
                        {getPlainTextPreview(story.content, 150)}
                      </p>

                      <div className="st-card-footer">
                        <button
                          onClick={() => openStoryModal(story)}
                          className="st-read-more"
                        >
                          Read Full Story
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Modal */}
        {selectedStory && (
          <div className="st-modal-overlay" onClick={closeStoryModal}>
            <div
              className="st-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="st-modal-header">
                <h2>{selectedStory.title}</h2>
                <button onClick={closeStoryModal} className="st-close-btn">
                  &times;
                </button>
              </div>
              <div className="st-modal-body">
                {selectedStory.image && (
                  <div className="st-modal-image">
                    <img
                      src={`${UPLOADS_BASE}/media/stories/${selectedStory.image}`}
                      alt={selectedStory.title}
                    />
                  </div>
                )}

                <SanitizedHTML
                  content={formatStoryContent(selectedStory.content)}
                  className="st-full-content"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
