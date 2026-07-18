import React from "react";
import Slider from "react-slick";
import { UPLOADS_BASE } from "../config/api";
import "./Partners.css";

const Partners1 = ({ partners }) => {
  // Filter for line1 partners
  const line1Partners = partners ? partners.filter(p => p.carousel_line === 'line1') : [];

  // Use dynamic logos if available, otherwise return empty array
  const partnerLogos = line1Partners.length > 0
    ? line1Partners.map(p => `${UPLOADS_BASE}/partners/${p.logo}`)
    : [];

  const isInfinite = partnerLogos.length > 6;
  const settings = {
    slidesToShow: Math.min(6, partnerLogos.length),
    slidesToScroll: 1,
    infinite: isInfinite,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 2000,
    cssEase: "linear",
    arrows: false,
    dots: false,
    pauseOnHover: false,
    pauseOnFocus: false,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(5, partnerLogos.length), infinite: partnerLogos.length > 5 } },
      { breakpoint: 768, settings: { slidesToShow: Math.min(3, partnerLogos.length), infinite: partnerLogos.length > 3 } },
      { breakpoint: 480, settings: { slidesToShow: Math.min(2, partnerLogos.length), infinite: partnerLogos.length > 2 } },
    ],
  };

  if (partnerLogos.length === 0) return null;

  return (
    <section className="partners-section">
      <div className="partners-container">
        <div className="partners-header">
          <h2 className="partner-title">
            Our Partners<span></span>
          </h2>
        </div>
        <Slider {...settings}>
          {partnerLogos.map((logo, index) => (
            <div key={index} className="partner-item">
              <img
                src={logo}
                alt={`Partner ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Partners1;
