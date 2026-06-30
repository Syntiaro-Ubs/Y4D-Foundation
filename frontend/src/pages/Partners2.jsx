import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { partnersService } from "../api/services/partners.service";
import { API_BASE } from "../config/api";
import logger from "../utils/logger";
import "./Partners.css";

const Partners2 = () => {
  const [partnerLogos, setPartnerLogos] = useState([]);
  const [isFallback, setIsFallback] = useState(false);

  // Generate fallback logos 28–55
  const fallbackLogos = Array.from({ length: 28 }, (_, i) => {
    const num = (i + 28).toString().padStart(2, "0");
    return {
      id: `fallback-${num}`,
      name: `Partner ${num}`,
      logo: `Partners-${num}.png`,
      isFallback: true
    };
  });

  useEffect(() => {
    const loadPartners = async () => {
      try {
        // Fetch India and 'both' partners from backend
        const data = await partnersService.getPartners("india");
        // Filter for Line 2 (Partners2 slider)
        const line2Partners = data.filter(
          (p) => p.carousel_line === "line2" && (p.is_active === 1 || p.is_active === true)
        );

        if (line2Partners.length > 0) {
          setPartnerLogos(line2Partners);
          setIsFallback(false);
        } else {
          setPartnerLogos(fallbackLogos);
          setIsFallback(true);
        }
      } catch (error) {
        logger.error("Error loading partners line 2:", error);
        setPartnerLogos(fallbackLogos);
        setIsFallback(true);
      }
    };

    loadPartners();
  }, []);

  const settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    infinite: true,
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
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <section className="partners-section">
      <div className="partners-container">
        {partnerLogos.length > 0 && (
          <Slider {...settings}>
            {partnerLogos.map((partner) => {
              const srcUrl = partner.isFallback
                ? `/partners/${partner.logo}`
                : `${API_BASE}/uploads/partners/${partner.logo}`;
              return (
                <div key={partner.id} className="partner-item">
                  <img
                    src={srcUrl}
                    alt={partner.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Fallback to static public path if server path fails
                      e.target.src = `/partners/${partner.logo}`;
                    }}
                  />
                </div>
              );
            })}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default Partners2;
