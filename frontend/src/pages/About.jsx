// src/pages/About.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "../pages/About.css";
import pyramidImg from "../assets/Pyramid.png";
import { getBanners } from "../services/api.jsx";
import { UPLOADS_BASE } from "../config/api";
import logger from "../utils/logger";
import { useRegion } from "../hooks/useRegion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const About = () => {
  const navigate = useNavigate();
  const region = useRegion();
  const [aboutBanners, setAboutBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  useEffect(() => {
    const fetchAboutBanners = async () => {
      try {
        setBannersLoading(true);
        logger.log('🔄 Fetching about page banners...');
        const bannersData = await getBanners('about', 'hero');
        logger.log('✅ About banners received:', bannersData);
        setAboutBanners(bannersData);
      } catch (error) {
        logger.error('❌ Error fetching about banners:', error);
        setAboutBanners([]);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchAboutBanners();
  }, []);

  const handleReadMore = () => {
    navigate("/legalreports");
  };

  const sectionRefs = {
    mission: useRef(null),
    vision: useRef(null),
    value: useRef(null),
    philosophy: useRef(null),
    Pyramid: useRef(null),
    work: useRef(null),
    trust: useRef(null),
  };

  const tabs = [
    { id: "mission", label: "MISSION" },
    { id: "vision", label: "VISION" },
    { id: "value", label: "VALUE" },
    { id: "philosophy", label: "PHILOSOPHY OF CHANGE" },
    { id: "Pyramid", label: "PYRAMID OF EMPOWERMENT" },
    { id: "work", label: "HOW WE WORK" },
    { id: "trust", label: "WHY TRUST US?" },
  ];

  const scrollTo = (id) => {
    const element = sectionRefs[id].current;
    const offset = 230;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  // Render dynamic banner
  const renderBanner = () => {
    if (bannersLoading) {
      return (
        <div className="story-banner">
          <div className="loading-banner">Loading banner...</div>
        </div>
      );
    }

    if (aboutBanners.length === 0) {
      return (
        <div className="story-banner">
          <div className="no-banner-message">
            <p>About page banner will appear here once added from dashboard</p>
          </div>
        </div>
      );
    }

    return (
      <div className="story-banner">
        <Slider {...sliderSettings}>
          {aboutBanners.map((banner) => (
            <div key={banner.id} className="banner-container">
              {banner.media_type === 'image' ? (
                <img
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  alt={banner.title}
                  className="banner-image"
                />
              ) : (
                <video
                  src={`${UPLOADS_BASE}/banners/${banner.media}`}
                  className="banner-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              {(banner.title || banner.description) && (
                <div className="banner-overlay">
                  <div className="banner-content">
                    {banner.title && <h1>{banner.title}</h1>}
                    {banner.description && <p>{banner.description}</p>}
                    {banner.button_text && banner.button_link && (
                      <button
                        className="banner-btn"
                        onClick={() => navigate(banner.button_link)}
                      >
                        {banner.button_text}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  const renderTabs = (activeId) => (
    <div className="story-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`story-tab ${activeId === tab.id ? "active" : ""}`}
          onClick={() => scrollTo(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="our-story-page">
      {/* Dynamic Banner */}
      {renderBanner()}

      {/* Mission Section */}
      {renderTabs("mission")}
      <div ref={sectionRefs.mission} id="mission" className="story-section">
        <div className="story-content-container">
          <p>
            {region === 'global' ? (
              // Replace this text with the global website specific vision data
              "As a youth-led global development organization, Y4D advances the Sustainable Development of Communities / Individual by enabling education, employability, health, and environmental action through community-driven and scalable initiatives."
            ) : (
              // This is the India website vision data
              "Y4D is a youth-led, futuristic organization committed to empowering the underserved sections of society by empowering them through 3E formulae of Encouragement, Education, and Employment. Y4D envisions shaping up a sustainable society for future generations."
            )}

          </p>
        </div>
      </div>

      {/* Vision Section */}
      {renderTabs("vision")}
      <div ref={sectionRefs.vision} id="vision" className="story-section">
        <div className="story-content-container">
          <p>
            {region === 'global' ? (
              // Replace this text with the global website specific vision data
              "A world where every individual is empowered with equal access to opportunities for growth and a dignified life."
            ) : (
              // This is the India website vision data
              "Y4D envisions fostering the development of a happy, healthy, and sustainable society in which every individual has an equal opportunity for growth and a life of dignity."
            )}
          </p>
        </div>
      </div>

      {/* Value Section */}
      {renderTabs("value")}
      <div ref={sectionRefs.value} id="value" className="story-section">
        <div className="story-content-container">
          <p>
            {region === 'global' ? (
              // Replace this text with the global website specific vision data
              "Equity • Integrity • Respect • Sustainability"
            ) : (
              // This is the India website vision data
              "To empower underprivileged children, youth and women through relevant education, innovative healthcare and livelihood programmes."
            )}
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      {renderTabs("philosophy")}
      <div
        ref={sectionRefs.philosophy}
        id="philosophy"
        className="story-section"
      >
        <div className="story-content-container">
          <h4>Philosophy of Change:</h4>
          <p>
            At Y4D Foundation, we believe that sustainable transformation begins
            with empowering individuals to become agents of their own change.
            Our philosophy is rooted in three core principles:
          </p>
          <h4>Grassroots Empowerment:</h4>
          <p>
            Real change happens at the community level. We work directly with
            individuals, understanding their unique challenges and building
            solutions that emerge from within their communities.
          </p>
          <h4>Collaborative Growth:</h4>
          <p>
            We don't work for communities, we work with them. Every program is
            designed through active participation, ensuring that beneficiaries
            become partners in their own development journey.
          </p>
          <h4>Sustainable Impact:</h4>
          <p>
            Our interventions are designed to create ripple effects. When we
            empower one individual, they become catalysts for change in their
            families, communities, and beyond.
          </p>
          <h4>The Y4D Approach:</h4>
          <p>
            We don't just provide solutions, we build capacity, transfer
            ownership, and create systems that continue to generate positive
            impact long after our direct intervention ends.
          </p>
        </div>
      </div>

      {/* Pyramid Section */}
      {renderTabs("Pyramid")}
      <div
        ref={sectionRefs.Pyramid}
        id="Pyramid"
        className="story-section pyramid-section"
      >
        <div className="pyramid-container">
          <div className="pyramid-image">
            <img src={pyramidImg} alt="Pyramid of Empowerment" />
          </div>
          <div className="pyramid-text">
            <p>
              The pyramid presents a thoughtful hierarchy for human development
              and well-being, where each level builds upon and strengthens the
              one below it. Starting from the base:
            </p>
            <ul>
              <li>
                <h4>ENVIRONMENT SUSTAINABILITY</h4>
                <p>
                  Crowns the pyramid as the ultimate objective, emphasizing the
                  preservation of our planet for current and future generations.
                  Only when foundational human needs of education, livelihood,
                  and health are met, individuals focus on engaging in
                  sustainable practices and giving back to the society.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="pyramid-lower-content">
          <ul>
            <li>
              <h4>HEALTHCARE</h4>
              <p>
                Depends on a secure livelihood, allowing individuals to invest
                in their physical, mental, and social well-being. With financial
                stability, they can afford quality healthcare services,
                nutritious diets, clean water, and a safe living environment,
                all of which are vital for a productive life.
              </p>
            </li>
            <li>
              <h4>LIVELIHOOD</h4>
              <p>
                Emerges from education, providing economic stability and the
                resources needed to sustain oneself and one's family. This
                includes access to employment, entrepreneurial ventures, or
                other income sources, fostering financial independence and
                resilience.
              </p>
            </li>
            <li>
              <h4>EDUCATION</h4>
              <p>
                Forms the critical foundation, equipping individuals with
                essential knowledge, practical skills, and the ability to think
                critically. This empowers them to seize opportunities, pursue
                personal growth, and lay the groundwork for a stable and
                fulfilling livelihood.
              </p>
            </li>
          </ul>
          <p>
            The pyramid's design highlights a crucial principle: neglecting any
            foundational level threatens the stability of those above it. Each
            layer is intricately linked, working together to advance the broader
            vision of sustainable and thriving living.
          </p>
        </div>
      </div>

      {/* Work Section */}
      {renderTabs("work")}
      <div ref={sectionRefs.work} id="work" className="story-section">
        <div className="story-content-container">
          <p>Our Methodology: The 3E Framework in Action:</p>
          <p style={{ fontWeight: "bold" }}>
            ENCOURAGEMENT - Building confidence and hope
          </p>
          <p style={{ fontWeight: "bold" }}>
            EDUCATION - Providing knowledge and skills
          </p>
          <p style={{ fontWeight: "bold" }}>
            EMPLOYMENT - Creating sustainable opportunities
          </p>
        </div>
      </div>

      {/* Trust Section */}
      {renderTabs("trust")}
      <div ref={sectionRefs.trust} id="trust" className="story-section">
        <div className="story-content-container">
          <p>
            Transparency, accountability and impact measurement are the
            cornerstones of our work...
          </p>
          <div className="read-more-container">
            <button className="read-more-btn" onClick={handleReadMore}>
              Read more &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
