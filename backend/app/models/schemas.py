from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class InvoiceAnalyzeRequest(BaseModel):
    image_url: str

class InvoiceAnalyzeResponse(BaseModel):
    buyer_name: Optional[str] = None
    seller_name: Optional[str] = None
    invoice_number: Optional[str] = None
    amount: Optional[float] = None
    invoice_date: Optional[str] = None
    invoice_type: Optional[str] = None
    risk_warning: Optional[str] = None
    workflow_status: Optional[str] = None
    compliance_score: Optional[float] = None
    # VitaCross medical fields
    patient_name: Optional[str] = None
    hospital_name: Optional[str] = None
    diagnosis: Optional[str] = None        # Chinese
    diagnosis_en: Optional[str] = None     # English
    icd_code: Optional[str] = None         # ICD-10/11 code
    currency: Optional[str] = "CNY"
    settlement_status: Optional[str] = None

class LedgerEntryCreate(BaseModel):
    invoice_number: str
    total_amount: float
    invoice_type: str
    patient_name: Optional[str] = None
    hospital_name: Optional[str] = None
    diagnosis: Optional[str] = None
    diagnosis_en: Optional[str] = None
    icd_code: Optional[str] = None
    currency: Optional[str] = "CNY"

class LedgerEntryUpdate(BaseModel):
    invoice_number: Optional[str] = None
    total_amount: Optional[float] = None
    invoice_type: Optional[str] = None
    compliance_score: Optional[float] = None
    risk_warning: Optional[str] = None
    patient_name: Optional[str] = None
    hospital_name: Optional[str] = None
    diagnosis: Optional[str] = None
    diagnosis_en: Optional[str] = None
    icd_code: Optional[str] = None
    currency: Optional[str] = None
    settlement_status: Optional[str] = None

class LedgerEntryResponse(LedgerEntryCreate):
    id: int
    created_at: Optional[datetime] = None
    compliance_score: Optional[float] = None
    risk_warning: Optional[str] = None
    settlement_status: Optional[str] = None

    class Config:
        from_attributes = True

class CEOReportResponse(BaseModel):
    report: str
