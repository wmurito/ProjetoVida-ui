# 🔗 Configuração da API - ProjetoVida Frontend

## ✅ **ATUALIZAÇÃO CONCLUÍDA**

A URL da API foi atualizada com sucesso de:
- **Antiga**: `https://84i83ihklg.execute-api.us-east-1.amazonaws.com`
- **Nova**: `https://pteq15e8a6.execute-api.us-east-1.amazonaws.com`

## 📁 **Arquivos Atualizados**

Os seguintes arquivos foram atualizados com a nova URL:

1. ✅ `src/config/api.js` - Configuração principal da API
2. ✅ `src/services/api.js` - Serviço principal da API
3. ✅ `src/constants/index.js` - Constantes da aplicação
4. ✅ `src/utils/cspUtils.js` - Content Security Policy
5. ✅ `src/services/securityConfig.js` - Configurações de segurança
6. ✅ `src/config/security.prod.js` - Configurações de produção
7. ✅ `test_cors_simple.py` - Script de teste CORS
8. ✅ `check-api-url.js` - Script de verificação

## 🧪 **Teste da Nova API**

A nova API foi testada e está funcionando corretamente:
- ✅ **Status**: Online
- ✅ **Resposta**: `{"status":"online"}`
- ✅ **Headers de Segurança**: Configurados corretamente

## 🔧 **Configuração de Variáveis de Ambiente**

### **Para Desenvolvimento Local**

Crie um arquivo `.env` na raiz do projeto com:

```env
# URL da API (NOVA)
VITE_API_URL=https://pteq15e8a6.execute-api.us-east-1.amazonaws.com
VITE_API_BASE_URL=https://pteq15e8a6.execute-api.us-east-1.amazonaws.com

# AWS Cognito
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_h48q7uFnQ
VITE_AWS_USER_POOL_CLIENT_ID=q902jjsdui59k28qk0g3s9o3v

# Segurança
VITE_SECURE_COOKIES=true
VITE_ENABLE_CSP=true
VITE_ENABLE_SRI=true
VITE_LOG_LEVEL=error
VITE_ENABLE_DEBUG=false
```

### **Para Produção (AWS Amplify)**

Configure as seguintes variáveis de ambiente no Amplify:

```
VITE_API_URL=https://pteq15e8a6.execute-api.us-east-1.amazonaws.com
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_h48q7uFnQ
VITE_AWS_USER_POOL_CLIENT_ID=q902jjsdui59k28qk0g3s9o3v
VITE_SECURE_COOKIES=true
VITE_ENABLE_CSP=true
VITE_ENABLE_SRI=true
VITE_LOG_LEVEL=error
VITE_ENABLE_DEBUG=false
```

## 🚀 **Próximos Passos**

1. **Commit das mudanças**:
   ```bash
   git add .
   git commit -m "feat: Update API URL to new endpoint"
   git push
   ```

2. **Deploy no Amplify**:
   - As variáveis de ambiente serão aplicadas automaticamente
   - O build usará a nova URL da API

3. **Teste em produção**:
   - Verifique se todas as funcionalidades estão funcionando
   - Monitore os logs para possíveis erros

## 🔍 **Verificação**

Para verificar se a configuração está correta:

1. **Verificar variáveis de ambiente**:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```

2. **Testar conexão**:
   ```bash
   curl https://pteq15e8a6.execute-api.us-east-1.amazonaws.com/
   ```

3. **Verificar CSP**:
   - Abra o DevTools
   - Verifique se não há erros de CSP no console

## ⚠️ **Importante**

- ✅ A nova API está funcionando corretamente
- ✅ Todos os arquivos foram atualizados
- ✅ As configurações de segurança foram mantidas
- ✅ O CSP foi atualizado com a nova URL

## 🆘 **Suporte**

Se encontrar algum problema:

1. Verifique se as variáveis de ambiente estão configuradas
2. Confirme se a nova API está acessível
3. Verifique os logs do navegador para erros de CORS
4. Teste a conectividade com a nova URL

---

**Data da Atualização**: 2025-01-27  
**Status**: ✅ Concluído com Sucesso

