import React from "react";
import "./Footer.css";
import { useRegion } from "../../hooks/useRegion";

const Footer = () => {
  const region = useRegion();
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left side links (4 columns) - unchanged */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li>
                <a href="/reach-presence">Reach & Presence</a>
              </li>
              <li>
                <a href="/our-team">Our Team</a>
              </li>
              <li>
                <a href="/LegalReports">Legal Status</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Our Work</h4>
            <ul>
              <li>
                <a href="/quality-education">Quality Education</a>
              </li>
              {region !== "global" && (
                <>
                  <li>
                    <a href="/livelihood">Livelihood</a>
                  </li>
                  <li>
                    <a href="/healthcare">Healthcare</a>
                  </li>
                  <li>
                    <a href="/environment-sustainability">
                      Envirnment Sustainability
                    </a>
                  </li>
                  <li>
                    <a href="/idp">IDP</a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {region !== "global" && (
            <div className="footer-column">
              <h4>Satellite offices</h4>
              <ul>
                <li>
                  <a>Palghar</a>
                </li>
                <li>
                  <a>Washim</a>
                </li>
                <li>
                  <a>Chennai</a>
                </li>
              </ul>
            </div>
          )}

          <div className="footer-column">
            <h4>Media Corner</h4>
            <ul>
              {region !== "global" && (
                <li>
                  <a href="/newsletters">Newsletters</a>
                </li>
              )}
              <li>
                <a href="/stories">Stories of Empowerment</a>
              </li>
              {region !== "global" && (
                <li>
                  <a href="/events">Events</a>
                </li>
              )}
              <li>
                <a href="/blogs">Blogs</a>
              </li>
              {region !== "global" && (
                <li>
                  <a href="/documentaries">Documentaries</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Row with Address + Social + LinkedIn */}
      <div className="footer-bottom">
        <div className="footer-left">
          <div className="footer-address">
            <p style={{ fontWeight: "bold" }}>
              {region === "global" ? "Postal Address:" : "Head Office:"}
            </p>
            <a
              href={
                region === "global"
                  ? "https://www.google.com/maps/search/?api=1&query=322+Bellis+Ct,+Bridgewater,+NJ+08807"
                  : "https://www.google.com/maps/search/?api=1&query=Y4D+Foundation,+402,+The+Onyx,+Near+Euro+School,+Wakad,+Pune,+Maharashtra,+India+411057"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="footer-address-link"
            >
              {region === "global" ? (
                <>
                  322 Bellis Ct., Bridgewater,
                  <br /> New Jersey, 08807
                </>
              ) : (
                <>
                  4th Floor, Near Euro School,
                  <br /> Wakad, Pune- 411057
                </>
              )}
            </a>

            <p style={{ fontWeight: "bold", marginTop: "10px" }}>
              {region === "global" ? "Registered Address:" : "Mumbai Office:"}
            </p>
            <a
              href={
                region === "global"
                  ? "https://www.google.com/maps/search/?api=1&query=1401+21ST,+Sacramento,+CA+95811"
                  : "https://www.google.com/maps/search/?api=1&query=305+A,+Janmabhoomi+Chambers,+Ballard+Estate,+Mumbai+38"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="footer-address-link"
            >
              {region === "global"
                ? "1401, 21ST, Sacramento, California, 95811"
                : "305 A, Janmabhoomi Chambers, Ballard Estate, Mumbai-38"}
            </a>
          </div>
          <br />
          <br />

          <div className="footer-social">
            <p
              style={{
                marginBottom: "0px",
                fontWeight: "bolder",
                fontSize: "18px",
              }}
            >
              Social Media Handles:
            </p>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/Y4DTeam"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://x.com/intent/follow?source=followbutton&variant=1.0&screen_name=y4dteam"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="25"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/y4dteam/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.linkedin.com/company/y4dteam/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="https://www.youtube.com/user/Y4DTeam"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-linkedin">
          <h4>LinkedIn</h4>

          {/* 🔥 Elfsight LinkedIn Feed Widget */}
          <div className="linkedin-feed-widget">
            <div
              className="elfsight-app-3b4f6f57-5208-4fa8-b529-eb60587c8051"
              data-elfsight-app-lazy
            ></div>
          </div>
        </div>
      </div>
      <div className="footer-bottom-syntiaro">
        <p style={{ letterSpacing: "2px", color: "white" }}>
          Design and Developed By {' '}
          <a href="https://www.syntiaro.com" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
            SYNTIARO
          </a>{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
