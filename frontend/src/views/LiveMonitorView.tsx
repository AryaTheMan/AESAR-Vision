import React, { FormEvent, useState } from "react";
import { CameraStatus, AIStatus, NavTab } from "../types";

interface LiveMonitorViewProps {
  camera: CameraStatus;
  ai: AIStatus;
  streamKey: number;
  onSwitchSource: (source: { kind: "local" | "ip"; device_index?: number; url?: string }) => Promise<void>;
  onNavigate: (tab: NavTab) => void;
}

export const LiveMonitorView: React.FC<LiveMonitorViewProps> = ({
  camera,
  ai,
  streamKey,
  onSwitchSource,
  onNavigate,
}) => {
  const [kind, setKind] = useState<"local" | "ip">("local");
  const [index, setIndex] = useState(0);
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (kind === "local") {
        await onSwitchSource({ kind: "local", device_index: index });
      } else {
        await onSwitchSource({ kind: "ip", url });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCaptureSnapshot() {
    // Capture snapshot from current stream
    const snapshotUrl = `/api/ai/annotated?t=${Date.now()}`;
    setCapturedSnapshot(snapshotUrl);
  }

  return (
    <div className="view-container live-monitor-view">
      <div className="view-intro">
        <div>
          <h2>Live Aerial / Field Feed</h2>
          <p className="section-desc">
            Direct low-latency video feed streamed from connected optical payload or field camera.
          </p>
        </div>
        <div className="quick-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCaptureSnapshot}
            title="Capture frame snapshot"
          >
            Capture Frame
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate("analysis")}
          >
            Analyze Current Frame
          </button>
        </div>
      </div>

      <div className="console-layout">
        {/* Main Video Viewport */}
        <div className="video-viewport-container">
          <div className="video-viewport">
            <img
              key={streamKey}
              src={`/api/stream?preview=${streamKey}`}
              alt="Live Aerial/Field Feed"
              className="live-video-stream"
            />

            {/* Reactive YOLO Detection Overlays */}
            {ai.frame_width > 0 && ai.detections.length > 0 && (
              <div className="detection-overlay-layer">
                {ai.detections.map((detection, i) => {
                  const [x1, y1, x2, y2] = detection.bounding_box;
                  return (
                    <div
                      className="detection-bbox"
                      key={`${detection.class_name}-${i}`}
                      style={{
                        left: `${(x1 / ai.frame_width) * 100}%`,
                        top: `${(y1 / ai.frame_height) * 100}%`,
                        width: `${((x2 - x1) / ai.frame_width) * 100}%`,
                        height: `${((y2 - y1) / ai.frame_height) * 100}%`,
                      }}
                    >
                      <span className="bbox-label">
                        {detection.class_name.replace(/_/g, " ")} {Math.round(detection.confidence * 100)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* HUD Telemetry Badges */}
            <div className="viewport-hud-top">
              <div className="hud-pill">
                <span className={`hud-dot ${camera.connected ? "online" : "offline"}`} />
                <span className="hud-text">
                  {camera.connected ? "FEED ONLINE" : "FEED OFFLINE"}
                </span>
              </div>
              <div className="hud-pill">
                <span className="hud-dim">FPS:</span>
                <span className="hud-bold">{camera.fps}</span>
              </div>
            </div>

            <div className="viewport-hud-bottom">
              <div className="hud-pill">
                <span className="hud-dim">Source:</span>
                <span className="hud-bold">{camera.source_label}</span>
              </div>
              <div className="hud-pill">
                <span className="hud-dim">Target Pests:</span>
                <span className="hud-bold">{ai.detections.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Control Sidebar Panel */}
        <div className="console-sidebar">
          <div className="panel-card">
            <h3>Camera Configuration</h3>
            <p className="panel-desc">Select local USB/video capture device or configure RTSP/HTTP network stream.</p>

            <form onSubmit={handleSubmit} className="console-form">
              <div className="form-group">
                <label htmlFor="camera-kind">Camera Source Type</label>
                <select
                  id="camera-kind"
                  value={kind}
                  onChange={(e) => setKind(e.target.value as "local" | "ip")}
                >
                  <option value="local">Local Camera (USB / V4L2)</option>
                  <option value="ip">IP / RTSP Network Camera</option>
                </select>
              </div>

              {kind === "local" ? (
                <div className="form-group">
                  <label htmlFor="device-index">Device Index</label>
                  <input
                    id="device-index"
                    type="number"
                    min="0"
                    max="10"
                    value={index}
                    onChange={(e) => setIndex(Number(e.target.value))}
                    required
                  />
                  <span className="form-hint">Index 0 is typically the default integrated or USB camera.</span>
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="camera-url">Camera Stream URL</label>
                  <input
                    id="camera-url"
                    type="url"
                    required
                    placeholder="rtsp://192.168.1.100:554/stream"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <span className="form-hint">Supports RTSP, HTTP, and HTTPS OpenCV-compatible streams.</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Switching Source..." : "Switch Camera Source"}
              </button>
            </form>

            <div className="source-meta-block">
              <div className="meta-row">
                <span className="meta-label">Connection:</span>
                <span className={`meta-val ${camera.connected ? "text-green" : "text-danger"}`}>
                  {camera.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Active Label:</span>
                <span className="meta-val">{camera.source_label}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Frame Rate:</span>
                <span className="meta-val">{camera.fps} FPS</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Active Clients:</span>
                <span className="meta-val">{camera.clients}</span>
              </div>
              {camera.error && (
                <div className="meta-error-alert">
                  <strong>Notice:</strong> {camera.error}
                </div>
              )}
            </div>
          </div>

          {/* Captured Snapshot Preview if any */}
          {capturedSnapshot && (
            <div className="panel-card snapshot-panel">
              <div className="panel-header">
                <h3>Frame Snapshot</h3>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setCapturedSnapshot(null)}
                >
                  Dismiss
                </button>
              </div>
              <img
                src={capturedSnapshot}
                alt="Captured Snapshot"
                className="snapshot-thumbnail"
              />
              <a
                href={capturedSnapshot}
                download="cropsense-snapshot.jpg"
                className="btn btn-secondary btn-sm btn-block"
              >
                Download Snapshot
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
