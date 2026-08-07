import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ourworkService } from "../api/services/ourwork.service";
import { UPLOADS_BASE } from "../config/api";
import SanitizedHTML from "../component/Common/SanitizedHTML";
import DetailImageGallery from "../component/Common/DetailImageGallery";
import logger from "../utils/logger";
import "./QualityEducationDetail.css";

// --- Helpers ---
const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;

  // Remove any leading slashes just in case
  const cleanPath = path.replace(
    /^\/?uploads\/our-work\/quality_education\//,
    ""
  );
  return `${UPLOADS_BASE}/our-work/quality_education/${cleanPath}`;
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
        {/* Title */}
        <div className="qe-detail-header-block">
          <h1 className="qe-detail-title">{item.title}</h1>
        </div>

        {/* Gallery Collage */}
        <DetailImageGallery images={getItemImages(item)} title={item.title} />

        {/* Content section below gallery */}
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
