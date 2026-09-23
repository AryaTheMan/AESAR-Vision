import React from "react";
import { CameraStatus, AIStatus, PlantStatus, NavTab } from "../types";

interface DashboardViewProps {
  camera: CameraStatus;
  ai: AIStatus;
  plant: PlantStatus;
  onNavigate: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  camera,
  ai,
  plant,
  onNavigate,
}) => {
  const formattedTimestamp = plant.updated_at
    ? new Date(plant.updated_at * 1000).toLocaleTimeString()
    : null;

  return (
    <div className="view-container dashboard-view">
      <div className="view-intro">
        <div>
          <h2>Executive Monitoring Overview</h2>
          <p className="section-desc">
            Real-time telemetry and visual indicators aggregated from the active camera feed.
          </p>
        </div>
        <div className="quick-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate("live")}
          >
            Open Live Feed
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate("analysis")}
          >
            Inspect Crop Analysis
          </button>
        </div>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="stats-grid">
        {/* Plant Verification Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Plant Verification</span>
            <span className="stat-chip neutral">Phase 2 Target</span>
          </div>
          <div className="stat-body">
            <strong className="stat-value text-muted">Not yet available</strong>
            <p className="stat-caption">
              Vegetation segmentation active; species validation model scheduled for Phase 2.
            </p>
          </div>
        </div>

        {/* Vegetation Coverage */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Vegetation Coverage</span>
            <span className={`stat-chip ${plant.status === "ready" ? "active" : "neutral"}`}>
              {plant.status === "ready" ? "Active" : "Idle"}
            </span>
          </div>
          <div className="stat-body">
            <strong className="stat-value text-green">
              {plant.status === "ready" ? `${plant.leaf_area_percent}%` : "—"}
            </strong>
            <p className="stat-caption">
              Proportion of current frame identified as plant foliage.
            </p>
          </div>
        </div>

        {/* Visual Condition Indicators */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Visual Condition</span>
            <span className="stat-chip neutral">RGB Metrics</span>
          </div>
          <div className="stat-body">
            {plant.status === "ready" ? (
              <div className="stat-mini-metrics">
                <div className="mini-metric">
                  <span className="mini-label">Green</span>
                  <span className="mini-value text-green">{plant.green_percent}%</span>
                </div>
                <div className="mini-metric">
                  <span className="mini-label">Yellow</span>
                  <span className="mini-value text-yellow">{plant.yellow_percent}%</span>
                </div>
                <div className="mini-metric">
                  <span className="mini-label">Brown</span>
                  <span className="mini-value text-brown">{plant.brown_percent}%</span>
                </div>
              </div>
            ) : (
              <strong className="stat-value text-muted">—</strong>
            )}
            <p className="stat-caption">
              Distribution across healthy green, yellowing chlorotic, and brown necrotic regions.
            </p>
          </div>
        </div>

        {/* Analysis Quality */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Analysis Quality</span>
            <span
              className={`stat-chip quality-${plant.quality}`}
            >
              {plant.quality.toUpperCase()}
            </span>
          </div>
          <div className="stat-body">
            <strong
              className={`stat-value quality-text-${plant.quality}`}
            >
              {plant.quality.toUpperCase()}
            </strong>
            <p className="stat-caption">
              {plant.detail ?? "Sufficient lighting and foliage surface detected."}
            </p>
          </div>
        </div>
      </div>

      {/* System Status Sub-row */}
      <div className="system-health-row">
        <div className="health-item">
          <span className="health-label">Camera Status:</span>
          <span className={`health-badge ${camera.connected ? "online" : "offline"}`}>
            {camera.connected ? `CONNECTED · ${camera.fps} FPS` : "DISCONNECTED"}
          </span>
          <span className="health-meta">Source: {camera.source_label}</span>
        </div>

        <div className="health-item">
          <span className="health-label">AI Inference:</span>
          <span className={`health-badge ${ai.state === "ai_ready" ? "online" : "warning"}`}>
            {ai.state.replace(/_/g, " ").toUpperCase()} · {ai.inference_fps} FPS
          </span>
          <span className="health-meta">
            {ai.detections.length} target pest{ai.detections.length === 1 ? "" : "s"} visible
          </span>
        </div>

        <div className="health-item">
          <span className="health-label">Visual Worker:</span>
          <span className={`health-badge ${plant.status === "ready" ? "online" : "neutral"}`}>
            {plant.status.toUpperCase()} · {plant.analysis_fps} FPS
          </span>
          <span className="health-meta">Target: {plant.target_fps} FPS</span>
        </div>
      </div>

      {/* Latest Analysis Section */}
      <div className="panel-card latest-analysis-panel">
        <div className="panel-header">
          <div>
            <h3>Latest Visual Condition Analysis</h3>
            <span className="panel-sub">
              {formattedTimestamp ? `Updated at ${formattedTimestamp}` : "Awaiting active camera frames"}
            </span>
          </div>
          <span className={`badge-inline quality-${plant.quality}`}>
            Quality: {plant.quality.toUpperCase()}
          </span>
        </div>

        <div className="latest-analysis-grid">
          <div className="analysis-preview-box">
            {camera.connected ? (
              <img
                src="/api/plant/annotated"
                alt="Segmentation Evidence Preview"
                className="analysis-preview-img"
                onError={(e) => {
                  // Fallback to camera stream if snapshot not available
                  (e.target as HTMLImageElement).src = "/api/stream";
                }}
              />
            ) : (
              <div className="preview-offline-placeholder">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <p>Camera feed offline</p>
              </div>
            )}
            <div className="preview-tag">Vegetation Segmentation Overlay</div>
          </div>

          <div className="analysis-breakdown-box">
            <h4>Measured Color Distribution</h4>
            <p className="breakdown-desc">
              Pixel classification based on calibrated HSV ranges of plant tissue.
            </p>

            {plant.status === "ready" ? (
              <>
                <div className="composition-bar large" aria-label="Foliage composition bar">
                  <div
                    className="bar-segment seg-green"
                    style={{ width: `${plant.green_percent}%` }}
                    title={`Green: ${plant.green_percent}%`}
                  />
                  <div
                    className="bar-segment seg-yellow"
                    style={{ width: `${plant.yellow_percent}%` }}
                    title={`Yellow: ${plant.yellow_percent}%`}
                  />
                  <div
                    className="bar-segment seg-brown"
                    style={{ width: `${plant.brown_percent}%` }}
                    title={`Brown: ${plant.brown_percent}%`}
                  />
                </div>

                <div className="distribution-legend">
                  <div className="legend-entry">
                    <span className="legend-dot green" />
                    <span className="legend-name">Green Regions (Healthy Foliage)</span>
                    <strong className="legend-val">{plant.green_percent}%</strong>
                  </div>
                  <div className="legend-entry">
                    <span className="legend-dot yellow" />
                    <span className="legend-name">Yellow Regions (Chlorotic / Discolored)</span>
                    <strong className="legend-val">{plant.yellow_percent}%</strong>
                  </div>
                  <div className="legend-entry">
                    <span className="legend-dot brown" />
                    <span className="legend-name">Brown Regions (Necrotic / Desiccated)</span>
                    <strong className="legend-val">{plant.brown_percent}%</strong>
                  </div>
                </div>

                <div className="interpretation-callout">
                  <strong>Initial Visual Assessment:</strong>
                  <p>
                    {plant.green_percent >= 75
                      ? "Image shows predominantly green vegetation."
                      : plant.yellow_percent > 20 || plant.brown_percent > 20
                      ? "Yellow and brown regions are present in the analysed image."
                      : "Image shows mixed vegetation with notable color variance."}
                  </p>
                </div>
              </>
            ) : (
              <div className="empty-analysis-note">
                <p>{plant.detail ?? "No usable plant or leaf region detected in current camera frame."}</p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onNavigate("live")}
                >
                  Configure Camera
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
