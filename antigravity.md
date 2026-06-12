# VitaCross SaaS Platform MVP — Antigravity Refactoring Log

This log documents the transformation of the local tax automation code ("智税通") into **VitaCross** — an AI-powered inbound medical care & cross-border payment SaaS platform MVP.

---

## 📂 Project Structure

```
vitacross-mvp/
├── .devcontainer/
│   └── devcontainer.json          # Codespaces configuration (Node 18 + Python 3.11)
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py          # VitaCross API configuration & Demo Mode toggle
│   │   │   ├── database.py        # SQLite connection & auto-schema migration
│   │   │   └── seeder.py          # 5 high-fidelity international patient seeds
│   │   ├── models/
│   │   │   ├── domain.py          # SQLAlchemy ORM models with medical fields
│   │   │   └── schemas.py         # Pydantic schemas extending base inputs
│   │   ├── routers/
│   │   │   ├── analytics.py       # Operations briefing endpoints
│   │   │   ├── invoice.py         # Multi-modal OCR parsing & RAG checking
│   │   │   └── workflow.py        # Cross-border billing pipeline rules
│   │   └── services/
│       │       ├── gemini_agent.py    # Zhipu AI & Google Gemini API prompt orchestrator
│       │       └── rag_engine.py      # ChromaDB search handler
│   ├── docs/
│   │   └── vitacross_policy.md    # RAG source document for insurer regulations
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # SEO titles and meta tags
│   │   │   └── page.tsx           # Screen router and shell
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Sidebar.tsx    # V+ branded slate-900 navigation bar
│   │   │   ├── ui/
│   │   │   │   └── ExportToolbar.tsx # CSV (with BOM) + Word (HTML wrapper) + jsPDF
│   │   │   └── screens/
│   │   │       ├── DashboardScreen.tsx # Operational KPI dashboard & AI insights panel
│   │   │       ├── InvoiceScreen.tsx   # OCR upload zone and mapped diagnosis cards
│   │   │       ├── WorkflowScreen.tsx  # Interactive connected 5-step settlement canvas
│   │   │       ├── LedgerScreen.tsx    # Multi-currency claims ledger & CRUD edit modal
│   │   │       ├── DeclareScreen.tsx   # Insurer claims submission workbench
│   │   │       ├── RiskScreen.tsx      # ICD compliance & pricing audit score cards
│   │   │       ├── AnalyticsScreen.tsx # Service revenue structure & typewriter briefing
│   │   │       └── SettingsScreen.tsx  # API configuration & Demo Mode toggle
│   │   └── lib/
│   │       └── api.ts             # Axios client with extended medical parameters
│   ├── Dockerfile
│   └── vercel.json
├── docker-compose.yml             # Local deployment config (vitacross bridge network)
├── render.yaml                    # Multi-service Render deploy configuration
└── README.md                      # Developer onboarding and runbook
```

---

## 🛠 Technique & implementation Highlights

### 1. Zero-Downtime MVP Database Migration
To avoid breaking local databases during schema changes, `ensure_schema_up_to_date()` in `backend/app/core/database.py` scans SQLite tables for missing medical columns (e.g., `patient_name`, `hospital_name`). If columns are missing, it safely drops and recreates the tables, then seeds them with fresh data.

### 2. Triple-Layer API Key Fallback (Zhipu AI -> Gemini -> Demo Mode)
To ensure the platform remains fully pitch-ready for VCs under any API availability conditions:
- The backend reads `ZHIPU_API_KEY` and `GOOGLE_API_KEY` from settings.
- **Primary Model**: If `ZHIPU_API_KEY` is configured, Zhipu AI (`glm-4v-plus` for OCR; `glm-4-flash` for reports) is invoked.
- **Secondary Model (Fallback)**: If Zhipu fails or is not configured, the system falls back to Google Gemini (`gemini-2.5-flash-preview`).
- **Demo Mode**: If neither key is configured or both are disabled, the system automatically falls back to **Demo Mode** (`USE_MOCK_DATA = True`), returning structured, highly realistic JSON mock records.
- Users can toggle Demo Mode interactively in the **Settings Screen**, saving configurations to `localStorage`.

### 3. Unified Medical RAG Search
Insurer billing rules and ICD guidelines are stored in `backend/docs/vitacross_policy.md`. ChromaDB parses and indexes this file. During medical invoice ingestion:
- The Gemini model extracts the diagnoses and ICD codes.
- The system queries ChromaDB with the extracted terms to fetch matching insurer direct-billing policies (e.g., Cigna, Blue Cross pre-auth rules).
- The RAG policies are appended to `risk_warnings` to provide context-aware auditing suggestions to the billing clerk.

### 4. Lazy-Loaded Document Export Engine
The `ExportToolbar` is a shared client-side component offering:
- **CSV**: Encoded via native Blob using a UTF-8 Byte Order Mark (`\uFEFF`) so Excel opens Chinese characters without encoding errors.
- **Word**: Wrapped as an HTML document with CSS page styling and saved under a `.doc` file extension.
- **PDF**: Employs lazy loading (`import('jspdf')`) only when the user clicks the print button. This keeps the bundle size small and improves Next.js LCP/INP performance scores.
