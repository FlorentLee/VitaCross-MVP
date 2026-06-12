---
title: VitaCross MVP Prototype
emoji: 🏥
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# VitaCross: AI-Driven Inbound Medical Care & Cross-Border Payment Infrastructure

**VitaCross** is a next-generation SaaS platform designed for healthcare providers, international insurers, and cross-border settlement institutions. It streamlines the inbound medical tourism experience by combining automated multi-modal medical document analysis with intelligent cross-border payment routing.

---

## 🌟 Core Demo Scenarios
1. **VitaCross 多模态 OCR (Multi-modal Medical Record Ingest)**: Upload unstructured medical documents, diagnostic files, and expense receipts in Chinese/English.
2. **ICD-10/11 Mapping Agent**: Auto-resolve localized terminology to standard international ICD-10 codes, mapping them to pre-negotiated insurer billing guidelines.
3. **Cross-border Settlement Pipeline**: A visual 5-step rule engine checking claims compliance, handling currency conversions, routing transactions (CIPS, SWIFT, SEPA), and enforcing pre-authorization thresholds.
4. **Operations Briefing (AI CEO Insights)**: Real-time, streaming executive summaries generated via LLM to report platform throughput, insurer reimbursement statistics, and settlement velocity.

---

## 🛠 Tech Stack
- **Frontend**: React.js / Next.js (App Router), Tailwind CSS, Lucide React (Icons), jsPDF (Report exporting).
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite (for MVP database), Uvicorn.
- **AI Brain**: Google Gemini API (`gemini-2.5-flash`), ChromaDB (vector store for RAG insurance policy lookups).
- **Deployment**: Render (Backend & Database), Vercel (Frontend), GitHub Codespaces (`.devcontainer`).

---

## 🚀 Getting Started

### 1. Local Development (Manual Setup)

#### Prerequisites
- Python 3.11+
- Node.js 18+

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in a `.env` file inside the `backend` folder:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   DATABASE_URL=sqlite:///./data/vitacross_database.db
   ```
   *(Note: If `GOOGLE_API_KEY` is not provided, the platform automatically runs in **Demo Mode (演示模式)** with high-fidelity mock data).*
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Run with Docker Compose
You can run the entire platform locally using Docker:

1. Clone or navigate to the project root.
2. Build and start the container services:
   ```bash
   docker-compose up --build
   ```
3. The services will be exposed at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)

---

## 🌐 Production Deployment

### Backend (Render)
- Deploy as a **Web Service** using the settings specified in [render.yaml](file:///Users/u0150975/Downloads/%E6%99%BA%E7%A8%8E%E9%80%9Ademo/render.yaml).
- Ensure `GOOGLE_API_KEY` is added to Render's environment variables.

### Frontend (Vercel)
- Deploy the `frontend/` directory to Vercel.
- Configure `NEXT_PUBLIC_API_BASE_URL` to point to your deployed Render URL.

---

## 💡 Demo Mode (No API Key Required)
For presentations to VCs and non-technical stakeholders, you can toggle **Demo Mode** in the **Settings (系统设置)** screen:
- **Toggle ON**: Uses pre-defined, high-fidelity OCR responses and realistic mapping logs.
- **Toggle OFF**: Performs real-time API calls to Google's Gemini models for invoice/document parsing.
