import React from "react";
import { useNavigate } from "react-router-dom";
import "./RegionSelect.css";
import logo from "../../assets/logo.png";

const RegionSelect = () => {
  const navigate = useNavigate();

  const handleSelectRegion = (region) => {
    localStorage.setItem("adminRegion", region);
    navigate("/admin/dashboard");
  };

  return (
    <div className="region-select-container">
      {/* Decorative branding top left */}
      <div className="region-brand">
        <img src={logo} alt="Y4D Admin Logo" className="region-logo" />
      </div>

      <div className="region-header-wrapper">
        <h1 className="region-header">Select Dashboard Region</h1>
        <p className="region-subtitle">
          Choose a regional context to manage exclusive campaigns, local impact
          data, and targeted media content.
        </p>
      </div>

      <div className="region-cards-container">
        {/* India Dashboard Card */}
        <div
          className="region-card india"
          onClick={() => handleSelectRegion("india")}
        >
          <div className="region-icon-wrapper">
            <i className="fas fa-map-marker-alt"></i>
          </div>
          <h2 className="region-card-title">India Dashboard</h2>
          <p className="region-card-description">
            Manage interventions, regional impact statistics, and dedicated
            media corner exclusively for the Y4D India portal.
          </p>
          <i className="fas fa-arrow-right region-card-arrow"></i>
        </div>

        {/* Global Dashboard Card */}
        <div
          className="region-card global"
          onClick={() => handleSelectRegion("global")}
        >
          <div className="region-icon-wrapper">
            <i className="fas fa-globe-americas"></i>
          </div>
          <h2 className="region-card-title">Global Dashboard</h2>
          <p className="region-card-description">
            Manage interventions, regional impact statistics, and dedicated
            media corner exclusively for the Y4D Global portal.
          </p>
          <i className="fas fa-arrow-right region-card-arrow"></i>
        </div>
      </div>
    </div>
  );
};

export default RegionSelect;
