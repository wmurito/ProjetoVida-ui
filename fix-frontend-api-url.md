# 🔧 CORREÇÃO DO ERRO DE CORS - FRONTEND

## 📋 **PROBLEMA IDENTIFICADO**

O frontend está tentando acessar uma URL de API diferente da configurada:

- **Frontend usando**: `https://80alai4x6c.execute-api.us-east-1.amazonaws.com`
- **API configurada**: `https://pteq15e8a6.execute-api.us-east-1.amazonaws.com`
- **CORS configurado para**: `https://master.d1yi28nqqe44f2.amplifyapp.com`

## 🚀 **SOLUÇÕES**

### **SOLUÇÃO 1: Atualizar Variável de Ambiente no Amplify (RECOMENDADO)**

1. **Acesse o AWS Amplify Console**
2. **Vá para sua aplicação**: `master.d1yi28nqqe44f2.amplifyapp.com`
3. **Clique em "Environment variables"**
4. **Atualize a variável `VITE_API_URL`**:
   ```
   VITE_API_URL=https://pteq15e8a6.execute-api.us-east-1.amazonaws.com
   ```
5. **Salve e faça um novo deploy**

### **SOLUÇÃO 2: Verificar Configuração Atual**

Execute no terminal do frontend:
```bash
node check-api-url.js
```

### **SOLUÇÃO 3: Atualizar Arquivos de Configuração**

Se necessário, atualize os arquivos:

#### **src/config/api.js**
```javascript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://pteq15e8a6.execute-api.us-east-1.amazonaws.com',
  // ... resto da configuração
};
```

#### **src/services/api.js**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://pteq15e8a6.execute-api.us-east-1.amazonaws.com';
```

## 🔍 **VERIFICAÇÃO**

Após aplicar a correção, teste:

1. **Acesse sua aplicação no Amplify**
2. **Abra o DevTools (F12)**
3. **Vá para a aba Network**
4. **Recarregue a página**
5. **Verifique se as requisições estão indo para**: `https://pteq15e8a6.execute-api.us-east-1.amazonaws.com`

## 📝 **LOGS ESPERADOS**

### **Antes da correção:**
```
❌ GET https://80alai4x6c.execute-api.us-east-1.amazonaws.com/dashboard/estadiamento
❌ CORS error: Response to preflight request doesn't pass access control check
```

### **Após a correção:**
```
✅ GET https://pteq15e8a6.execute-api.us-east-1.amazonaws.com/dashboard/estadiamento
✅ Status: 200 OK
```

## 🆘 **SE O PROBLEMA PERSISTIR**

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Verifique se a API está online**: https://pteq15e8a6.execute-api.us-east-1.amazonaws.com/
3. **Teste CORS manualmente**:
   ```bash
   curl -X OPTIONS https://pteq15e8a6.execute-api.us-east-1.amazonaws.com/dashboard/estadiamento \
     -H "Origin: https://master.d1yi28nqqe44f2.amplifyapp.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: authorization,content-type" \
     -v
   ```

## 📞 **SUPORTE**

Se os problemas persistirem:
1. Verifique os logs do CloudWatch da API
2. Confirme que a variável `VITE_API_URL` está configurada corretamente no Amplify
3. Teste a API diretamente no navegador

---

**Status**: 🔴 CORS bloqueando requisições  
**Causa**: URL da API incorreta no frontend  
**Solução**: Atualizar `VITE_API_URL` no Amplify Console
