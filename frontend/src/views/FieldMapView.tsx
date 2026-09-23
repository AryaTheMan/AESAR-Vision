import React from "react";

export const FieldMapView: React.FC = () => {
  return (
    <div className="view-container field-map-view">
      <div className="view-intro">
        <div>
          <h2>Field Mapping</h2>
          <p className="section-desc">
            GPS-tagged crop-health mapping will be available in a future phase.
          </p>
        </div>
      </div>

      <div className="placeholder-container">
        <div className="placeholder-visual-box">
          <div className="blueprint-grid">
            <svg width="100%" height="280" viewBox="0 0 600 280" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e0e8e3" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
              
              {/* Field Boundaries Graphic */}
              <polygon points="80,50 420,40 520,230 140,240" fill="#2d6a4f" fillOpacity="0.06" stroke="#2d6a4f" strokeWidth="2" strokeDasharray="6 4" />
              <polygon points="120,70 380,65 460,210 170,215" fill="#40916c" fillOpacity="0.04" stroke="#40916c" strokeWidth="1.5" strokeDasharray="4 4" />
              
              {/* Planned Flight Path */}
              <path d="M 100 80 Q 250 110 400 90 T 480 180 T 150 200" fill="none" stroke="#52b788" strokeWidth="2.5" />
              
              {/* Waypoint Nodes */}
              <circle cx="100" cy="80" r="5" fill="#1b4332" />
              <circle cx="260" cy="100" r="5" fill="#1b4332" />
              <circle cx="400" cy="90" r="5" fill="#1b4332" />
              <circle cx="480" cy="180" r="5" fill="#1b4332" />
              <circle cx="150" cy="200" r="5" fill="#1b4332" />
              
              {/* UAV Icon */}
              <g transform="translate(260, 95)">
                <circle cx="0" cy="0" r="14" fill="#1b4332" />
                <path d="M -10 -10 L 10 10 M -10 10 L 10 -10" stroke="#ffffff" strokeWidth="2" />
                <circle cx="-10" cy="-10" r="3" fill="#74c69d" />
                <circle cx="10" cy="-10" r="3" fill="#74c69d" />
                <circle cx="-10" cy="10" r="3" fill="#74c69d" />
                <circle cx="10" cy="10" r="3" fill="#74c69d" />
              </g>
            </svg>
          </div>

          <div className="placeholder-badge">
            <span>PLANNED CAPABILITY · PHASE 4</span>
          </div>
        </div>

        <div className="placeholder-info-card">
          <h3>Autonomous Field Mapping Architecture</h3>
          <p className="placeholder-summary">
            In subsequent phases of the <em>Smart UAV System for Intelligent Crop Management</em> project,
            the edge vision pipeline will interface directly with onboard drone telemetry and GNSS receivers.
          </p>

          <div className="roadmap-grid">
            <div className="roadmap-card">
              <div className="roadmap-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <h4>Georeferenced Stamping</h4>
              <p>
                Each captured frame will be embedded with real-time GPS metadata (Latitude, Longitude, Altitude, Flight Gimbal Angle).
              </p>
            </div>

            <div className="roadmap-card">
              <div className="roadmap-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
              </div>
              <h4>Crop-Health Heatmaps</h4>
              <p>
                Spatial interpolation of vegetation coverage and visual discoloration across designated farm boundaries.
              </p>
            </div>

            <div className="roadmap-card">
              <div className="roadmap-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
              </div>
              <h4>Edge AI Integration</h4>
              <p>
                Targeted deployment on NVIDIA Jetson embedded compute platforms for real-time offline inference in rural Indian farms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
