# Configuração de Variáveis de Ambiente no AWS Amplify

## Problema Resolvido
O frontend estava com URLs hardcoded, causando erro `ERR_NAME_NOT_RESOLVED` porque não usava variáveis de ambiente do Amplify.

## Alterações Realizadas

### 1. Arquivos Modificados
- ✅ `src/services/api.js` - Agora usa `import.meta.env.VITE_API_URL`
- ✅ `src/config/api.js` - Agora usa `import.meta.env.VITE_API_URL`
- ✅ `vite.config.js` - Configurado para carregar variáveis de ambiente
- ✅ `amplify.yml` - Configurado para injetar variáveis no build

## Como Configurar no AWS Amplify Console

### Passo 1: Acessar o Console do Amplify
1. Acesse: https://console.aws.amazon.com/amplify/
2. Selecione seu app (ProjetoVida-ui)

### Passo 2: Configurar Variáveis de Ambiente
1. No menu lateral, clique em **"Environment variables"**
2. Clique em **"Manage variables"**
3. Adicione as seguintes variáveis:

```
VITE_API_URL = https://SEU-API-ID.execute-api.us-east-1.amazonaws.com
VITE_AWS_REGION = us-east-1
VITE_AWS_USER_POOL_ID = us-east-1_h48q7uFnQ
VITE_AWS_USER_POOL_CLIENT_ID = q902jjsdui59k28qk0g3s9o3v
```

### Passo 3: Obter a URL Correta da API
Execute no terminal da API:
```bash
cd ProjetoVida-api
serverless info
```

Procure por:
```
endpoints:
  ANY - https://XXXXXXXX.execute-api.us-east-1.amazonaws.com
```

Use essa URL completa na variável `VITE_API_URL`.

### Passo 4: Fazer Redeploy
1. No Amplify Console, vá em **"Deployments"**
2. Clique em **"Redeploy this version"** ou faça um novo commit

## Verificação

Após o deploy, abra o console do navegador (F12) e execute:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Deve mostrar a URL da sua API, não `undefined`.

## Troubleshooting

### Erro: "Network Error" ou "ERR_NAME_NOT_RESOLVED"
- ✅ Verifique se as variáveis estão configuradas no Amplify Console
- ✅ Verifique se fez redeploy após adicionar as variáveis
- ✅ Verifique se a URL da API está correta (sem barra no final)

### Erro: "401 Unauthorized"
- ✅ Verifique se `VITE_AWS_USER_POOL_ID` e `VITE_AWS_USER_POOL_CLIENT_ID` estão corretos
- ✅ Verifique se o usuário está autenticado no Cognito

### Variáveis não aparecem no build
- ✅ Certifique-se que as variáveis começam com `VITE_`
- ✅ Verifique se o `amplify.yml` está correto
- ✅ Limpe o cache do Amplify e faça rebuild

## Estrutura de Arquivos

```
ProjetoVida-ui/
├── .env                    # Desenvolvimento local
├── .env.production         # Gerado automaticamente no build
├── amplify.yml             # Configuração do Amplify
├── vite.config.js          # Configuração do Vite
└── src/
    ├── config/
    │   └── api.js          # Configuração da API
    └── services/
        └── api.js          # Cliente Axios
```

## Notas Importantes

1. **Nunca commite** arquivos `.env` com credenciais reais
2. As variáveis devem começar com `VITE_` para serem expostas no frontend
3. Após alterar variáveis no Amplify, sempre faça redeploy
4. O arquivo `.env.production` é gerado automaticamente durante o build
