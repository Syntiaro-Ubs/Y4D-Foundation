import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import logger from "../utils/logger";
import "./QualityEducationDetail.css";

// --- Helpers ---
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/^\/?api\/uploads\//, "").replace(/^\/?uploads\//, "");
  if (!cleanPath.startsWith("our-work/quality_education/")) {
    const fileOnly = cleanPath.replace(/^our-work\/quality_education\//, "");
    return `${UPLOADS_BASE}/our-work/quality_education/${fileOnly}`;
  }
  return `${UPLOADS_BASE}/${cleanPath}`;
};

// Convert YouTube / Vimeo watch URLs to embeddable URLs
const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("/embed/")) return url;

  // YouTube watch?v=
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  // youtu.be short links
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Vimeo normal links
  if (url.includes("vimeo.com/") && !url.includes("player.vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1];
    return `https://player.vimeo.com/video/${videoId}`;
  }

  return url;
};

// Detect if URL is a direct .mp4 or something embeddable
const isDirectVideoFile = (url) => {
  return url?.match(/\.(mp4|webm|ogg)$/i);
};

const QualityEducationDetail = () => {
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
      const itemData = await ourworkService.getItemById("quality_education", id);
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
      <div className="qe-detail-page">
        <div className="qe-loading">Loading program details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="qe-detail-page">
        <div className="qe-error">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="qe-detail-page">
        <div className="qe-empty">Program not found</div>
      </div>
    );
  }

  // --- Video handling ---
  const videoUrl = item.video_url ? getFullUrl(item.video_url) : "";
  const embedUrl = getEmbedUrl(videoUrl);
  const directVideo = isDirectVideoFile(videoUrl);

  return (
    <div className="qe-detail-page">
      {/* Back link */}
      <div className="qe-detail-back">
        <Link to="/quality-education">← Back to Programs</Link>
      </div>

      {/* Content section */}
      <div className="qe-detail-content">
        {/* Row: image + title + description */}
        <div className="qe-detail-row">
          {item.image_url && (
            <div className="qe-detail-image">
              <img src={getFullUrl(item.image_url)} alt={item.title} />
            </div>
          )}

          <div className="qe-detail-text">
            <h1 className="qe-detail-title">{item.title}</h1>
            <p className="qe-detail-description">{item.description}</p>
          </div>
        </div>

        {/* Content section below the row */}
        {item.content && (
          <SanitizedHTML
            content={item.content}
            className="qe-detail-html"
          />
        )}

        {/* Video section below content */}
        {videoUrl && (
          <div className="qe-detail-video">
            <div className="qe-video-wrapper">
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

export default QualityEducationDetail;
