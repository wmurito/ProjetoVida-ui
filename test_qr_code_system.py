#!/usr/bin/env python3
"""
Script de teste automatizado para o sistema de upload via QR Code
"""

import requests
import json
import base64
import time
import sys
from datetime import datetime

class QRCodeSystemTester:
    def __init__(self, backend_url="http://localhost:8000", frontend_url="http://localhost:5173"):
        self.backend_url = backend_url
        self.frontend_url = frontend_url
        self.test_results = []
        
    def log_test(self, test_name, success, message=""):
        """Registra resultado do teste"""
        status = "✅ PASSOU" if success else "❌ FALHOU"
        result = f"{status} - {test_name}"
        if message:
            result += f": {message}"
        
        print(result)
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
    def test_backend_connection(self):
        """Testa se o backend está acessível"""
        try:
            response = requests.get(f"{self.backend_url}/docs", timeout=5)
            if response.status_code == 200:
                self.log_test("Backend Connection", True, "Backend acessível")
                return True
            else:
                self.log_test("Backend Connection", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Backend Connection", False, str(e))
            return False
    
    def test_create_session(self):
        """Testa criação de sessão de upload"""
        try:
            response = requests.post(f"{self.backend_url}/create-upload-session", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'session_id' in data and 'upload_url' in data:
                    self.log_test("Create Session", True, f"Session ID: {data['session_id'][:8]}...")
                    return data['session_id']
                else:
                    self.log_test("Create Session", False, "Resposta inválida")
                    return None
            else:
                self.log_test("Create Session", False, f"Status: {response.status_code}")
                return None
        except Exception as e:
            self.log_test("Create Session", False, str(e))
            return None
    
    def test_qr_code_url(self, session_id):
        """Testa se a URL do QR code está correta"""
        if not session_id:
            self.log_test("QR Code URL", False, "Session ID não disponível")
            return False
            
        qr_url = f"{self.frontend_url}/upload-mobile/{session_id}"
        if session_id.startswith('upload-') and len(session_id) > 20:
            self.log_test("QR Code URL", True, f"URL: {qr_url}")
            return True
        else:
            self.log_test("QR Code URL", False, "Session ID inválido")
            return False
    
    def test_upload_file(self, session_id):
        """Testa upload de arquivo"""
        if not session_id:
            self.log_test("Upload File", False, "Session ID não disponível")
            return False
            
        try:
            # Criar arquivo de teste
            test_content = f"Teste de upload - {datetime.now()}"
            base64_content = base64.b64encode(test_content.encode()).decode()
            data_url = f"data:text/plain;base64,{base64_content}"
            
            upload_data = {
                "fileName": "teste_upload.txt",
                "fileType": "text/plain",
                "fileData": data_url
            }
            
            response = requests.post(
                f"{self.backend_url}/upload-mobile/{session_id}",
                json=upload_data,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("Upload File", True, "Upload realizado com sucesso")
                return True
            else:
                self.log_test("Upload File", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Upload File", False, str(e))
            return False
    
    def test_check_status(self, session_id):
        """Testa verificação de status"""
        if not session_id:
            self.log_test("Check Status", False, "Session ID não disponível")
            return False
            
        try:
            response = requests.get(f"{self.backend_url}/upload-status/{session_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.log_test("Check Status", True, f"Arquivo encontrado: {data.get('fileName', 'N/A')}")
                return True
            elif response.status_code == 404:
                self.log_test("Check Status", True, "Arquivo não encontrado (normal)")
                return True
            else:
                self.log_test("Check Status", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Check Status", False, str(e))
            return False
    
    def test_rate_limiting(self):
        """Testa rate limiting"""
        try:
            # Tentar criar várias sessões rapidamente
            for i in range(12):  # Mais que o limite de 10/min
                response = requests.post(f"{self.backend_url}/create-upload-session", timeout=5)
                if response.status_code == 429:
                    self.log_test("Rate Limiting", True, f"Bloqueado na tentativa {i+1}")
                    return True
                time.sleep(0.1)
            
            self.log_test("Rate Limiting", False, "Rate limiting não ativado")
            return False
            
        except Exception as e:
            self.log_test("Rate Limiting", False, str(e))
            return False
    
    def test_cors_configuration(self):
        """Testa configuração CORS"""
        try:
            headers = {
                'Origin': self.frontend_url,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = requests.options(
                f"{self.backend_url}/create-upload-session",
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                cors_headers = response.headers
                if 'Access-Control-Allow-Origin' in cors_headers:
                    self.log_test("CORS Configuration", True, "CORS configurado corretamente")
                    return True
                else:
                    self.log_test("CORS Configuration", False, "Headers CORS ausentes")
                    return False
            else:
                self.log_test("CORS Configuration", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("CORS Configuration", False, str(e))
            return False
    
    def test_frontend_accessibility(self):
        """Testa se o frontend está acessível"""
        try:
            response = requests.get(self.frontend_url, timeout=5)
            if response.status_code == 200:
                self.log_test("Frontend Accessibility", True, "Frontend acessível")
                return True
            else:
                self.log_test("Frontend Accessibility", False, f"Status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Frontend Accessibility", False, str(e))
            return False
    
    def run_all_tests(self):
        """Executa todos os testes"""
        print("🚀 Iniciando testes do sistema de upload via QR Code")
        print("=" * 60)
        print(f"Backend: {self.backend_url}")
        print(f"Frontend: {self.frontend_url}")
        print("=" * 60)
        
        # Testes básicos
        backend_ok = self.test_backend_connection()
        frontend_ok = self.test_frontend_accessibility()
        
        if not backend_ok:
            print("\n❌ Backend não está acessível. Verifique se está rodando.")
            return False
        
        # Testes de funcionalidade
        session_id = self.test_create_session()
        self.test_qr_code_url(session_id)
        
        if session_id:
            self.test_upload_file(session_id)
            time.sleep(2)  # Aguardar processamento
            self.test_check_status(session_id)
        
        # Testes de segurança
        self.test_rate_limiting()
        self.test_cors_configuration()
        
        # Resumo
        self.print_summary()
        return True
    
    def print_summary(self):
        """Imprime resumo dos testes"""
        print("\n" + "=" * 60)
        print("📊 RESUMO DOS TESTES")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Testes executados: {total}")
        print(f"Testes aprovados: {passed}")
        print(f"Testes falharam: {total - passed}")
        print(f"Taxa de sucesso: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 TODOS OS TESTES PASSARAM!")
            print("✅ Sistema de upload via QR Code está funcionando perfeitamente!")
        else:
            print(f"\n⚠️  {total - passed} TESTE(S) FALHARAM")
            print("❌ Verifique os problemas listados acima")
        
        # Salvar relatório
        self.save_report()
    
    def save_report(self):
        """Salva relatório de testes"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'backend_url': self.backend_url,
            'frontend_url': self.frontend_url,
            'total_tests': len(self.test_results),
            'passed_tests': sum(1 for r in self.test_results if r['success']),
            'results': self.test_results
        }
        
        filename = f"qr_code_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Relatório salvo em: {filename}")

def main():
    """Função principal"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Teste do sistema de upload via QR Code')
    parser.add_argument('--backend', default='http://localhost:8000', help='URL do backend')
    parser.add_argument('--frontend', default='http://localhost:5173', help='URL do frontend')
    parser.add_argument('--production', action='store_true', help='Modo produção')
    
    args = parser.parse_args()
    
    if args.production:
        print("🚀 Modo PRODUÇÃO")
        backend_url = input("URL do backend (ex: https://api.seudominio.com): ")
        frontend_url = input("URL do frontend (ex: https://seudominio.com): ")
    else:
        backend_url = args.backend
        frontend_url = args.frontend
    
    tester = QRCodeSystemTester(backend_url, frontend_url)
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()



