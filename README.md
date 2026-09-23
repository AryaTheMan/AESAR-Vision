# CropSense AI

**UAV-Based Crop Monitoring & Intelligent Analysis**

Software component of the 2nd-year Innovative Design Project: *"Smart UAV System for Intelligent Crop Management"*.

---

## Current Prototype Capabilities

* **FastAPI Camera Backend**: Threaded, low-latency camera capture and streaming architecture.
* **Local Webcam Input**: Direct capture from connected local USB / V4L2 cameras (device indexing).
* **IP Camera Support**: OpenCV-compatible RTSP, HTTP, and HTTPS video stream ingestion.
* **Live MJPEG Streaming**: Efficient multi-client multipart stream to web clients without hardware coupling.
* **AI Inference Pipeline**: Asynchronous YOLO pest detection sampling without blocking video delivery.
* **RGB/HSV Vegetation Visual Analysis**: Morphological filtering and color thresholding of foliage.
* **Green / Yellow / Brown Colour-Region Analysis**: Quantitative breakdown of healthy foliage, chlorotic tissue, and desiccated matter.
* **Dashboard Monitoring**: High-level telemetry aggregation, system health pills, and latest analysis preview.
* **Live Monitor**: Dedicated camera console with HUD telemetry and source switching.
* **Crop Analysis Interface**: Side-by-side inspection viewport with layer overlays and scientific indicators.

> **Note on Prototype Scope**:  
> The current Phase 1 prototype provides colour-based visual vegetation indicators. Disease detection, automated plant verification, nutrient deficiency diagnosis, and production UAV flight integration are planned for subsequent development phases.

---

## Running the Application

### 1. Start the Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to access the CropSense AI monitoring console.
