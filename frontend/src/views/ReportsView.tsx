import React from "react";

export const ReportsView: React.FC = () => {
  return (
    <div className="view-container reports-view">
      <div className="view-intro">
        <div>
          <h2>Crop Monitoring Reports</h2>
          <p className="section-desc">
            No completed field reports yet.
          </p>
        </div>
      </div>

      <div className="placeholder-container">
        <div className="empty-reports-banner">
          <div className="empty-icon-circle">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3>Historical Flight &amp; Analysis Archiving</h3>
          <p className="empty-desc">
            Session records and automated inspection reports will be generated once persistent flight recording is configured in future development phases.
          </p>
        </div>

        <div className="reports-spec-grid">
          <div className="spec-card">
            <div className="spec-header">
              <span className="spec-badge">Upcoming</span>
              <h4>Historical Crop Scans</h4>
            </div>
            <p>
              Archive and compare time-series orthomosaics across multiple survey dates to monitor seasonal crop lifecycle changes.
            </p>
          </div>

          <div className="spec-card">
            <div className="spec-header">
              <span className="spec-badge">Upcoming</span>
              <h4>Crop-Health Trends</h4>
            </div>
            <p>
              Track weekly shifts in green vegetation coverage, yellowing progression, and canopy growth rates per farm parcel.
            </p>
          </div>

          <div className="spec-card">
            <div className="spec-header">
              <span className="spec-badge">Upcoming</span>
              <h4>Detected Abnormalities</h4>
            </div>
            <p>
              Automated logging of target insect pests (planthoppers, aphids, thrips) and severe localized desiccated patches.
            </p>
          </div>

          <div className="spec-card">
            <div className="spec-header">
              <span className="spec-badge">Upcoming</span>
              <h4>GPS-Tagged Observations</h4>
            </div>
            <p>
              Exportable PDF summaries and GeoJSON datasets for farm managers and precision spraying equipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
