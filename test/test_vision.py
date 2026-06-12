import sys
import base64
import asyncio
from openai import OpenAI
from backend.app.core.config import settings

client = OpenAI(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=settings.ARK_API_KEY,
)

with open("frontend/public/发票案例.jpg", "rb") as f:
    content = f.read()
base64_img = base64.b64encode(content).decode("utf-8")
image_url = f"data:image/jpeg;base64,{base64_img}"

prompt = "请提取发票中的关键信息..."
try:
    response = client.chat.completions.create(
        model="doubao-seed-2-0-pro-260215",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": image_url}
                    }
                ]
            }
        ],
    )
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
