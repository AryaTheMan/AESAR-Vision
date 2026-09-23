export type NavTab = "dashboard" | "live" | "analysis" | "map" | "reports" | "settings";

export interface CameraStatus {
  source_kind: string;
  source_label: string;
  connected: boolean;
  fps: number;
  clients: number;
  error: string | null;
}

export interface Detection {
  class_name: string;
  category?: string;
  confidence: number;
  count: number;
  bounding_box: number[];
}

export interface AIStatus {
  state: string;
  detail: string | null;
  inference_fps: number;
  target_fps: number;
  detections: Detection[];
  frame_width: number;
  frame_height: number;
  updated_at?: number | null;
  defender_detection: string;
}

export interface PlantStatus {
  status: string;
  quality: string;
  green_percent: number;
  yellow_percent: number;
  brown_percent: number;
  leaf_area_percent: number;
  detail: string | null;
  analysis_fps: number;
  target_fps: number;
  updated_at?: number | null;
  source?: string;
}

export const defaultCameraStatus: CameraStatus = {
  source_kind: "local",
  source_label: "Local camera 0",
  connected: false,
  fps: 0,
  clients: 0,
  error: null,
};

export const defaultAIStatus: AIStatus = {
  state: "model_loading",
  detail: null,
  inference_fps: 0,
  target_fps: 2,
  detections: [],
  frame_width: 0,
  frame_height: 0,
  defender_detection: "unavailable",
};

export const defaultPlantStatus: PlantStatus = {
  status: "unavailable",
  quality: "unavailable",
  green_percent: 0,
  yellow_percent: 0,
  brown_percent: 0,
  leaf_area_percent: 0,
  detail: null,
  analysis_fps: 0,
  target_fps: 2,
};
