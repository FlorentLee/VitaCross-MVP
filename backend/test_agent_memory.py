import sys
import base64
from app.services.doubao_agent import analyze_invoice_vision, get_memory_usage

def test_vision():
    try:
        print(f"--- 启动时内存: {get_memory_usage():.2f} MB ---")
        
        with open('../frontend/public/发票案例.jpg', 'rb') as f:
            content = f.read()
            
        base64_img = base64.b64encode(content).decode('utf-8')
        image_url = f"data:image/jpeg;base64,{base64_img}"
        
        print("开始请求模型...")
        res = analyze_invoice_vision(image_url)
        print("模型返回结果:")
        print(res)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_vision()
