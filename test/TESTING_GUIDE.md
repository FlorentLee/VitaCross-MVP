# VitaCross E2E Testing & Integration SOP

## 1. Backend Service Verification (FastAPI)

### 1.1 Virtual Environment Setup & Dependencies
Ensure your python virtual environment is initialized and dependencies are satisfied:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 1.2 Configuration & Env Vars
Set the required API keys in the `.env` file at the root of the workspace:
```env
ZHIPU_API_KEY=264dd6f4b9b24658a5dfe751e5984162.i9dlVXecJy099XBk
GOOGLE_API_KEY=
DATABASE_URL=sqlite:///./data/vitacross_database.db
```
*(Note: If ZHIPU_API_KEY is configured, the system automatically runs Zhipu AI GLM-4V-Plus and GLM-4-Flash APIs. If keys are missing, the system falls back to mock Demo Mode).*

### 1.3 Running the Backend Server
```bash
PYTHONPATH=backend backend/venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
**Verification Checkpoint 1**: Look for startup logs matching `[VitaCross] Starting up...` and the RAG indexing logging for `vitacross_policy.md`.
**Verification Checkpoint 2**: Navigate to `http://127.0.0.1:8000/docs` in your browser. Use the Swagger UI to trigger backend routes like `GET /ledger` or `POST /invoice/analyze`.

---

## 2. Frontend Client Verification (Next.js)

### 2.1 Starting the Development Client
```bash
cd frontend
npm install
npm run dev
```
By default, the client runs on `http://localhost:3000` and proxies REST requests to the backend on `http://localhost:8000`.

### 2.2 Core E2E Verification Flow

1. **Multimodal Medical OCR & ICD-10 Mapping**:
   - Open `http://localhost:3000/` and navigate to the **AI病历解析** screen.
   - Upload the sample invoice image.
   - **Expected Result**: The interface renders the parsed details: patient name (`李奕珉`), hospital (`广州市皮肤病医院`), invoice number (`8114973003`), diagnosis (`特应性皮炎`), ICD-10 code (`L20.9`), and amount (`490.04`).

2. **Automated Claims Ledger & SQL Integration**:
   - Check the **智能账目** screen or the **最近结算详情** table on the dashboard.
   - **Expected Result**: A new ledger entry matching the parsed invoice is present, marked as `已结算` (under the ¥50,000 auto-settlement threshold).

3. **Operations Executive Briefing**:
   - Navigate to the **经营分析** screen.
   - Click the **生成高管简报** button.
   - **Expected Result**: The AI CEO briefing triggers, dynamically calling Zhipu's `glm-4-flash` to generate a stream-rendered medical operations report.
