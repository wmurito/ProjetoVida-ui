/**
 * Utilitários para Content Security Policy (CSP)
 * Gera nonces seguros para scripts e styles inline
 */

// Gerador de nonce seguro
export const generateNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Configurar CSP com nonces
export const setupCSPWithNonces = () => {
  const nonce = generateNonce();
  
  // Armazenar nonce para uso posterior
  window.__CSP_NONCE__ = nonce;
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://cdn.amplify.aws;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://*.amazonaws.com;
    connect-src 'self' https://84i83ihklg.execute-api.us-east-1.amazonaws.com https://*.amazonaws.com wss://*.amazonaws.com;
    frame-ancestors 'none';
    form-action 'self';
    upgrade-insecure-requests;
    block-all-mixed-content;
  `;
  
  document.head.appendChild(meta);
  return nonce;
};

// Aplicar nonce a elementos inline
export const applyNonceToInlineScripts = () => {
  const nonce = window.__CSP_NONCE__;
  if (!nonce) return;
  
  // Aplicar nonce a scripts inline existentes
  const inlineScripts = document.querySelectorAll('script:not([src])');
  inlineScripts.forEach(script => {
    if (!script.nonce) {
      script.nonce = nonce;
    }
  });
  
  // Aplicar nonce a styles inline existentes
  const inlineStyles = document.querySelectorAll('style');
  inlineStyles.forEach(style => {
    if (!style.nonce) {
      style.nonce = nonce;
    }
  });
};

// Criar script com nonce
export const createScriptWithNonce = (code) => {
  const nonce = window.__CSP_NONCE__;
  const script = document.createElement('script');
  script.nonce = nonce;
  script.textContent = code;
  return script;
};

// Criar style com nonce
export const createStyleWithNonce = (css) => {
  const nonce = window.__CSP_NONCE__;
  const style = document.createElement('style');
  style.nonce = nonce;
  style.textContent = css;
  return style;
};
