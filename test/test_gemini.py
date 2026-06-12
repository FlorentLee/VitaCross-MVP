import base64
import sys
import os

# Add the backend path to the sys.path
sys.path.append(os.path.abspath('backend'))

from app.services.gemini_agent import analyze_invoice_vision

def test_invoice_analysis():
    image_path = "frontend/public/发票案例.jpg"
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
    
    mime_type = "image/jpeg"
    image_url = f"data:{mime_type};base64,{encoded_string}"
    
    result = analyze_invoice_vision(image_url)
    
    print("====================================")
    print("        Invoice Analysis            ")
    print("====================================")
    print(result)
    print("====================================")

if __name__ == "__main__":
    test_invoice_analysis()
