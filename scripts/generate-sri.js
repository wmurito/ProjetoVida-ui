#!/usr/bin/env node

/**
 * Script para gerar hash SRI (Subresource Integrity) correto
 * para recursos externos como Google Fonts
 */

const crypto = require('crypto');
const https = require('https');

// Função para baixar conteúdo de uma URL
function fetchContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Função para gerar hash SRI
function generateSRI(content, algorithm = 'sha384') {
  const hash = crypto.createHash(algorithm).update(content, 'utf8').digest('base64');
  return `${algorithm}-${hash}`;
}

// URLs para verificar
const urls = [
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
];

async function main() {
  console.log('🔍 Gerando hashes SRI para recursos externos...\n');
  
  for (const url of urls) {
    try {
      console.log(`📥 Baixando: ${url}`);
      const content = await fetchContent(url);
      
      // Gerar hashes para diferentes algoritmos
      const sha256 = generateSRI(content, 'sha256');
      const sha384 = generateSRI(content, 'sha384');
      const sha512 = generateSRI(content, 'sha512');
      
      console.log(`✅ SHA-256: ${sha256}`);
      console.log(`✅ SHA-384: ${sha384}`);
      console.log(`✅ SHA-512: ${sha512}`);
      console.log('');
      
      // Mostrar como usar no HTML
      console.log('📝 Para usar no HTML:');
      console.log(`<link href="${url}" rel="stylesheet" integrity="${sha384}" crossorigin="anonymous">`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${url}:`, error.message);
    }
  }
  
  console.log('🎉 Geração de hashes SRI concluída!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateSRI, fetchContent };

