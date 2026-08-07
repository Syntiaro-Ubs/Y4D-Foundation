import React, { useState } from "react";
import "./DetailImageGallery.css";

const DetailImageGallery = ({ images = [], title = "" }) => {
  const [activeModalIndex, setActiveModalIndex] = useState(null);

  if (!images || images.length === 0) return null;

  const openLightbox = (index) => {
    setActiveModalIndex(index);
  };

  const closeLightbox = () => {
    setActiveModalIndex(null);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveModalIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveModalIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const renderGalleryLayout = () => {
    const total = images.length;

    // Single image
    if (total === 1) {
      return (
        <div className="gallery-single" onClick={() => openLightbox(0)}>
          <img src={images[0]} alt={title} />
          <div className="gallery-hover-overlay">
            <i className="fas fa-search-plus"></i> View Full Image
          </div>
        </div>
      );
    }

    // Two images
    if (total === 2) {
      return (
        <div className="gallery-grid gallery-grid-2">
          {images.map((img, idx) => (
            <div key={idx} className="gallery-item" onClick={() => openLightbox(idx)}>
              <img src={img} alt={`${title} ${idx + 1}`} />
              <div className="gallery-hover-overlay">
                <i className="fas fa-search-plus"></i>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Three images
    if (total === 3) {
      return (
        <div className="gallery-grid gallery-grid-3">
          <div className="gallery-item item-main" onClick={() => openLightbox(0)}>
            <img src={images[0]} alt={`${title} 1`} />
            <div className="gallery-hover-overlay">
              <i className="fas fa-search-plus"></i>
            </div>
          </div>
          <div className="gallery-side-col">
            {images.slice(1, 3).map((img, idx) => (
              <div key={idx + 1} className="gallery-item" onClick={() => openLightbox(idx + 1)}>
                <img src={img} alt={`${title} ${idx + 2}`} />
                <div className="gallery-hover-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Four or more images (Collage with +X overlay if > 4)
    const displayImages = images.slice(0, 4);
    const extraCount = total - 4;

    return (
      <div className="gallery-grid gallery-grid-4">
        <div className="gallery-item item-main" onClick={() => openLightbox(0)}>
          <img src={images[0]} alt={`${title} 1`} />
          <div className="gallery-hover-overlay">
            <i className="fas fa-search-plus"></i>
          </div>
        </div>
        <div className="gallery-side-grid">
          {displayImages.slice(1).map((img, idx) => {
            const actualIdx = idx + 1;
            const isLast = idx === 2 && extraCount > 0;

            return (
              <div
                key={actualIdx}
                className={`gallery-item ${isLast ? "item-with-more" : ""}`}
                onClick={() => openLightbox(actualIdx)}
              >
                <img src={img} alt={`${title} ${actualIdx + 1}`} />
                {isLast ? (
                  <div className="gallery-more-overlay">
                    <i className="fas fa-images"></i>
                    <span>+{extraCount} More</span>
                  </div>
                ) : (
                  <div className="gallery-hover-overlay">
                    <i className="fas fa-search-plus"></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="detail-gallery-container">
      {renderGalleryLayout()}

      {/* Lightbox Modal */}
      {activeModalIndex !== null && (
        <div className="gallery-lightbox-overlay" onClick={closeLightbox}>
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={closeLightbox}>
              &times;
            </button>

            {images.length > 1 && (
              <button className="lightbox-nav-btn prev-btn" onClick={prevImage}>
                &#10094;
              </button>
            )}

            <div className="lightbox-image-wrapper">
              <img
                src={images[activeModalIndex]}
                alt={`${title} - Full View ${activeModalIndex + 1}`}
              />
            </div>

            {images.length > 1 && (
              <button className="lightbox-nav-btn next-btn" onClick={nextImage}>
                &#10095;
              </button>
            )}

            <div className="lightbox-footer-info">
              <span>
                {activeModalIndex + 1} of {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailImageGallery;
