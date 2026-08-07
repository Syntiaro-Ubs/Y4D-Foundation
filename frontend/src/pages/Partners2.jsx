import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { UPLOADS_BASE } from "../config/api";
import "./Partners.css";

const Partners2 = ({ partners }) => {
  // Filter for line2 partners
  const line2Partners = partners ? partners.filter(p => p.carousel_line === 'line2') : [];

  // Use dynamic logos if available, otherwise return empty array
  const partnerLogos = line2Partners.length > 0
    ? line2Partners.map(p => `${UPLOADS_BASE}/partners/${p.logo}`)
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
        <Slider {...settings}>
          {partnerLogos.map((logo, index) => (
            <div key={index} className="partner-item">
              <img
                src={logo}
                alt={`Partner ${index + 28}`}
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

export default Partners2;
