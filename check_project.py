import os
import sys

project_path = r'C:\Users\welli\OneDrive\Área de Trabalho\ProjetoVida-git\ProjetoVida-api'
if os.path.exists(project_path):
    print('✅ Diretório encontrado:', project_path)
    os.chdir(project_path)
    print('✅ Mudou para o diretório:', os.getcwd())
    print('📁 Arquivos no diretório:')
    for file in os.listdir('.'):
        print(f'   - {file}')
else:
    print('❌ Diretório não encontrado')
    # Listar diretórios em Área de Trabalho
    area_trabalho = r'C:\Users\welli\OneDrive\Área de Trabalho'
    if os.path.exists(area_trabalho):
        print('📁 Conteúdo da Área de Trabalho:')
        for item in os.listdir(area_trabalho):
            if 'ProjetoVida' in item:
                print(f'   - {item}')



