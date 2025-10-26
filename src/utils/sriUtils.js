/**
 * Utilitários para Subresource Integrity (SRI)
 * Gera e valida hashes de integridade para recursos externos
 */

// Lista de domínios permitidos para recursos externos
const ALLOWED_DOMAINS = [
  'fonts.googleapis.com',
  'cdn.amplify.aws',
  'cdn.jsdelivr.net'
];

// Configuração de fetch para recursos externos
const getFetchConfig = () => ({
  mode: import.meta.env.VITE_FETCH_MODE || 'cors',
  credentials: import.meta.env.VITE_FETCH_CREDENTIALS || 'omit',
  redirect: import.meta.env.VITE_FETCH_REDIRECT || 'error'
});

// Hashes SRI para recursos conhecidos (carregar de configuração segura)
export const SRI_HASHES = {};

// Função para obter hash SRI de um recurso
export const getSriHash = (url) => {
  return SRI_HASHES[url] || null;
};

// Função para criar elemento com SRI
export const createElementWithSri = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  // Adicionar SRI se disponível
  if (attributes.href || attributes.src) {
    const url = attributes.href || attributes.src;
    const sriHash = getSriHash(url);
    
    if (sriHash) {
      element.setAttribute('integrity', sriHash);
      element.setAttribute('crossorigin', 'anonymous');
    }
  }
  
  return element;
};

// Validar se URL é de domínio permitido
const isAllowedDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return ALLOWED_DOMAINS.some(domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
};

// Função para validar integridade de um recurso
export const validateResourceIntegrity = async (url, expectedHash) => {
  if (!url || typeof url !== 'string') {
    throw new Error('URL inválida');
  }
  
  const urlObj = new URL(url);
  if (urlObj.protocol !== 'https:') {
    throw new Error('Apenas HTTPS é permitido');
  }
  
  if (!isAllowedDomain(url)) {
    throw new Error('Domínio não permitido');
  }
  
  try {
    const response = await fetch(url, getFetchConfig());
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-384', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    const actualHash = `sha384-${hashBase64}`;
    
    return actualHash === expectedHash;
  } catch (error) {
    console.error('Erro ao validar integridade do recurso:', error);
    return false;
  }
};

// Função para gerar hash SRI de um recurso
export const generateSriHash = async (url, algorithm = 'SHA-384') => {
  if (!url || typeof url !== 'string') {
    throw new Error('URL inválida');
  }
  
  const urlObj = new URL(url);
  if (urlObj.protocol !== 'https:') {
    throw new Error('Apenas HTTPS é permitido');
  }
  
  if (!isAllowedDomain(url)) {
    throw new Error('Domínio não permitido');
  }
  
  const allowedAlgorithms = ['SHA-256', 'SHA-384', 'SHA-512'];
  if (!allowedAlgorithms.includes(algorithm)) {
    throw new Error('Algoritmo não permitido');
  }
  
  try {
    const response = await fetch(url, getFetchConfig());
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    
    return `${algorithm.toLowerCase()}-${hashBase64}`;
  } catch (error) {
    console.error('Erro ao gerar hash SRI:', error);
    return null;
  }
};

// Função para aplicar SRI a todos os recursos externos
export const applySriToExternalResources = () => {
  // Aplicar SRI a links de CSS
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href^="https"]');
  cssLinks.forEach(link => {
    const url = link.getAttribute('href');
    if (!url || !isAllowedDomain(url)) return;
    
    const sriHash = getSriHash(url);
    if (sriHash && !link.getAttribute('integrity')) {
      link.setAttribute('integrity', sriHash);
      link.setAttribute('crossorigin', 'anonymous');
    }
  });
  
  // Aplicar SRI a scripts externos
  const scripts = document.querySelectorAll('script[src^="https"]');
  scripts.forEach(script => {
    const url = script.getAttribute('src');
    if (!url || !isAllowedDomain(url)) return;
    
    const sriHash = getSriHash(url);
    if (sriHash && !script.getAttribute('integrity')) {
      script.setAttribute('integrity', sriHash);
      script.setAttribute('crossorigin', 'anonymous');
    }
  });
};

// Função para verificar se todos os recursos externos têm SRI
export const validateAllExternalResources = async () => {
  const externalResources = [
    ...document.querySelectorAll('link[rel="stylesheet"][href^="https"]'),
    ...document.querySelectorAll('script[src^="https"]')
  ];
  
  const results = [];
  
  for (const resource of externalResources) {
    const url = resource.getAttribute('href') || resource.getAttribute('src');
    
    if (!url || !isAllowedDomain(url)) continue;
    
    const integrity = resource.getAttribute('integrity');
    
    if (integrity) {
      try {
        const isValid = await validateResourceIntegrity(url, integrity);
        results.push({
          url,
          hasSri: true,
          isValid,
          element: resource
        });
      } catch (error) {
        results.push({
          url,
          hasSri: true,
          isValid: false,
          element: resource
        });
      }
    } else {
      results.push({
        url,
        hasSri: false,
        isValid: false,
        element: resource
      });
    }
  }
  
  return results;
};
