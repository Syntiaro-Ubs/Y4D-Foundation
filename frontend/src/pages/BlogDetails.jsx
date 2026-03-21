// src/pages/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mediaService } from "../api/services/media.service";
import { UPLOADS_BASE } from "../config/api";
import "./BlogDetails.css";
import logger from "../utils/logger";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await mediaService.getMediaById("blogs", id);
        setBlog(blogData);
      } catch (err) {
        logger.error("Error fetching blog:", err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const renderTags = (tags) => {
    if (!tags) return null;
    try {
      const tagArray = typeof tags === "string" ? JSON.parse(tags) : tags;
      return (
        <div className="blog-tags">
          {tagArray.map((tag, idx) => (
            <span key={idx} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      );
    } catch {
      return null;
    }
  };

  if (loading) return <div className="loading">Loading article...</div>;
  if (!blog) return <div className="loading">Article not found.</div>;

  return (
    <div className="blog-details-page">
      <div className="blog-details-container">
        <Link to="/blogs" className="back-link">
          ← Back to Blogs
        </Link>

        <h1 className="blog-title">{blog.title}</h1>

        <div className="blog-meta">
          {blog.author && <span className="author">By {blog.author}</span>}
          {blog.published_date && (
            <span className="date">
              {new Date(blog.published_date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        {renderTags(blog.tags)}

        {/* Top Image (First one) */}
        {(() => {
          let images = [];
          try {
            images = typeof blog.image === 'string' ? JSON.parse(blog.image) : blog.image;
            if (!Array.isArray(images)) images = blog.image ? [blog.image] : [];
          } catch (e) {
            images = blog.image ? [blog.image] : [];
          }
          
          if (images.length > 0) {
            return (
              <div className="blog-image-full featured">
                <img
                  src={`${UPLOADS_BASE}/media/blogs/${images[0]}`}
                  alt={blog.title}
                  onError={(e) => (e.target.src = "/placeholder-blog.jpg")}
                />
              </div>
            );
          }
          return null;
        })()}

        <div className="blog-full-content">
          {blog.description && (
            <p className="description">{blog.description}</p>
          )}

          {blog.content &&
            blog.content
              .split("\n")
              .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)}
        </div>

        {/* Remaining Images at the bottom */}
        {(() => {
          let images = [];
          try {
            images = typeof blog.image === 'string' ? JSON.parse(blog.image) : blog.image;
            if (!Array.isArray(images)) images = blog.image ? [blog.image] : [];
          } catch (e) {
            images = blog.image ? [blog.image] : [];
          }
          
          const remainingImages = images.slice(1);
          if (remainingImages.length > 0) {
            return (
              <div className="blog-additional-images">
                {remainingImages.map((img, idx) => (
                  <div key={idx} className="blog-additional-image-item">
                    <img
                      src={`${UPLOADS_BASE}/media/blogs/${img}`}
                      alt={`${blog.title} - ${idx + 2}`}
                      onError={(e) => (e.target.src = "/placeholder-blog.jpg")}
                    />
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default BlogDetails;
