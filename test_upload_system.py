#!/usr/bin/env python3
"""
Script de teste para o sistema de upload via QR Code
"""

import requests
import json
import base64
import time
from datetime import datetime

# Configurações
BASE_URL = "http://localhost:8000"
TEST_FILE_PATH = "test_file.txt"

def create_test_file():
    """Cria um arquivo de teste"""
    test_content = f"Teste de upload - {datetime.now()}\nEste é um arquivo de teste para verificar o sistema de upload via QR Code."
    
    with open(TEST_FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(test_content)
    
    print(f"✅ Arquivo de teste criado: {TEST_FILE_PATH}")

def test_create_session():
    """Testa a criação de uma sessão de upload"""
    print("\n🔧 Testando criação de sessão...")
    
    try:
        response = requests.post(f"{BASE_URL}/create-upload-session", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sessão criada com sucesso!")
            print(f"   Session ID: {data['session_id']}")
            print(f"   Upload URL: {data['upload_url']}")
            print(f"   Expires in: {data['expires_in']} segundos")
            return data['session_id']
        else:
            print(f"❌ Erro ao criar sessão: {response.status_code}")
            print(f"   Resposta: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Erro de conexão. Verifique se o servidor está rodando.")
        return None
    except Exception as e:
        print(f"❌ Erro inesperado: {str(e)}")
        return None

def test_upload_file(session_id):
    """Testa o upload de um arquivo"""
    print(f"\n📤 Testando upload de arquivo para sessão: {session_id[:8]}...")
    
    try:
        # Ler arquivo e converter para base64
        with open(TEST_FILE_PATH, 'rb') as f:
            file_content = f.read()
        
        # Converter para base64
        base64_content = base64.b64encode(file_content).decode('utf-8')
        data_url = f"data:text/plain;base64,{base64_content}"
        
        # Preparar dados do upload
        upload_data = {
            "fileName": "teste_upload.txt",
            "fileType": "text/plain",
            "fileData": data_url
        }
        
        # Fazer upload
        response = requests.post(
            f"{BASE_URL}/upload-mobile/{session_id}",
            json=upload_data,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Upload realizado com sucesso!")
            return True
        else:
            print(f"❌ Erro no upload: {response.status_code}")
            print(f"   Resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro no upload: {str(e)}")
        return False

def test_check_status(session_id):
    """Testa a verificação de status do upload"""
    print(f"\n🔍 Testando verificação de status para sessão: {session_id[:8]}...")
    
    try:
        response = requests.get(f"{BASE_URL}/upload-status/{session_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Status verificado com sucesso!")
            print(f"   Arquivo encontrado: {data.get('fileName', 'N/A')}")
            print(f"   Tipo: {data.get('fileType', 'N/A')}")
            return True
        elif response.status_code == 404:
            print("⚠️  Arquivo ainda não encontrado (normal se acabou de fazer upload)")
            return False
        else:
            print(f"❌ Erro ao verificar status: {response.status_code}")
            print(f"   Resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao verificar status: {str(e)}")
        return False

def test_rate_limiting():
    """Testa o rate limiting"""
    print("\n🚦 Testando rate limiting...")
    
    try:
        # Tentar criar várias sessões rapidamente
        for i in range(12):  # Mais que o limite de 10/min
            response = requests.post(f"{BASE_URL}/create-upload-session", timeout=5)
            if response.status_code == 429:
                print(f"✅ Rate limiting funcionando! Bloqueado na tentativa {i+1}")
                return True
            time.sleep(0.1)
        
        print("⚠️  Rate limiting não foi ativado")
        return False
        
    except Exception as e:
        print(f"❌ Erro no teste de rate limiting: {str(e)}")
        return False

def cleanup():
    """Limpa arquivos de teste"""
    import os
    try:
        if os.path.exists(TEST_FILE_PATH):
            os.remove(TEST_FILE_PATH)
            print(f"\n🧹 Arquivo de teste removido: {TEST_FILE_PATH}")
    except Exception as e:
        print(f"⚠️  Erro ao remover arquivo de teste: {str(e)}")

def main():
    """Função principal de teste"""
    print("🚀 Iniciando testes do sistema de upload via QR Code")
    print("=" * 60)
    
    # Verificar se o servidor está rodando
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ Servidor está rodando!")
        else:
            print("⚠️  Servidor respondeu com status diferente de 200")
    except:
        print("❌ Servidor não está rodando ou não está acessível")
        print("   Execute: uvicorn main:app --reload")
        return
    
    # Criar arquivo de teste
    create_test_file()
    
    # Testar criação de sessão
    session_id = test_create_session()
    if not session_id:
        cleanup()
        return
    
    # Testar upload
    upload_success = test_upload_file(session_id)
    
    # Aguardar um pouco e testar status
    if upload_success:
        print("\n⏳ Aguardando 3 segundos...")
        time.sleep(3)
        test_check_status(session_id)
    
    # Testar rate limiting
    test_rate_limiting()
    
    # Limpeza
    cleanup()
    
    print("\n" + "=" * 60)
    print("🏁 Testes concluídos!")

if __name__ == "__main__":
    main()



