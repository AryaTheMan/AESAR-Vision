import React, { useState } from "react";
import { CameraStatus, PlantStatus, AIStatus } from "../types";

interface CropAnalysisViewProps {
  camera: CameraStatus;
  plant: PlantStatus;
  ai: AIStatus;
}

export const CropAnalysisView: React.FC<CropAnalysisViewProps> = ({
  camera,
  plant,
  ai,
}) => {
  const [viewLayer, setViewLayer] = useState<"segmentation" | "raw" | "ai">("segmentation");
  const [refreshKey, setRefreshKey] = useState(0);

  const getInterpretationText = () => {
    if (plant.status !== "ready") {
      return plant.detail ?? "No usable plant or leaf region detected in the current camera frame.";
    }
    if (plant.green_percent >= 75) {
      return "Image shows predominantly green vegetation.";
    }
    if (plant.yellow_percent > 20 || plant.brown_percent > 20) {
      return "Yellow and brown regions are present in the analysed image.";
    }
    return "Image shows mixed vegetation with notable color variance.";
  };

  const getImageSrc = () => {
    if (!camera.connected) return null;
    if (viewLayer === "segmentation") {
      return `/api/plant/annotated?refresh=${refreshKey}`;
    }
    if (viewLayer === "ai") {
      return `/api/ai/annotated?refresh=${refreshKey}`;
    }
    return `/api/stream?refresh=${refreshKey}`;
  };

  return (
    <div className="view-container crop-analysis-view">
      <div className="view-intro">
        <div>
          <h2>Crop Visual Condition Analysis</h2>
          <p className="section-desc">
            Visual vegetation analysis via calibrated RGB color segmentation and morphological filtering.
          </p>
        </div>
        <div className="view-layer-toggles">
          <span className="layer-toggle-label">Analysis Layer:</span>
          <div className="btn-group">
            <button
              type="button"
              className={`btn btn-sm ${viewLayer === "segmentation" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setViewLayer("segmentation");
                setRefreshKey((k) => k + 1);
              }}
            >
              Segmentation Mask
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewLayer === "raw" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setViewLayer("raw");
                setRefreshKey((k) => k + 1);
              }}
            >
              Raw Frame
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewLayer === "ai" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => {
                setViewLayer("ai");
                setRefreshKey((k) => k + 1);
              }}
            >
              Pest Detections ({ai.detections.length})
            </button>
          </div>
        </div>
      </div>

      <div className="analysis-split-layout">
        {/* Left: Large Image Being Analysed */}
        <div className="analysis-frame-container">
          <div className="analysis-frame-card">
            <div className="frame-card-header">
              <span className="frame-card-title">
                {viewLayer === "segmentation"
                  ? "Color Segmentation Mask (Evidence Overlay)"
                  : viewLayer === "ai"
                  ? "Pest Detection Overlay (YOLO11s)"
                  : "Live Camera Input Stream"}
              </span>
              <button
                type="button"
                className="btn-refresh"
                onClick={() => setRefreshKey((k) => k + 1)}
                title="Refresh current frame"
              >
                ↻ Refresh View
              </button>
            </div>

            <div className="analysis-image-viewport">
              {getImageSrc() ? (
                <img
                  key={`${viewLayer}-${refreshKey}`}
                  src={getImageSrc()!}
                  alt="Analysed Crop Frame"
                  className="analysis-main-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/api/stream";
                  }}
                />
              ) : (
                <div className="preview-offline-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="21" />
                  </svg>
                  <p>No active camera frame available for analysis</p>
                </div>
              )}
            </div>

            <div className="frame-card-footer">
              <span className="footer-meta">
                Source: <strong>{camera.source_label}</strong>
              </span>
              <span className="footer-meta">
                Analysis Rate: <strong>{plant.analysis_fps} FPS</strong>
              </span>
              {viewLayer === "segmentation" && (
                <div className="segmentation-legend-inline">
                  <span className="leg-item"><span className="dot green" /> Green Foliage</span>
                  <span className="leg-item"><span className="dot yellow" /> Yellowing</span>
                  <span className="leg-item"><span className="dot brown" /> Desiccated</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Analysis Results Panel */}
        <div className="analysis-results-panel">
          <div className="panel-card results-card">
            <div className="results-header">
              <h3>CROP ANALYSIS</h3>
              <span className={`badge-inline quality-${plant.quality}`}>
                {plant.quality.toUpperCase()}
              </span>
            </div>

            {/* Plant Validation (Phase 2 UI Preparation) */}
            <div className="results-section">
              <div className="section-title-row">
                <h4>Plant Verification</h4>
                <span className="status-indicator-tag">
                  Status: {plant.status === "ready" ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="validation-item-box">
                <div className="val-field">
                  <span className="val-key">Plant Verification:</span>
                  <strong className="val-highlight text-muted">Not yet available</strong>
                </div>
                <div className="val-field">
                  <span className="val-key">Analysis Method:</span>
                  <span className="val-text">Visual vegetation analysis (HSV thresholding)</span>
                </div>
                <div className="val-field">
                  <span className="val-key">Segmentation Region:</span>
                  <span className="val-text">
                    {plant.status === "ready"
                      ? `${plant.leaf_area_percent}% total frame area`
                      : "No region detected"}
                  </span>
                </div>
                <p className="val-subtext">
                  Note: Species-level plant boundary verification will be integrated in Phase 2.
                </p>
              </div>
            </div>

            {/* Visual Indicators */}
            <div className="results-section">
              <h4>Visual Indicators</h4>
              <div className="indicators-grid">
                <div className="indicator-tile coverage">
                  <span className="ind-label">Vegetation Coverage</span>
                  <strong className="ind-value">
                    {plant.status === "ready" ? `${plant.leaf_area_percent}%` : "—"}
                  </strong>
                </div>
                <div className="indicator-tile green">
                  <span className="ind-label">Green Regions</span>
                  <strong className="ind-value">
                    {plant.status === "ready" ? `${plant.green_percent}%` : "—"}
                  </strong>
                </div>
                <div className="indicator-tile yellow">
                  <span className="ind-label">Yellow Regions</span>
                  <strong className="ind-value">
                    {plant.status === "ready" ? `${plant.yellow_percent}%` : "—"}
                  </strong>
                </div>
                <div className="indicator-tile brown">
                  <span className="ind-label">Brown Regions</span>
                  <strong className="ind-value">
                    {plant.status === "ready" ? `${plant.brown_percent}%` : "—"}
                  </strong>
                </div>
              </div>

              {plant.status === "ready" && (
                <div className="composition-bar-container">
                  <span className="bar-header-label">Relative Foliage Color Composition:</span>
                  <div className="composition-bar medium" aria-label="Color composition">
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
                </div>
              )}

              <div className="quality-assessment-row">
                <span className="qa-label">Analysis Quality:</span>
                <span className={`quality-chip quality-${plant.quality}`}>
                  {plant.quality.toUpperCase()}
                </span>
                {plant.detail && <span className="qa-detail">({plant.detail})</span>}
              </div>
            </div>

            {/* Interpretation */}
            <div className="results-section">
              <h4>Interpretation</h4>
              <div className="interpretation-box">
                <p className="interpretation-statement">
                  {getInterpretationText()}
                </p>
              </div>
            </div>

            {/* Mandatory Academic Disclaimer */}
            <div className="academic-disclaimer-card">
              <div className="disclaimer-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Academic Scope Notice</span>
              </div>
              <p className="disclaimer-body">
                Current prototype uses RGB colour-based visual indicators. Disease classification is planned for a future development phase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
