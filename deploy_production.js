#!/usr/bin/env node
/**
 * Script para deploy do frontend em produção
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function setupProductionEnvironment() {
    console.log('[INFO] Configurando ambiente para PRODUÇÃO...');
    
    try {
        // Executar script de troca de ambiente
        const scriptPath = path.join(__dirname, 'scripts', 'switch_env.js');
        const result = execSync(`node ${scriptPath} production`, { 
            encoding: 'utf8',
            stdio: 'pipe'
        });
        
        console.log('[OK] Ambiente configurado para PRODUÇÃO');
        console.log(result);
        return true;
    } catch (error) {
        console.log('[ERRO] Erro ao configurar ambiente:');
        console.log(error.message);
        return false;
    }
}

function buildForProduction() {
    console.log('\n[INFO] Fazendo build para produção...');
    
    try {
        console.log('[INFO] Executando npm run build...');
        
        // Executar build
        execSync('npm run build', { 
            stdio: 'inherit',
            cwd: __dirname
        });
        
        console.log('[SUCESSO] Build concluído com sucesso!');
        return true;
        
    } catch (error) {
        console.log('[ERRO] Erro durante o build:', error.message);
        return false;
    }
}

function main() {
    console.log('='.repeat(60));
    console.log('DEPLOY PARA PRODUÇÃO - ProjetoVida Frontend');
    console.log('='.repeat(60));
    
    // Configurar ambiente para produção
    if (!setupProductionEnvironment()) {
        console.log('[ERRO] Falha na configuração do ambiente');
        return;
    }
    
    // Fazer build para produção
    if (!buildForProduction()) {
        console.log('[ERRO] Falha no build');
        return;
    }
    
    console.log('\n[SUCESSO] Frontend pronto para deploy!');
    console.log('[INFO] Próximos passos:');
    console.log('   1. Faça commit das alterações');
    console.log('   2. Push para o repositório');
    console.log('   3. O AWS Amplify fará o deploy automaticamente');
}

main();
