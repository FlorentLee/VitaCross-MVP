import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, declarative_base
import chromadb
from app.core.config import settings

# --- SQLite Setup ---
# Ensure data directory exists
db_path = settings.DATABASE_URL.replace("sqlite:///", "")
os.makedirs(os.path.dirname(db_path) or ".", exist_ok=True)

engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# DB Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ensure_schema_up_to_date():
    """
    MVP schema migration: if the DB exists but is missing new columns
    (e.g. patient_name), drop all tables and recreate.
    The seeder will repopulate on next startup.
    """
    inspector = inspect(engine)
    if inspector.has_table("ledger_items"):
        columns = [col["name"] for col in inspector.get_columns("ledger_items")]
        required_columns = ["patient_name", "hospital_name", "diagnosis", "icd_code", "currency", "settlement_status"]
        missing = [c for c in required_columns if c not in columns]
        if missing:
            print(f"[VitaCross] Schema outdated — missing columns: {missing}. Dropping and recreating tables.")
            Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

# --- ChromaDB Setup ---
_chroma_client = None

def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        os.makedirs(settings.CHROMA_DB_DIR, exist_ok=True)
        _chroma_client = chromadb.PersistentClient(path=settings.CHROMA_DB_DIR)
    return _chroma_client
