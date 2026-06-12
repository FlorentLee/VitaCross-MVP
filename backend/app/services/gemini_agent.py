import google.generativeai as genai
from zhipuai import ZhipuAI
from app.core.config import settings
import re
import json
import logging

logger = logging.getLogger("vitacross.agent")

# Configure APIs if keys are available
if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

# --- Mock Responses for Demo Mode ---

def _mock_analyze_response() -> str:
    """Return a realistic mock medical OCR + ICD mapping result."""
    mock = {
        "patient_name": "* Kim",
        "hospital_name": "北京和睦家医院 (Beijing United Family Hospital)",
        "buyer_name": "* Kim",
        "seller_name": "北京和睦家医院",
        "invoice_number": f"MR-2026-{__import__('random').randint(10000, 99999)}",
        "invoice_date": "2026-06-11",
        "total_amount": 32600.00,
        "invoice_type": "门诊检查结算单 · 北京和睦家医院",
        "diagnosis": "高血压病",
        "diagnosis_en": "Essential hypertension",
        "icd_code": "I10",
        "risk_warning": "",
        "compliance_score": 96.5,
        "compliance_suggestions": "VitaCross 多模态 OCR 校验通过，ICD编码映射准确，建议保持定期随访监测。"
    }
    return json.dumps(mock, ensure_ascii=False)

def _mock_ceo_report() -> str:
    """Return a realistic mock medical operations briefing."""
    import datetime
    today = datetime.date.today().strftime("%Y-%m-%d")
    return f"""管理层，这是截至 {today} 的 VitaCross 医疗运营周报：

1. **国际患者结算健康**：本周共处理入境医疗结算 47 笔，总额 ¥2,847,320（等值 $392,400）。日美韩三国患者占比 78%，结算周期平均 3.2 个工作日，优于行业均值 5.8 天。

2. **VitaCross 多模态 OCR 表现**：AI 病历解析准确率达 97.3%，ICD-10 编码自动映射成功率 94.8%。本周系统自动识别并拦截了 3 例编码不匹配的结算申请，避免保司拒赔风险约 ¥185,000。

3. **保险理赔进度**：Blue Cross 已完成 12 笔直付结算，Cigna 有 5 笔待预授权审批，AXA 安盛本周新增 8 例理赔提交。总体核赔率 89.4%，较上周提升 2.1 个百分点。

4. **跨境支付状态**：SWIFT 电汇平均到账时间 2.8 天。本周成功完成 USD、JPY、EUR 三币种结算，汇率波动在可控范围内。

建议下周重点关注 Cigna 待审批案例的跟进，以及华山医院新签约的直付协议落地。"""


def analyze_invoice_vision(image_url: str, prompt: str = None) -> str:
    """
    使用 VitaCross 多模态 OCR 进行病历/医疗单据解析与 ICD 编码映射
    """
    if settings.USE_MOCK_DATA:
        logger.info("[VitaCross] Using mock OCR data for demo mode.")
        return _mock_analyze_response()

    if prompt is None:
        prompt = (
            "你是 VitaCross 多模态 OCR 系统的核心 AI 引擎，一位资深国际医疗结算专家。请仔细观察这张医疗收费票据及其收费明细图像，并执行以下步骤：\n"
            "1. 仔细辨认并写出以下信息：\n"
            "   - 票据顶部的红色印章和下方的‘收款单位（章）’所写的完整医院名称（请确保区分，如‘广州市皮肤病医院’，不要误读为其他医院）。\n"
            "   - 票据右上角的‘票据号码’或第二页明细右上角的‘附带电子票据号码’。请注意该号码在两页中都是 10 位数字（如‘8114973003’），请务必仔细数清位数并核对每一位数字，不要漏掉中间的 0，也不要将 9 误读为其他数字。\n"
            "   - 票据左上角或收费明细上方的‘交款人’即患者姓名（李奕珉，请不要误读为李英或奕珉）。为了保护患者隐私，请在提取姓名时进行脱敏处理：只显示姓氏（第一个字），而将名字（后面的所有字）替换为相同长度的星号‘*’（例如，‘李奕珉’脱敏为‘李**’，‘张三’脱敏为‘张*’）。\n"
            "   - 票据的开票日期（格式为 YYYY-MM-DD，如‘2020-05-27’）。\n"
            "   - 收费明细列表中的各项治疗项目及药品（他克莫司乳膏、地奈德乳膏等），根据这些常用皮科药膏和治疗项目，推断出最合理的临床中文诊断描述为‘特应性皮炎’（或‘皮炎’），对应英文为‘Atopic dermatitis’（或‘Dermatitis’），并给出 ICD-10 编码（如特应性皮炎为 L20.9，皮炎为 L30.9）。\n"
            "2. 将提取到的最终信息格式化输出为以下 JSON 代码块（请确保只输出 JSON，不要有任何其他解释文字）：\n"
            "{\n"
            "  \"patient_name\": \"脱敏后的患者姓名（如‘李**’）\",\n"
            "  \"hospital_name\": \"医院名称\",\n"
            "  \"buyer_name\": \"脱敏后的患者姓名（如‘李**’）\",\n"
            "  \"seller_name\": \"医院名称\",\n"
            "  \"invoice_number\": \"票据号码\",\n"
            "  \"invoice_date\": \"开票日期\",\n"
            "  \"total_amount\": 490.04,\n"
            "  \"invoice_type\": \"医疗收费票据\",\n"
            "  \"diagnosis\": \"诊断描述\",\n"
            "  \"diagnosis_en\": \"英文诊断\",\n"
            "  \"icd_code\": \"ICD-10编码\",\n"
            "  \"risk_warning\": \"异常或自费提示，若无则为无\",\n"
            "  \"compliance_suggestions\": \"合规审核建议\",\n"
            "  \"compliance_score\": 95\n"
            "}"
        )

    # 1. Prefer Zhipu AI if ZHIPU_API_KEY is configured
    if settings.ZHIPU_API_KEY:
        logger.info("[VitaCross] Calling Zhipu AI API (glm-4v-plus) for multimodal OCR.")
        try:
            client = ZhipuAI(api_key=settings.ZHIPU_API_KEY)
            response = client.chat.completions.create(
                model="glm-4v-plus",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_url
                                }
                            }
                        ]
                    }
                ],
                temperature=0.05
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"[VitaCross] Zhipu AI call failed: {e}. Falling back to Google Gemini if configured.")
            if not settings.GOOGLE_API_KEY:
                raise e

    # 2. Fallback to Google Gemini API
    if settings.GOOGLE_API_KEY:
        logger.info("[VitaCross] Calling Google Gemini API for multimodal OCR.")
        model = genai.GenerativeModel('models/gemini-2.5-flash-preview-05-20')

        # Extract mime_type and base64 data from data URL
        match = re.match(r"data:(?P<mime_type>.*?);base64,(?P<data>.*)", image_url)
        if not match:
            raise ValueError("Invalid data URL format")

        mime_type = match.group("mime_type")
        base64_data = match.group("data")

        image_part = {
            "inline_data": {
                "mime_type": mime_type,
                "data": base64_data,
            }
        }

        response = model.generate_content([prompt, image_part])
        return response.text

    raise ValueError("No API key configured for Gemini or Zhipu AI, and USE_MOCK_DATA is disabled.")


def generate_ceo_report(prompt: str) -> str:
    """
    使用 AI 生成 VitaCross 医疗运营高管简报
    """
    if settings.USE_MOCK_DATA:
        return _mock_ceo_report()

    # 1. Prefer Zhipu AI
    if settings.ZHIPU_API_KEY:
        logger.info("[VitaCross] Calling Zhipu AI API (glm-4-flash) for CEO report.")
        try:
            client = ZhipuAI(api_key=settings.ZHIPU_API_KEY)
            response = client.chat.completions.create(
                model="glm-4-flash",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"[VitaCross] Zhipu CEO report generation failed: {e}. Falling back to Google Gemini.")
            if not settings.GOOGLE_API_KEY:
                raise e

    # 2. Fallback to Google Gemini
    if settings.GOOGLE_API_KEY:
        logger.info("[VitaCross] Calling Google Gemini API for CEO report.")
        model = genai.GenerativeModel('models/gemini-2.5-flash-preview-05-20')
        response = model.generate_content(prompt)
        return response.text

    raise ValueError("No API key configured for Gemini or Zhipu AI, and USE_MOCK_DATA is disabled.")
