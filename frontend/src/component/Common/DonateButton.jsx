import React from "react";
import { Link, useLocation } from "react-router-dom";
import donateIcon from "../../assets/Donate.png";
import "./DonateButton.css";

const DonateButton = () => {
  const location = useLocation();

  // Hide on DonateNow page
  if (location.pathname === "/DonateNow") {
    return null;
  }

  return (
    <Link to="/DonateNow" className="floating-donate-btn" aria-label="Donate Now">
      <img src={donateIcon} alt="Donate Now" className="floating-donate-img" />
    </Link>
  );
};

export default DonateButton;
