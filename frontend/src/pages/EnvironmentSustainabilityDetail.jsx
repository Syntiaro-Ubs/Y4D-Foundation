// src/pages/EnvironmentSustainabilityDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import DetailImageGallery from "../component/Common/DetailImageGallery";
import logger from "../utils/logger";
import "./EnvironmentSustainabilityDetail.css";

// --- Helpers ---
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  // Remove any leading slashes just in case
  const cleanPath = path.replace(
    /^\/?uploads\/our-work\/environment_sustainability\//,
    ""
  );
  return `${UPLOADS_BASE}/our-work/environment_sustainability/${cleanPath}`;
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

const getItemImages = (item) => {
  if (!item) return [];
  const images = [];

  if (item.image_url) {
    const mainUrl = getFullUrl(item.image_url);
    if (mainUrl) images.push(mainUrl);
  }

  if (item.additional_images) {
    let raw = item.additional_images;
    let list = [];

    if (typeof raw === "string") {
      raw = raw.trim();
      if (raw.startsWith("[") && raw.endsWith("]")) {
        try {
          list = JSON.parse(raw);
        } catch (e) {
          const dataUrlMatches = raw.match(/data:image\/[^;]+;base64,[^"',\]]+/gi);
          if (dataUrlMatches) {
            list = dataUrlMatches;
          }
        }
      } else if (raw.includes(",")) {
        list = raw.split(",").map((s) => s.trim());
      } else if (raw.length > 0) {
        list = [raw];
      }
    } else if (Array.isArray(raw)) {
      list = raw;
    }

    if (Array.isArray(list)) {
      list.forEach((img) => {
        if (img) {
          const imgPath = typeof img === "object" ? (img.path || img.filename || img.url) : img;
          if (imgPath) {
            const url = getFullUrl(imgPath);
            if (url && !images.includes(url)) {
              images.push(url);
            }
          }
        }
      });
    }
  }

  return images;
};

const EnvironmentSustainabilityDetail = () => {
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
      const itemData = await ourworkService.getItemById("environment_sustainability", id);
      setItem(itemData);
    } catch (err) {
      logger.error("Error fetching environment sustainability details:", err);
      setError("Failed to load initiative details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="es-detail-page">
        <div className="es-loading">
          Loading Environment Sustainability Initiative...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="es-detail-page">
        <div className="es-error">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="es-detail-page">
        <div className="es-empty">Initiative not found</div>
      </div>
    );
  }

  const videoUrl = item.video_url ? getFullUrl(item.video_url) : "";
  const embedUrl = getEmbedUrl(videoUrl);
  const directVideo = isDirectVideoFile(videoUrl);

  return (
    <div className="es-detail-page">
      {/* Back link */}
      <div className="es-detail-back">
        <Link to="/environment-sustainability">
          ← Back to Environment Sustainability Programs
        </Link>
      </div>

      {/* Content container */}
      <div className="es-detail-content">
        {/* Title */}
        <div className="es-detail-header-block">
          <h1 className="es-detail-title">{item.title}</h1>
        </div>

        {/* Gallery Collage */}
        <DetailImageGallery images={getItemImages(item)} title={item.title} />

        {/* HTML content below gallery */}
        {item.content && (
          <SanitizedHTML
            content={item.content}
            className="es-detail-html"
          />
        )}

        {/* Video section */}
        {videoUrl && (
          <div className="es-detail-video">
            <div className="es-video-wrapper">
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

export default EnvironmentSustainabilityDetail;
