# 🔧 Sistema de Configuração de Ambientes - ProjetoVida Frontend

Este documento explica como usar o sistema de configuração de ambientes para alternar facilmente entre desenvolvimento local e produção.

## 📋 Visão Geral

O sistema permite alternar entre dois ambientes:
- **Development**: API local, debug ativado, DevTools habilitados
- **Production**: API de produção, otimizado, logs mínimos

## 🚀 Como Usar

### 1. Configuração Inicial

1. **Copie os arquivos de exemplo:**
   ```bash
   # Para desenvolvimento
   cp env.development.example .env
   
   # Para produção
   cp env.production.example .env
   ```

2. **Configure suas URLs** no arquivo `.env`:
   - URL da API (local ou produção)
   - Configurações do AWS Amplify
   - Configurações de debug

### 2. Alternando Entre Ambientes

#### Usando NPM Scripts
```bash
# Alterar para desenvolvimento
npm run env:dev

# Alterar para produção
npm run env:prod

# Ver ambiente atual
npm run env:status
```

#### Usando o Script Node
```bash
# Alterar para desenvolvimento
node scripts/switch_env.js development

# Alterar para produção
node scripts/switch_env.js production

# Ver ambiente atual
node scripts/switch_env.js status
```

#### Usando o Script de Inicialização
```bash
# Iniciar em modo desenvolvimento (configura automaticamente)
npm run dev:setup
```

### 3. Executando o Frontend

```bash
# Desenvolvimento
npm run dev

# Ou usando o script de inicialização
npm run dev:setup

# Build para produção
npm run build:prod
```

## 📁 Estrutura de Arquivos

```
ProjetoVida-ui/
├── src/
│   └── config/
│       ├── api.js           # Configuração da API
│       └── environments.js  # Sistema de configuração
├── scripts/
│   └── switch_env.js        # Script para alternar ambientes
├── env.development.example  # Configurações de desenvolvimento
├── env.production.example   # Configurações de produção
├── .env                     # Configurações atuais (gerado automaticamente)
├── start_dev.js            # Script de inicialização
└── package.json            # Scripts NPM
```

## ⚙️ Configurações por Ambiente

### Development
- **API**: `http://localhost:8000`
- **Debug**: Ativado
- **Logs**: Detalhados
- **DevTools**: Habilitados
- **Cache**: Desabilitado
- **Hot Reload**: Ativado

### Production
- **API**: `https://84i83ihklg.execute-api.us-east-1.amazonaws.com`
- **Debug**: Desativado
- **Logs**: Mínimos
- **DevTools**: Desabilitados
- **Cache**: 5 minutos
- **Otimizações**: Ativadas

## 🔐 Variáveis de Ambiente

### API
```env
VITE_API_URL=http://localhost:8000
```

### AWS Amplify
```env
VITE_AWS_REGION=us-east-1
VITE_USER_POOL_ID=us-east-1_xxxxxxxxx
VITE_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Debug
```env
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

## 🛠️ Desenvolvimento

### Configurando API Local

1. **Inicie o backend local:**
   ```bash
   cd ../ProjetoVida-api
   python start_dev.py
   ```

2. **Configure o frontend:**
   ```bash
   npm run env:dev
   # Edite .env se necessário
   npm run dev
   ```

### Testando Configurações

```bash
# Verificar configurações atuais
npm run env:status

# Testar conexão com API
curl http://localhost:8000/health
```

## 🚀 Produção

### Build para Produção

```bash
# Alterar para produção
npm run env:prod

# Build otimizado
npm run build:prod

# Preview do build
npm run preview
```

### Deploy no AWS Amplify

1. **Configure as variáveis de ambiente no Amplify:**
   ```env
   VITE_ENVIRONMENT=production
   VITE_API_URL=https://84i83ihklg.execute-api.us-east-1.amazonaws.com
   VITE_AWS_REGION=us-east-1
   VITE_USER_POOL_ID=us-east-1_xxxxxxxxx
   VITE_USER_POOL_WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Deploy automático:**
   - Push para branch `main`
   - Amplify faz build e deploy automaticamente

## 🔍 Troubleshooting

### Problemas Comuns

1. **API não conecta:**
   - Verifique se o backend está rodando
   - Confirme URL no `.env`
   - Teste com `curl`

2. **Ambiente não altera:**
   - Verifique se o arquivo `.env` foi criado
   - Confirme permissões de escrita
   - Reinicie o servidor de desenvolvimento

3. **Build falha:**
   - Verifique variáveis de ambiente
   - Confirme se todas as dependências estão instaladas
   - Limpe cache: `rm -rf node_modules/.vite`

### Logs de Debug

```bash
# Ativar logs detalhados
VITE_LOG_LEVEL=debug npm run dev

# Ver configurações carregadas
npm run dev
# Verifique o console do navegador
```

## 📚 Comandos Úteis

```bash
# Ver ambiente atual
npm run env:status

# Backup do .env atual
cp .env .env.backup

# Restaurar backup
cp .env.backup .env

# Limpar cache
rm -rf node_modules/.vite
npm run dev

# Verificar configurações no código
# Abra src/config/environments.js
```

## 🔄 Fluxo de Trabalho

1. **Desenvolvimento:**
   ```bash
   npm run env:dev
   # Configure URL da API local
   npm run dev:setup
   ```

2. **Teste em Produção:**
   ```bash
   npm run env:prod
   # Configure URL da API de produção
   npm run build:prod
   npm run preview
   ```

3. **Deploy:**
   ```bash
   npm run env:prod
   git add .
   git commit -m "Deploy para produção"
   git push origin main
   ```

## 🎯 Scripts NPM Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run dev:setup` | Configura ambiente e inicia servidor |
| `npm run build` | Build para produção |
| `npm run build:prod` | Configura produção e faz build |
| `npm run env:dev` | Altera para ambiente de desenvolvimento |
| `npm run env:prod` | Altera para ambiente de produção |
| `npm run env:status` | Mostra ambiente atual |
| `npm run preview` | Preview do build de produção |

## 🔧 Configuração Avançada

### Personalizando Ambientes

Edite `src/config/environments.js` para adicionar novos ambientes ou modificar configurações:

```javascript
const environments = {
  development: {
    API_BASE_URL: 'http://localhost:8000',
    // ... outras configurações
  },
  production: {
    API_BASE_URL: 'https://sua-api.com',
    // ... outras configurações
  },
  staging: {  // Novo ambiente
    API_BASE_URL: 'https://staging-api.com',
    // ... configurações de staging
  }
};
```

### Usando Variáveis de Ambiente

O sistema prioriza variáveis de ambiente sobre configurações hardcoded:

```env
# .env
VITE_API_URL=http://localhost:3000  # Sobrescreve configuração padrão
VITE_DEBUG=false                    # Desativa debug mesmo em desenvolvimento
```

---

💡 **Dica**: Use `npm run dev:setup` para desenvolvimento - ele configura automaticamente o ambiente e inicia o servidor com hot-reload.
