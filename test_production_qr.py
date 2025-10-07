#!/usr/bin/env python3
"""
Script de teste para verificar o sistema de upload via QR Code em produção
"""

import requests
import json
import time
from datetime import datetime

def test_production_system(api_url, frontend_url):
    """Testa o sistema em produção"""
    
    print("🚀 Teste do Sistema de Upload via QR Code - PRODUÇÃO")
    print("=" * 70)
    print(f"API URL: {api_url}")
    print(f"Frontend URL: {frontend_url}")
    print("=" * 70)
    
    tests_passed = 0
    total_tests = 0
    
    def run_test(test_name, test_func):
        nonlocal tests_passed, total_tests
        total_tests += 1
        
        try:
            result = test_func()
            if result:
                print(f"✅ {test_name}")
                tests_passed += 1
            else:
                print(f"❌ {test_name}")
        except Exception as e:
            print(f"❌ {test_name} - Erro: {str(e)}")
    
    # Teste 1: Conectividade da API
    def test_api_connectivity():
        response = requests.get(f"{api_url}/docs", timeout=10)
        return response.status_code == 200
    
    # Teste 2: Criação de sessão
    def test_create_session():
        response = requests.post(f"{api_url}/create-upload-session", timeout=10)
        if response.status_code == 200:
            data = response.json()
            return 'session_id' in data and 'upload_url' in data
        return False
    
    # Teste 3: CORS Configuration
    def test_cors():
        headers = {
            'Origin': frontend_url,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        response = requests.options(
            f"{api_url}/create-upload-session",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            cors_headers = response.headers
            return 'Access-Control-Allow-Origin' in cors_headers
        return False
    
    # Teste 4: SSL/HTTPS
    def test_ssl():
        return api_url.startswith('https://') and frontend_url.startswith('https://')
    
    # Teste 5: Rate Limiting
    def test_rate_limiting():
        for i in range(12):
            response = requests.post(f"{api_url}/create-upload-session", timeout=5)
            if response.status_code == 429:
                return True
            time.sleep(0.1)
        return False
    
    # Teste 6: Frontend Accessibility
    def test_frontend():
        response = requests.get(frontend_url, timeout=10)
        return response.status_code == 200
    
    # Teste 7: Upload de arquivo
    def test_upload():
        # Criar sessão
        session_response = requests.post(f"{api_url}/create-upload-session", timeout=10)
        if session_response.status_code != 200:
            return False
        
        session_id = session_response.json()['session_id']
        
        # Testar upload
        import base64
        test_content = "Teste de upload em produção"
        base64_content = base64.b64encode(test_content.encode()).decode()
        data_url = f"data:text/plain;base64,{base64_content}"
        
        upload_data = {
            "fileName": "teste_producao.txt",
            "fileType": "text/plain",
            "fileData": data_url
        }
        
        response = requests.post(
            f"{api_url}/upload-mobile/{session_id}",
            json=upload_data,
            timeout=10
        )
        
        return response.status_code == 200
    
    # Executar testes
    run_test("Conectividade da API", test_api_connectivity)
    run_test("Criação de Sessão", test_create_session)
    run_test("Configuração CORS", test_cors)
    run_test("SSL/HTTPS", test_ssl)
    run_test("Rate Limiting", test_rate_limiting)
    run_test("Acessibilidade do Frontend", test_frontend)
    run_test("Upload de Arquivo", test_upload)
    
    # Resumo
    print("\n" + "=" * 70)
    print("📊 RESUMO DOS TESTES DE PRODUÇÃO")
    print("=" * 70)
    print(f"Testes executados: {total_tests}")
    print(f"Testes aprovados: {tests_passed}")
    print(f"Testes falharam: {total_tests - tests_passed}")
    print(f"Taxa de sucesso: {(tests_passed/total_tests)*100:.1f}%")
    
    if tests_passed == total_tests:
        print("\n🎉 SISTEMA DE PRODUÇÃO FUNCIONANDO PERFEITAMENTE!")
        print("✅ Todos os testes passaram - Sistema pronto para uso!")
    else:
        print(f"\n⚠️  {total_tests - tests_passed} TESTE(S) FALHARAM")
        print("❌ Verifique os problemas antes de colocar em produção")
    
    return tests_passed == total_tests

def main():
    """Função principal"""
    print("🔧 Teste de Produção - Sistema de Upload via QR Code")
    print("=" * 50)
    
    # Solicitar URLs
    api_url = input("URL da API (ex: https://api.seudominio.com): ").strip()
    frontend_url = input("URL do Frontend (ex: https://seudominio.com): ").strip()
    
    if not api_url or not frontend_url:
        print("❌ URLs são obrigatórias!")
        return
    
    # Executar testes
    success = test_production_system(api_url, frontend_url)
    
    # Salvar relatório
    report = {
        'timestamp': datetime.now().isoformat(),
        'api_url': api_url,
        'frontend_url': frontend_url,
        'success': success
    }
    
    filename = f"production_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 Relatório salvo em: {filename}")

if __name__ == "__main__":
    main()



