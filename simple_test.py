#!/usr/bin/env python3
"""
Teste simples para verificar se o sistema está funcionando
"""

import sys
import os

# Adicionar o diretório do projeto ao path
project_path = r"C:\Users\welli\OneDrive\Área de Trabalho\ProjetoVida-git\ProjetoVida-api"
if project_path not in sys.path:
    sys.path.insert(0, project_path)

def test_imports():
    """Testa as importações principais"""
    print("🔧 Testando importações...")
    
    try:
        import fastapi
        print("✅ FastAPI importado")
    except ImportError as e:
        print(f"❌ Erro ao importar FastAPI: {e}")
        return False
    
    try:
        import slowapi
        print("✅ SlowAPI importado")
    except ImportError as e:
        print(f"❌ Erro ao importar SlowAPI: {e}")
        return False
    
    try:
        import uvicorn
        print("✅ Uvicorn importado")
    except ImportError as e:
        print(f"❌ Erro ao importar Uvicorn: {e}")
        return False
    
    try:
        import pydantic
        print("✅ Pydantic importado")
    except ImportError as e:
        print(f"❌ Erro ao importar Pydantic: {e}")
        return False
    
    return True

def test_main_import():
    """Testa a importação do main.py"""
    print("\n🔧 Testando importação do main.py...")
    
    try:
        # Mudar para o diretório do projeto
        original_cwd = os.getcwd()
        os.chdir(project_path)
        
        # Tentar importar o main
        import main
        print("✅ main.py importado com sucesso!")
        
        # Verificar se a app foi criada
        if hasattr(main, 'app'):
            print("✅ FastAPI app criada")
        else:
            print("❌ FastAPI app não encontrada")
            return False
        
        # Verificar se os endpoints estão definidos
        routes = [route.path for route in main.app.routes]
        upload_routes = [route for route in routes if 'upload' in route]
        
        if upload_routes:
            print(f"✅ Endpoints de upload encontrados: {upload_routes}")
        else:
            print("❌ Endpoints de upload não encontrados")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao importar main.py: {e}")
        return False
    finally:
        # Restaurar diretório original
        os.chdir(original_cwd)

def main():
    """Função principal"""
    print("🚀 Teste simples do sistema de upload")
    print("=" * 50)
    
    # Testar importações
    if not test_imports():
        print("\n❌ Falha nas importações básicas")
        return
    
    # Testar importação do main
    if not test_main_import():
        print("\n❌ Falha na importação do main.py")
        return
    
    print("\n✅ Todos os testes passaram!")
    print("🎉 O sistema está pronto para ser executado!")

if __name__ == "__main__":
    main()



