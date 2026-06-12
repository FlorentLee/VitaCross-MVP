from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.domain import LedgerItem
from app.models.schemas import CEOReportResponse
from app.services.gemini_agent import generate_ceo_report

router = APIRouter()


@router.get("/ceo-report", response_model=CEOReportResponse)
def get_ceo_report(db: Session = Depends(get_db)):
    """
    AI 生成 VitaCross 医疗运营高管简报（实时数据驱动）
    """
    items = db.query(LedgerItem).all()
    total_expense = sum(item.total_amount for item in items if item.total_amount)
    total_revenue = total_expense * 1.42  # 医疗服务毛利润系数
    settled = sum(1 for i in items if i.settlement_status in ("AUTO_SETTLED", "SETTLED"))
    pending = sum(1 for i in items if i.settlement_status == "PENDING_INSURER_APPROVAL")
    rejected = sum(1 for i in items if i.settlement_status == "REJECTED")
    claim_rate = round((settled / len(items) * 100), 1) if items else 0

    prompt = (
        f"你是 VitaCross 的资深医疗运营总监。请用简洁、专业的语气，用中文撰写一份约200字的医疗运营高管简报。\n"
        f"本期关键数据：\n"
        f"- 总结算金额：¥{total_revenue:,.0f}（收入）/ ¥{total_expense:,.0f}（支出）\n"
        f"- 处理病历数：{len(items)} 份\n"
        f"- 已结算：{settled} 笔，待保司审批：{pending} 笔，拒赔：{rejected} 笔\n"
        f"- 核赔率：{claim_rate}%\n"
        f"请重点关注结算效率和合规风险，并给出下一步行动建议。"
    )
    report_content = generate_ceo_report(prompt)
    return CEOReportResponse(report=report_content)


@router.get("/mock-ceo-report", response_model=CEOReportResponse)
def get_mock_ceo_report():
    """
    获取模拟的 VitaCross 医疗运营周报（无需 AI API）
    """
    from app.services.gemini_agent import _mock_ceo_report
    return CEOReportResponse(report=_mock_ceo_report())
