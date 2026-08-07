// src/pages/Documentaries.jsx
import React, { useState, useEffect } from "react";
import "./Documentaries.css";
import { bannerService } from "../api/services/banners.service";
import { mediaService } from "../api/services/media.service";
import { UPLOADS_BASE } from "../config/api";
import logger from "../utils/logger";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Documentaries = () => {
  const [documentaries, setDocumentaries] = useState([]);
  const [docsBanners, setDocsBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Fetch dynamic banners
  useEffect(() => {
    const fetchDocsBanners = async () => {
      try {
        setBannersLoading(true);
        const bannersData = await bannerService.getBanners("media-corner", "documentaries");
        setDocsBanners(bannersData);
      } catch (error) {
        logger.error("❌ Error fetching documentaries banners:", error);
        setDocsBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchDocsBanners();
  }, []);

  // Fetch documentaries
  useEffect(() => {
    fetchDocumentaries();
  }, []);

  const fetchDocumentaries = async () => {
    try {
      const documentariesData = await mediaService.getPublishedMedia("documentaries");
      setDocumentaries(documentariesData);
    } catch (error) {
      logger.error("Error fetching documentaries:", error);
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

  // Render banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="documentaries-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (docsBanners.length === 0) {
      return (
        <div className="documentaries-banner">
          <div className="no-banner-message">
            <p>Documentaries banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="documentaries-banner">
        <Slider {...sliderSettings}>
          {docsBanners.map((banner) => (
            <div key={banner.id} className="banner-container">
              {banner.media_type === "image" ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt="Documentaries Banner"
                  className="documentaries-banner-image"
                />
              ) : (
                <video
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  autoPlay
                  muted
                  loop
                  className="documentaries-banner-video"
                />
              )}
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  // Open modal
  const openDocModal = (doc) => {
    logger.log("🎬 Opening documentary:", doc);
    setSelectedDoc(doc);
  };

  const closeDocModal = () => setSelectedDoc(null);

  // Extract embed URLs for YouTube/Vimeo
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    const ytRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const matchYT = url.match(ytRegex);
    if (matchYT) return `https://www.youtube.com/embed/${matchYT[1]}`;

    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const matchVimeo = url.match(vimeoRegex);
    if (matchVimeo) return `https://player.vimeo.com/video/${matchVimeo[1]}`;

    return url; // fallback
  };

  const isExternalVideo = (videoUrl) =>
    videoUrl &&
    (videoUrl.includes("youtube.com") ||
      videoUrl.includes("youtu.be") ||
      videoUrl.includes("vimeo.com"));

  // Smart video rendering logic
  const renderVideoPlayer = (doc) => {
    logger.log("🎥 Rendering video:", doc);

    // 1) External video (YouTube/Vimeo)
    if (doc.video_url && isExternalVideo(doc.video_url)) {
      const embed = getYouTubeEmbedUrl(doc.video_url);
      return (
        <iframe
          src={embed}
          title={doc.title}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    // 2) Uploaded video file
    if (doc.video_filename) {
      const videoPath = `${UPLOADS_BASE}/media/documentaries/${doc.video_filename}`;
      return (
        <video controls autoPlay className="uploaded-video">
          <source src={videoPath} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      );
    }

    // 3) Direct video URL (non-YouTube)
    if (doc.video_url) {
      return (
        <video controls autoPlay className="uploaded-video">
          <source src={doc.video_url} type="video/mp4" />
        </video>
      );
    }

    // 4) No video available
    return (
      <div className="no-video-message">
        <p>Video content not available</p>
      </div>
    );
  };

  if (loading)
    return <div className="loading">Loading documentaries...</div>;

  return (
    <div className="documentaries-container">
      {renderBanner()}

      <div className="documentaries-page">
        <div className="page-header">
          <h1>
            Documentaries<span></span>
          </h1>
          <p>Watch our inspiring video content and stories</p>
        </div>

        {/* Documentaries Grid */}
        <div className="documentaries-grid">
          {documentaries.length === 0 ? (
            <div className="empty-state">
              <p>No documentaries available at the moment</p>
            </div>
          ) : (
            documentaries.map((doc) => (
              <div key={doc.id} className="documentary-card">
                {doc.thumbnail && (
                  <div className="doc-thumbnail">
                    <img
                      src={`${UPLOADS_BASE}/media/documentaries/${doc.thumbnail}`}
                      alt={doc.title}
                      onError={(e) => (e.target.src = "/placeholder-video.jpg")}
                    />
                    <div
                      className="play-overlay"
                      onClick={() => openDocModal(doc)}
                    >
                      <span className="play-icon">▶</span>
                    </div>
                  </div>
                )}

                <div className="doc-content">
                  <h3>{doc.title}</h3>
                  <p className="doc-description">
                    {doc.description && doc.description.length > 100
                      ? doc.description.substring(0, 35) + "..."
                      : doc.description || "No description available"}
                  </p>



                  <button
                    className="btn-watch"
                    onClick={() => openDocModal(doc)}
                  >
                    Watch Documentary
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {selectedDoc && (
          <div className="modal-overlay" onClick={closeDocModal}>
            <div
              className="modal-content doc-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{selectedDoc.title}</h2>
                <button className="dc-close-btn" onClick={closeDocModal}>
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="video-container">
                  {renderVideoPlayer(selectedDoc)}
                </div>

                <div className="doc-details">
                  <h3>Description</h3>
                  <p>{selectedDoc.description || "No description available"}</p>

                  <div className="doc-meta-full">
                    <p>
                      <strong>Published:</strong>{" "}
                      {new Date(selectedDoc.published_date).toLocaleDateString(
                        "en-US"
                      )}
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Documentaries;
