import React, { useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to scroll to the D3 chart section
  const scrollToChart = () => {
    const chartElement = document.getElementById("radial-chart-section");
    if (chartElement) {
      chartElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to get the user's current location (for Report Emergency)
  const handleEmergencyClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setIsModalOpen(true);  // Open the modal
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>Hospital Recommender</h1>
        </div>

        <div className="header-actions">

          {/* Emergency Report Button */}
          <button className="report-emergency-btn" onClick={handleEmergencyClick}>
            Report Emergency
          </button>
        </div>
      </div>

      {/* Popup Modal for Report Emergency */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Emergency Report</h2>
            <p>Your location has been captured.</p>
            <button className="send-911-btn">Send to 911</button>
            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
