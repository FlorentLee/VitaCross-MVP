from fastapi import APIRouter

router = APIRouter(prefix="/api/workflow", tags=["workflow"])


@router.get("/config")
async def get_workflow_config():
    """
    返回 VitaCross 跨境结算审批流配置
    """
    return {
        "flow_name": "国际患者跨境结算标准审批流",
        "status": "running",
        "amount_threshold": 50000.0,
        "currency_routing": {
            "USD": "SWIFT_STANDARD",
            "JPY": "SWIFT_EXPRESS",
            "EUR": "SEPA",
            "CNY": "CIPS",
        },
        "auto_audit_rules": [
            "ICD编码与诊断一致性验证",
            "医院定价区域均值比对",
            "重复结算检测",
            "保险覆盖范围核查",
        ],
        "approvers": [
            {"role": "AI合规审核", "type": "automatic"},
            {"role": "保司预授权", "type": "manual", "sla_hours": 48},
            {"role": "财务核准", "type": "manual", "sla_hours": 24},
        ],
        "supported_insurers": ["Blue Cross", "Cigna Global", "AXA", "Allianz Care"],
    }
