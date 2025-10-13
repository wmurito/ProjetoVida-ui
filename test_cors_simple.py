import requests

url = "https://pteq15e8a6.execute-api.us-east-1.amazonaws.com/"
headers = {'Origin': 'https://master.d1yi28nqqe44f2.amplifyapp.com'}

try:
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    print("CORS Headers:")
    for k, v in response.headers.items():
        if "access-control" in k.lower():
            print(f"  {k}: {v}")
    
    if 'Access-Control-Allow-Origin' in response.headers:
        print("✅ CORS configurado")
    else:
        print("❌ CORS não configurado")
        
except Exception as e:
    print(f"Erro: {e}")
