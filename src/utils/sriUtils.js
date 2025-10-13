/**
 * Utilitários para Subresource Integrity (SRI)
 * Gera e valida hashes de integridade para recursos externos
 */

// Hashes SRI para recursos conhecidos
export const SRI_HASHES = {
  // Google Fonts - Roboto
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap': 
    'sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3',
  
  // AWS Amplify CDN (exemplo - deve ser atualizado conforme versão)
  'https://cdn.amplify.aws/aws-amplify/6.14.4/aws-amplify.min.js':
    'sha384-example-hash-here', // Substituir pelo hash real
  
  // Outros recursos comuns
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.min.js':
    'sha384-example-hash-here' // Substituir pelo hash real
};

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

// Função para validar integridade de um recurso
export const validateResourceIntegrity = async (url, expectedHash) => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });
    
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
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit'
    });
    
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
  const cssLinks = document.querySelectorAll('link[rel="stylesheet"][href^="http"]');
  cssLinks.forEach(link => {
    const url = link.getAttribute('href');
    const sriHash = getSriHash(url);
    
    if (sriHash && !link.getAttribute('integrity')) {
      link.setAttribute('integrity', sriHash);
      link.setAttribute('crossorigin', 'anonymous');
    }
  });
  
  // Aplicar SRI a scripts externos
  const scripts = document.querySelectorAll('script[src^="http"]');
  scripts.forEach(script => {
    const url = script.getAttribute('src');
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
    ...document.querySelectorAll('link[rel="stylesheet"][href^="http"]'),
    ...document.querySelectorAll('script[src^="http"]')
  ];
  
  const results = [];
  
  for (const resource of externalResources) {
    const url = resource.getAttribute('href') || resource.getAttribute('src');
    const integrity = resource.getAttribute('integrity');
    
    if (integrity) {
      const isValid = await validateResourceIntegrity(url, integrity);
      results.push({
        url,
        hasSri: true,
        isValid,
        element: resource
      });
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
