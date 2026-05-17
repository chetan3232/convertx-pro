# 🚀 ConvertX Pro — Advanced Local Backend Conversion Service

Welcome to the central backend conversion service for **ConvertX Pro**! This directory contains a fully operational, queue-driven document processing system designed to perform highly-accurate, full-layout **PDF ➔ DOCX** conversions.

---

## 🏗️ How it Works

1. **Express API Gateway (`localhost:5000`):** Ingests incoming multipart files from the React client, caches them in your Supabase storage bucket, schedules a task in the Redis-backed queue, and serves a status tracking polling endpoint.
2. **Redis & Bull Queue (`localhost:6379`):** Regulates concurrency, handles auto-retry logic, and schedules jobs under peak load.
3. **FastAPI Python Worker (`localhost:8000`):** Leverages `pdf2docx` to analyze vector streams, reconstruct layout models, assemble Word files, and save outputs back to your Supabase instance.
4. **Dynamic Frontend Fallback:** The React UI running on port `8080` automatically attempts to call `localhost:5000` first. If the local backend is offline, it gracefully falls back to your Supabase Cloud Edge Functions and local text-extraction previews with zero downtime!

---

## ⚡ Option 1: Quick Start with Docker (Recommended)

To run the entire stack (Gateway, Redis, Python Worker) in a unified, sandboxed containerized environment, simply execute the following inside the `backend` folder:

```bash
# Spin up all containers in the background
docker compose up --build -d
```

### Deconstruct & Stop
```bash
# Tear down services safely
docker compose down -v
```

---

## 🐍 Option 2: Run Locally (Without Docker)

If you prefer to run services natively on your local machine:

### 1. Start Redis
Ensure you have Redis running locally on your default port `6379`.
* *Windows:* Run Redis via WSL or as a Windows Service (`redis-server.exe`).

### 2. Launch the Node.js API Gateway (`api-gateway`)
```bash
cd api-gateway
npm install
npm run dev
```
*Your Gateway is now live on:* **[http://localhost:5000](http://localhost:5000)**

### 3. Launch the Python Conversion Worker (`python-worker`)
Ensure you have Python 3.8+ installed:
```bash
cd python-worker
pip install -r requirements.txt
python worker.py
```
*Your Worker is now active on:* **[http://localhost:8000](http://localhost:8000)**

---

## 🧪 Testing Your Advanced Pipeline

Once the backend services are running (either via Docker or Local CLI), open your React client at **[http://localhost:8080](http://localhost:8080)**, drop in any PDF document, and select **DOCX** as the target format.

The conversion will route through your new, highly accurate layout reconstruction engine, giving you a beautiful, native Word document instantly!
