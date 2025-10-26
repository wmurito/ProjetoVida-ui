#!/usr/bin/env node

/**
 * Script de Limpeza de Segurança - ProjetoVida
 * Remove credenciais e dados sensíveis do repositório Git
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔒 Iniciando limpeza de segurança do repositório...\n');

// Arquivos sensíveis que devem ser removidos do Git
const sensitiveFiles = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.staging',
  'src/aws-exports.js',
  'aws-exports.js',
  'config.local.js',
  'settings.local.js'
];

// Verificar se estamos em um repositório Git
function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ Erro: Não estamos em um repositório Git');
    return false;
  }
}

// Verificar se arquivo existe
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Sanitizar caminho de arquivo para prevenir command injection
function sanitizeFilePath(filePath) {
  // Remover caracteres perigosos e normalizar caminho
  const normalized = path.normalize(filePath).replace(/[;&|`$(){}\[\]<>]/g, '');
  // Verificar se o caminho está dentro do projeto
  const resolved = path.resolve(normalized);
  const projectRoot = path.resolve('.');
  if (!resolved.startsWith(projectRoot)) {
    throw new Error('Caminho inválido: fora do projeto');
  }
  return normalized;
}

// Remover arquivo do Git (mas manter localmente)
function removeFromGit(filePath) {
  try {
    // Sanitizar caminho antes de usar
    const safePath = sanitizeFilePath(filePath);
    
    if (fileExists(safePath)) {
      // Usar spawn ao invés de execSync para prevenir injection
      const { spawnSync } = require('child_process');
      const result = spawnSync('git', ['rm', '--cached', safePath], { stdio: 'pipe' });
      if (result.status === 0) {
        console.log(`✅ Removido do Git: ${safePath}`);
        return true;
      }
      throw new Error(result.stderr?.toString() || 'Erro ao remover arquivo');
    } else {
      console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao remover ${filePath}:`, error.message);
    return false;
  }
}

// Verificar se arquivo está no .gitignore
function checkGitignore(filePath) {
  try {
    const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    return gitignoreContent.includes(filePath);
  } catch (error) {
    return false;
  }
}

// Adicionar arquivo ao .gitignore se não estiver
function addToGitignore(filePath) {
  try {
    let gitignoreContent = '';
    if (fileExists('.gitignore')) {
      gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
    }
    
    if (!gitignoreContent.includes(filePath)) {
      gitignoreContent += `\n# Arquivo sensível removido automaticamente\n${filePath}\n`;
      fs.writeFileSync('.gitignore', gitignoreContent);
      console.log(`✅ Adicionado ao .gitignore: ${filePath}`);
    } else {
      console.log(`ℹ️  Já está no .gitignore: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Erro ao adicionar ao .gitignore:`, error.message);
  }
}

// Verificar status do Git
function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    return status.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    console.error('❌ Erro ao verificar status do Git:', error.message);
    return [];
  }
}

// Função principal
function main() {
  console.log('🔍 Verificando repositório Git...');
  
  if (!checkGitRepo()) {
    process.exit(1);
  }
  
  console.log('✅ Repositório Git encontrado\n');
  
  console.log('🔍 Verificando arquivos sensíveis...');
  let removedCount = 0;
  
  sensitiveFiles.forEach(file => {
    console.log(`\n📁 Verificando: ${file}`);
    
    if (fileExists(file)) {
      console.log(`⚠️  Arquivo sensível encontrado: ${file}`);
      
      // Verificar se está sendo rastreado pelo Git
      try {
        const safeFile = sanitizeFilePath(file);
        const { spawnSync } = require('child_process');
        const result = spawnSync('git', ['ls-files', safeFile], { encoding: 'utf8' });
        if (result.stdout && result.stdout.trim()) {
          console.log(`🚨 Arquivo está sendo rastreado pelo Git!`);
          
          if (removeFromGit(file)) {
            removedCount++;
            addToGitignore(file);
          }
        } else {
          console.log(`✅ Arquivo não está sendo rastreado pelo Git`);
        }
      } catch (error) {
        console.log(`✅ Arquivo não está sendo rastreado pelo Git`);
      }
    } else {
      console.log(`✅ Arquivo não encontrado`);
    }
  });
  
  console.log(`\n📊 Resumo da limpeza:`);
  console.log(`   - Arquivos removidos do Git: ${removedCount}`);
  console.log(`   - Arquivos verificados: ${sensitiveFiles.length}`);
  
  if (removedCount > 0) {
    console.log(`\n🚨 ATENÇÃO: ${removedCount} arquivo(s) sensível(is) foi(ram) removido(s) do Git!`);
    console.log(`\n📋 Próximos passos:`);
    console.log(`   1. Commit as mudanças:`);
    console.log(`      git add .gitignore`);
    console.log(`      git commit -m "security: Remove sensitive files from repository"`);
    console.log(`   2. Push as mudanças:`);
    console.log(`      git push`);
    console.log(`   3. Configure as variáveis de ambiente no seu ambiente de produção`);
    console.log(`   4. Considere rotacionar as credenciais expostas`);
  } else {
    console.log(`\n✅ Nenhum arquivo sensível encontrado no Git!`);
  }
  
  console.log(`\n🔍 Verificando status atual do Git...`);
  const gitStatus = checkGitStatus();
  if (gitStatus.length > 0) {
    console.log(`\n📋 Mudanças pendentes:`);
    gitStatus.forEach(change => {
      console.log(`   ${change}`);
    });
  } else {
    console.log(`\n✅ Nenhuma mudança pendente`);
  }
  
  console.log(`\n🔒 Limpeza de segurança concluída!`);
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { main, removeFromGit, checkGitRepo };
