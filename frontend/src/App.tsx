import { useEffect, useState } from "react";
import {
  NavTab,
  CameraStatus,
  AIStatus,
  PlantStatus,
  defaultCameraStatus,
  defaultAIStatus,
  defaultPlantStatus,
} from "./types";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { DashboardView } from "./views/DashboardView";
import { LiveMonitorView } from "./views/LiveMonitorView";
import { CropAnalysisView } from "./views/CropAnalysisView";
import { FieldMapView } from "./views/FieldMapView";
import { ReportsView } from "./views/ReportsView";
import { SettingsView } from "./views/SettingsView";

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [camera, setCamera] = useState<CameraStatus>(defaultCameraStatus);
  const [ai, setAI] = useState<AIStatus>(defaultAIStatus);
  const [plant, setPlant] = useState<PlantStatus>(defaultPlantStatus);
  const [streamKey, setStreamKey] = useState(0);

  // Poll camera status
  useEffect(() => {
    const update = () =>
      fetch("/api/status")
        .then((r) => r.json())
        .then(setCamera)
        .catch(() => setCamera(defaultCameraStatus));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Poll AI worker status
  useEffect(() => {
    const update = () =>
      fetch("/api/ai/status")
        .then((r) => r.json())
        .then(setAI)
        .catch(() =>
          setAI({
            ...defaultAIStatus,
            state: "model_unavailable",
            detail: "AI service offline",
          })
        );
    update();
    const id = window.setInterval(update, 750);
    return () => window.clearInterval(id);
  }, []);

  // Poll Plant visual analysis worker status
  useEffect(() => {
    const update = () =>
      fetch("/api/plant/status")
        .then((r) => r.json())
        .then(setPlant)
        .catch(() => setPlant(defaultPlantStatus));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Switch camera source
  async function handleSwitchSource(source: {
    kind: "local" | "ip";
    device_index?: number;
    url?: string;
  }) {
    try {
      const response = await fetch("/api/source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(source),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail ?? "Failed to switch camera source.");
      } else {
        const updated = await response.json();
        setCamera(updated);
        setStreamKey((prev) => prev + 1);
      }
    } catch (err) {
      alert(`Network error when switching camera: ${err}`);
    }
  }

  // Update AI inference rate
  async function handleUpdateAIRate(target_fps: number) {
    try {
      const response = await fetch("/api/ai/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_fps }),
      });
      if (response.ok) {
        const updated = await response.json();
        setAI((prev) => ({ ...prev, ...updated }));
      }
    } catch (err) {
      console.error("Failed to update AI target FPS:", err);
    }
  }

  // Update Plant analysis rate
  async function handleUpdatePlantRate(target_fps: number) {
    try {
      const response = await fetch("/api/plant/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_fps }),
      });
      if (response.ok) {
        const updated = await response.json();
        setPlant((prev) => ({ ...prev, ...updated }));
      }
    } catch (err) {
      console.error("Failed to update plant target FPS:", err);
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cameraConnected={camera.connected}
      />

      <div className="app-main-wrapper">
        <Header camera={camera} ai={ai} plant={plant} />

        <main className="app-content">
          {currentTab === "dashboard" && (
            <DashboardView
              camera={camera}
              ai={ai}
              plant={plant}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === "live" && (
            <LiveMonitorView
              camera={camera}
              ai={ai}
              streamKey={streamKey}
              onSwitchSource={handleSwitchSource}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === "analysis" && (
            <CropAnalysisView
              camera={camera}
              plant={plant}
              ai={ai}
            />
          )}

          {currentTab === "map" && <FieldMapView />}

          {currentTab === "reports" && <ReportsView />}

          {currentTab === "settings" && (
            <SettingsView
              camera={camera}
              ai={ai}
              plant={plant}
              onUpdateAIRate={handleUpdateAIRate}
              onUpdatePlantRate={handleUpdatePlantRate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
export default App;
