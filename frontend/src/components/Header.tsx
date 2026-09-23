import React from "react";
import { CameraStatus, AIStatus, PlantStatus } from "../types";

interface HeaderProps {
  camera: CameraStatus;
  ai: AIStatus;
  plant: PlantStatus;
}

export const Header: React.FC<HeaderProps> = ({ camera, ai, plant }) => {
  return (
    <header className="app-header">
      <div className="header-titles">
        <div className="title-row">
          <h1>CropSense AI</h1>
          <span className="prototype-tag">Prototype · RGB Analysis</span>
        </div>
        <p className="subtitle">UAV-Based Crop Monitoring &amp; Intelligent Analysis</p>
      </div>

      <div className="header-telemetry">
        <div className="telemetry-pill">
          <span className="pill-dot online" />
          <span className="pill-label">System Online</span>
        </div>

        <div className="telemetry-pill">
          <span className={`pill-dot ${camera.connected ? "online" : "offline"}`} />
          <span className="pill-label">
            {camera.connected
              ? `Feed: ${camera.source_label} (${camera.fps} FPS)`
              : "Camera Offline"}
          </span>
        </div>

        <div className="telemetry-pill">
          <span className={`pill-dot ${ai.state === "ai_ready" ? "online" : "warning"}`} />
          <span className="pill-label">
            {ai.state === "ai_ready"
              ? `AI Ready (${ai.inference_fps} FPS)`
              : ai.state.replace(/_/g, " ")}
          </span>
        </div>

        <div className="telemetry-pill">
          <span className={`pill-dot ${plant.status === "ready" ? "online" : "neutral"}`} />
          <span className="pill-label">
            {plant.status === "ready"
              ? `Visual Analysis (${plant.analysis_fps} FPS)`
              : "Analysis Idle"}
          </span>
        </div>
      </div>
    </header>
  );
};
