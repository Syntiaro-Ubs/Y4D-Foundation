// src/pages/IDPDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";
import "./IDPDetail.css";

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/^\/?api\/uploads\//, "").replace(/^\/?uploads\//, "");
  if (!cleanPath.startsWith("our-work/integrated_development/")) {
    const fileOnly = cleanPath.replace(/^our-work\/integrated_development\//, "");
    return `${UPLOADS_BASE}/our-work/integrated_development/${fileOnly}`;
  }
  return `${UPLOADS_BASE}/${cleanPath}`;
};

// Convert YouTube / Vimeo watch URLs to embeddable URLs
const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("vimeo.com/") && !url.includes("player.vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  return url;
};

// Detect if URL is a direct video file
const isDirectVideoFile = (url) => {
  return url?.match(/\.(mp4|webm|ogg)$/i);
};

const IDPDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const itemData = await ourworkService.getItemById("integrated_development", id);
      setItem(itemData);
    } catch (err) {
      logger.error("Error fetching IDP details:", err);
      setError("Failed to load Integrated Development Initiative details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="idp-detail-page">
        <div className="idp-loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="idp-detail-page">
        <div className="idp-error">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="idp-detail-page">
        <div className="idp-empty">Initiative not found</div>
      </div>
    );
  }

  const videoUrl = item.video_url ? getFullUrl(item.video_url) : "";
  const embedUrl = getEmbedUrl(videoUrl);
  const directVideo = isDirectVideoFile(videoUrl);

  return (
    <div className="idp-detail-page">
      {/* Back link */}
      <div className="idp-detail-back">
        <Link to="/idp">← Back to Integrated Development Programs</Link>
      </div>

      {/* Content row */}
      <div className="idp-detail-content">
        <div className="idp-detail-row">
          {item.image_url && (
            <div className="idp-detail-image">
              <img src={getFullUrl(item.image_url)} alt={item.title} />
            </div>
          )}

          <div className="idp-detail-text">
            <h1 className="idp-detail-title">{item.title}</h1>
            <p className="idp-detail-description">{item.description}</p>
          </div>
        </div>

        {/* HTML content */}
        {item.content && (
          <SanitizedHTML
            content={item.content}
            className="idp-detail-html"
          />
        )}

        {/* Video section */}
        {videoUrl && (
          <div className="idp-detail-video">
            <h3>Watch Video</h3>
            <div className="idp-video-wrapper">
              {directVideo ? (
                <video controls width="100%">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={embedUrl}
                  title={item.title}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDPDetail;
