import json
import re
import base64
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.schemas import InvoiceAnalyzeResponse
from app.services.gemini_agent import analyze_invoice_vision
from app.services.rag_engine import search_policy
from app.models.domain import LedgerItem

from typing import List
import logging

logger = logging.getLogger("vitacross.invoice")
router = APIRouter()


@router.post("/analyze", response_model=List[InvoiceAnalyzeResponse])
async def analyze_invoice(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    VitaCross 多模态 OCR — 病历/医疗单据解析与 ICD 编码映射
    """
    content = await file.read()
    base64_img = base64.b64encode(content).decode("utf-8")
    image_url = f"data:{file.content_type};base64,{base64_img}"

    del content
    del base64_img

    # 1. VitaCross 多模态 OCR 解析
    raw_response = analyze_invoice_vision(image_url)
    del image_url

    try:
        cleaned_response = raw_response.strip()
        if cleaned_response.startswith("```json"):
            cleaned_response = cleaned_response[7:]
        elif cleaned_response.startswith("```"):
            cleaned_response = cleaned_response[3:]
        if cleaned_response.endswith("```"):
            cleaned_response = cleaned_response[:-3]

        match = re.search(r'(\[.*\]|\{.*\})', cleaned_response, re.DOTALL)
        if match:
            cleaned_response = match.group(1)
        else:
            logger.warning("[VitaCross] No JSON found in OCR response.")

        parsed_data = json.loads(cleaned_response)
        logger.info(f"[VitaCross] OCR parsed successfully. Type: {type(parsed_data)}")

        if not isinstance(parsed_data, list):
            parsed_data = [parsed_data]

        if not parsed_data:
            parsed_data = [{}]

    except Exception as e:
        logger.error(f"[VitaCross] OCR JSON parse failed: {e}\nRaw: {raw_response}")
        raise HTTPException(status_code=500, detail="VitaCross 多模态 OCR 解析失败，请查看服务日志。")

    responses = []

    for item in parsed_data:
        # 2. RAG 医疗政策与保险规则查询
        risk_warning = item.get("risk_warning", "")
        diagnosis = item.get("diagnosis") or item.get("invoice_type")
        if diagnosis:
            policy_text = search_policy(diagnosis)
            if policy_text and isinstance(policy_text, list):
                clean_policies = [re.sub(r'[#\*`]', '', p).strip() for p in policy_text]
                combined_policy = " ".join(clean_policies)
                policy_notice = f"【保司政策提醒: {combined_policy[:120]}...】"
                if risk_warning:
                    risk_warning = f"{risk_warning} {policy_notice}"
                else:
                    risk_warning = policy_notice

        # 3. 金额安全转换
        raw_amount = item.get("total_amount", 0.0)
        if raw_amount is None:
            raw_amount = 0.0
        try:
            total_amount = float(raw_amount)
        except (ValueError, TypeError):
            num_match = re.search(r'[\d\.]+', str(raw_amount))
            total_amount = float(num_match.group(0)) if num_match else 0.0

        compliance_score = float(item.get("compliance_score", 100.0) if item.get("compliance_score") is not None else 100.0)

        # 4. 跨境结算审批判定
        if total_amount > 50000.0:
            settlement_status = "PENDING_INSURER_APPROVAL"
        else:
            settlement_status = "AUTO_SETTLED"

        # 5. 自动入账
        ledger_item = LedgerItem(
            invoice_number=str(item.get("invoice_number", "UNKNOWN")),
            total_amount=total_amount,
            invoice_type=item.get("invoice_type", "医疗单据"),
            compliance_score=compliance_score,
            risk_warning=risk_warning or None,
            patient_name=item.get("patient_name"),
            hospital_name=item.get("hospital_name") or item.get("seller_name"),
            diagnosis=item.get("diagnosis"),
            diagnosis_en=item.get("diagnosis_en"),
            icd_code=item.get("icd_code"),
            currency=item.get("currency", "CNY"),
            settlement_status=settlement_status,
        )
        db.add(ledger_item)
        db.commit()
        db.refresh(ledger_item)

        responses.append(InvoiceAnalyzeResponse(
            buyer_name=item.get("buyer_name") or item.get("patient_name"),
            seller_name=item.get("seller_name") or item.get("hospital_name"),
            invoice_number=ledger_item.invoice_number,
            amount=ledger_item.total_amount,
            invoice_date=item.get("invoice_date", ""),
            invoice_type=ledger_item.invoice_type,
            risk_warning=risk_warning or None,
            workflow_status=settlement_status,
            compliance_score=compliance_score,
            patient_name=ledger_item.patient_name,
            hospital_name=ledger_item.hospital_name,
            diagnosis=ledger_item.diagnosis,
            diagnosis_en=ledger_item.diagnosis_en,
            icd_code=ledger_item.icd_code,
            currency=ledger_item.currency,
            settlement_status=settlement_status,
        ))

    return responses
