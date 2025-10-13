// Script para verificar qual URL da API está sendo usada
console.log('🔍 Verificando configuração da API...');

// Verificar variáveis de ambiente
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);

// Verificar configurações dos arquivos
import { API_CONFIG } from './src/config/api.js';
import { API_BASE_URL } from './src/constants/index.js';

console.log('API_CONFIG.BASE_URL:', API_CONFIG.BASE_URL);
console.log('API_BASE_URL:', API_BASE_URL);

// Verificar se há alguma configuração hardcoded
const hardcodedUrls = [
  'https://pteq15e8a6.execute-api.us-east-1.amazonaws.com'
];

console.log('🔍 URLs encontradas:');
hardcodedUrls.forEach(url => {
  console.log(`- ${url}`);
});

console.log('✅ Verificação concluída!');
