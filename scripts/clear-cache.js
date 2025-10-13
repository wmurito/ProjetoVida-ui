#!/usr/bin/env node

/**
 * Script para limpar cache e forçar rebuild com nova URL da API
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Limpando cache e forçando rebuild...\n');

// Diretórios e arquivos para limpar
const itemsToClean = [
  'dist',
  '.vite',
  'node_modules/.vite',
  'node_modules/.cache'
];

// Função para remover diretório/arquivo
function removeItem(itemPath) {
  try {
    if (fs.existsSync(itemPath)) {
      if (fs.statSync(itemPath).isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
        console.log(`✅ Removido diretório: ${itemPath}`);
      } else {
        fs.unlinkSync(itemPath);
        console.log(`✅ Removido arquivo: ${itemPath}`);
      }
    } else {
      console.log(`ℹ️  Não encontrado: ${itemPath}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao remover ${itemPath}:`, error.message);
  }
}

// Limpar itens
console.log('🗑️  Removendo arquivos de cache...');
itemsToClean.forEach(removeItem);

// Verificar se há referências à URL antiga
console.log('\n🔍 Verificando referências à URL antiga...');

const oldUrls = [
  'https://84i83ihklg.execute-api.us-east-1.amazonaws.com',
  'https://iyp8pei8j7.execute-api.us-east-1.amazonaws.com'
];

let foundOldUrls = false;

// Procurar em arquivos JavaScript/TypeScript
const searchInFiles = (dir, extensions = ['.js', '.jsx', '.ts', '.tsx', '.json']) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !['node_modules', 'dist', '.git'].includes(file.name)) {
      searchInFiles(fullPath, extensions);
    } else if (file.isFile() && extensions.some(ext => file.name.endsWith(ext))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        oldUrls.forEach(oldUrl => {
          if (content.includes(oldUrl)) {
            console.log(`⚠️  URL antiga encontrada em: ${fullPath}`);
            foundOldUrls = true;
          }
        });
      } catch (error) {
        // Ignorar erros de leitura
      }
    }
  });
};

searchInFiles('src');

if (!foundOldUrls) {
  console.log('✅ Nenhuma referência à URL antiga encontrada nos arquivos');
}

// Mostrar instruções para o usuário
console.log('\n📋 Próximos passos:');
console.log('1. Limpe o cache do navegador (Ctrl+Shift+R ou Cmd+Shift+R)');
console.log('2. Execute: npm run build');
console.log('3. Execute: npm run preview (para testar localmente)');
console.log('4. Ou faça deploy para produção');

console.log('\n🔧 Para limpar cache do navegador:');
console.log('- Chrome: F12 → Network → Disable cache (com DevTools aberto)');
console.log('- Firefox: F12 → Network → Settings → Disable cache');
console.log('- Safari: Develop → Empty Caches');

console.log('\n✅ Limpeza concluída!');
