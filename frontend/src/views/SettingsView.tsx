import React, { useState } from "react";
import { CameraStatus, AIStatus, PlantStatus } from "../types";

interface SettingsViewProps {
  camera: CameraStatus;
  ai: AIStatus;
  plant: PlantStatus;
  onUpdateAIRate: (fps: number) => Promise<void>;
  onUpdatePlantRate: (fps: number) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  camera,
  ai,
  plant,
  onUpdateAIRate,
  onUpdatePlantRate,
}) => {
  const [targetAIFps, setTargetAIFps] = useState(ai.target_fps);
  const [targetPlantFps, setTargetPlantFps] = useState(plant.target_fps);
  const [aiSaved, setAiSaved] = useState(false);
  const [plantSaved, setPlantSaved] = useState(false);

  async function handleSaveAIRate() {
    if (isNaN(targetAIFps) || targetAIFps < 0.1 || targetAIFps > 15) return;
    await onUpdateAIRate(targetAIFps);
    setAiSaved(true);
    setTimeout(() => setAiSaved(false), 2000);
  }

  async function handleSavePlantRate() {
    if (isNaN(targetPlantFps) || targetPlantFps < 0.1 || targetPlantFps > 10) return;
    await onUpdatePlantRate(targetPlantFps);
    setPlantSaved(true);
    setTimeout(() => setPlantSaved(false), 2000);
  }

  return (
    <div className="view-container settings-view">
      <div className="view-intro">
        <div>
          <h2>System Settings &amp; Configuration</h2>
          <p className="section-desc">
            Operational parameters, inference throttling, and academic project specifications.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Processing Rates Configuration */}
        <div className="panel-card">
          <div className="panel-header">
            <h3>Analysis &amp; Inference Tuning</h3>
            <span className="panel-sub">Adjust worker sampling rates</span>
          </div>

          <div className="settings-form">
            <div className="setting-item">
              <div className="setting-label-block">
                <label htmlFor="ai-fps-input">Vision AI Inference Rate (FPS)</label>
                <p className="setting-desc">
                  Rate at which the YOLO worker samples the latest camera frame. Lower values reduce CPU/GPU load.
                </p>
              </div>
              <div className="setting-control-row">
                <input
                  id="ai-fps-input"
                  type="number"
                  min="0.1"
                  max="15.0"
                  step="0.5"
                  value={targetAIFps}
                  onChange={(e) => setTargetAIFps(Number(e.target.value))}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleSaveAIRate}
                >
                  {aiSaved ? "Saved ✓" : "Update Rate"}
                </button>
              </div>
              <div className="setting-status-sub">
                Current active target: <strong>{ai.target_fps} FPS</strong> · Measured: {ai.inference_fps} FPS
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-label-block">
                <label htmlFor="plant-fps-input">Plant Visual Analysis Rate (FPS)</label>
                <p className="setting-desc">
                  Frequency of the HSV color segmentation and morphological filtering worker.
                </p>
              </div>
              <div className="setting-control-row">
                <input
                  id="plant-fps-input"
                  type="number"
                  min="0.1"
                  max="10.0"
                  step="0.5"
                  value={targetPlantFps}
                  onChange={(e) => setTargetPlantFps(Number(e.target.value))}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleSavePlantRate}
                >
                  {plantSaved ? "Saved ✓" : "Update Rate"}
                </button>
              </div>
              <div className="setting-status-sub">
                Current active target: <strong>{plant.target_fps} FPS</strong> · Measured: {plant.analysis_fps} FPS
              </div>
            </div>
          </div>
        </div>

        {/* Camera Feed Telemetry */}
        <div className="panel-card">
          <div className="panel-header">
            <h3>Active Camera Device</h3>
            <span className="panel-sub">Stream state</span>
          </div>

          <div className="spec-table">
            <div className="spec-row">
              <span className="spec-name">Connection State</span>
              <strong className={`spec-value ${camera.connected ? "text-green" : "text-danger"}`}>
                {camera.connected ? "ONLINE" : "OFFLINE"}
              </strong>
            </div>
            <div className="spec-row">
              <span className="spec-name">Source Label</span>
              <span className="spec-value">{camera.source_label}</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Source Kind</span>
              <span className="spec-value">{camera.source_kind.toUpperCase()}</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Capture Rate</span>
              <span className="spec-value">{camera.fps} FPS</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Active Stream Clients</span>
              <span className="spec-value">{camera.clients}</span>
            </div>
          </div>
        </div>

        {/* Vision AI Model Specifications */}
        <div className="panel-card">
          <div className="panel-header">
            <h3>Vision AI Model Specifications</h3>
            <span className="panel-sub">YOLO Detection Engine</span>
          </div>

          <div className="spec-table">
            <div className="spec-row">
              <span className="spec-name">Model Architecture</span>
              <span className="spec-value">Ultralytics YOLO11s</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Checkpoint File</span>
              <span className="spec-value font-mono">aesar-pest-yolo11s.pt</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Worker State</span>
              <span className="spec-value text-green">{ai.state.replace(/_/g, " ").toUpperCase()}</span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Canonical Target Pests</span>
              <span className="spec-value">
                Brown Plant Hopper, Cotton Aphids, Chilli Thrips
              </span>
            </div>
            <div className="spec-row">
              <span className="spec-name">Defender Class</span>
              <span className="spec-value text-muted">Unavailable (No simulation)</span>
            </div>
          </div>
        </div>

        {/* Project & Academic Information */}
        <div className="panel-card">
          <div className="panel-header">
            <h3>Project &amp; Academic Information</h3>
            <span className="panel-sub">System provenance</span>
          </div>

          <div className="academic-info-block">
            <h4>Smart UAV System for Intelligent Crop Management</h4>
            <p className="academic-sub">
              UAV-Based Crop Monitoring, Deep Learning and Real-Time Edge AI for Indian Agriculture
            </p>
            <div className="academic-meta-list">
              <div><strong>Project Stage:</strong> 2nd-Year Innovative Design Project (Phase 1 Prototype)</div>
              <div><strong>Core Engine:</strong> AESAR-Vision Core v0.1.0</div>
              <div><strong>Frontend Stack:</strong> React 19 + TypeScript + Vite</div>
              <div><strong>Backend Stack:</strong> FastAPI + OpenCV + Ultralytics YOLO</div>
              <div><strong>Target Edge Hardware:</strong> NVIDIA Jetson Orin Nano / Nano (Phase 4)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
