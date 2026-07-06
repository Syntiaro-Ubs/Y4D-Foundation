// src/pages/LivelihoodDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";
import { useRegion } from "../hooks/useRegion";
import "./LivelihoodDetail.css";

const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/^\/?api\/uploads\//, "").replace(/^\/?uploads\//, "");
  if (!cleanPath.startsWith("our-work/livelihood/")) {
    const fileOnly = cleanPath.replace(/^our-work\/livelihood\//, "");
    return `${UPLOADS_BASE}/our-work/livelihood/${fileOnly}`;
  }
  return `${UPLOADS_BASE}/${cleanPath}`;
};

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

const isDirectVideoFile = (url) => {
  return url?.match(/\.(mp4|webm|ogg)$/i);
};

const LivelihoodDetail = () => {
  const region = useRegion();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItem = async () => {
    try {
      const itemData = await ourworkService.getItemById("livelihood", id);
      setItem(itemData);
    } catch (err) {
      logger.error("Error fetching details:", err);
      setError("Failed to load program details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lv-detail-page">
        <div className="lv-loading">Loading program details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lv-detail-page">
        <div className="lv-error">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="lv-detail-page">
        <div className="lv-empty">Program not found</div>
      </div>
    );
  }

  const videoUrl = item.video_url ? getFullUrl(item.video_url) : "";
  const embedUrl = getEmbedUrl(videoUrl);
  const directVideo = isDirectVideoFile(videoUrl);

  return (
    <div className="lv-detail-page">
      {/* Back link */}
      <div className="lv-detail-back">
        <Link to="/livelihood">
          {region === "global" ? "← Back to Sustainable Livelihood Programs" : "← Back to Livelihood Programs"}
        </Link>
      </div>

      {/* Content container */}
      <div className="lv-detail-content">
        {/* Row: image + title/description */}
        <div className="lv-detail-row">
          {item.image_url && (
            <div className="lv-detail-image">
              <img src={getFullUrl(item.image_url)} alt={item.title} />
            </div>
          )}

          <div className="lv-detail-text">
            <h1 className="lv-detail-title">{item.title}</h1>
            <p className="lv-detail-description">{item.description}</p>
          </div>
        </div>

        {/* HTML content below the row */}
        {item.content && (
          <SanitizedHTML
            content={item.content}
            className="lv-detail-html"
          />
        )}

        {/* Video section */}
        {videoUrl && (
          <div className="lv-detail-video">
            <div className="lv-video-wrapper">
              {directVideo ? (
                <video controls>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={embedUrl}
                  title={item.title}
                  width="100%"
                  height="350"
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

export default LivelihoodDetail;
