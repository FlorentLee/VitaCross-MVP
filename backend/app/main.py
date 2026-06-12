from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routers import invoice, ledger, analytics, workflow
from app.core.database import Base, engine, ensure_schema_up_to_date
from app.services.rag_engine import init_rag_knowledge
from app.core.seeder import seed_initial_data
from app.core.database import SessionLocal

# 自动迁移并创建 SQLite 数据库表（检测并更新 schema）
ensure_schema_up_to_date()

app = FastAPI(
    title="VitaCross API",
    version="1.0.0-mvp",
    description="AI-Powered Inbound Medical Care & Cross-Border Payment Infrastructure",
)


@app.on_event("startup")
def log_routes():
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    logger.info("[VitaCross] Starting up...")
    for route in app.routes:
        logger.info(f"  Route: {getattr(route, 'methods', None)} {route.path}")


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载路由
app.include_router(invoice.router, prefix="/api/invoice", tags=["Invoice / VitaCross 多模态 OCR"])
app.include_router(ledger.router, prefix="/api/ledger", tags=["Ledger / Settlement"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(workflow.router, tags=["Workflow / Cross-Border Settlement"])


@app.on_event("startup")
def startup_event():
    """启动时初始化 RAG 医疗知识库，并填充初始演示数据"""
    init_rag_knowledge()
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()


@app.get("/api")
def read_root():
    return {
        "status": "VitaCross API is running",
        "version": "1.0.0-mvp",
        "features": ["VitaCross 多模态 OCR", "ICD-10/11 Mapping", "Cross-Border Settlement", "RAG Medical Compliance"],
    }


# 挂载前端静态文件 (React UI on root path)
current_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(current_dir, "..", "static")
if os.path.exists(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    import logging
    logger = logging.getLogger("vitacross.main")
    logger.warning(f"Static directory not found at {static_dir}. UI will not be served.")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
