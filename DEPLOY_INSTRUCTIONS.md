# 🚀 Instruções de Deploy - ProjetoVida Frontend

## 📋 Pré-requisitos

- [ ] Conta AWS com acesso ao Amplify
- [ ] Repositório Git configurado
- [ ] Variáveis de ambiente preparadas
- [ ] Backend API em produção

## 🔧 Configuração no AWS Amplify Console

### 1. Criar Aplicação no Amplify

1. Acesse [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Clique em "New app" → "Host web app"
3. Selecione seu provedor Git (GitHub/GitLab/Bitbucket)
4. Autorize o acesso ao repositório
5. Selecione o repositório `ProjetoVida-ui`
6. Selecione a branch `main` (ou sua branch de produção)

### 2. Configurar Build Settings

O arquivo `amplify.yml` já está configurado. Verifique se está sendo detectado corretamente.

### 3. Configurar Variáveis de Ambiente

No Amplify Console, vá em **Environment variables** e adicione:

```
VITE_API_URL=https://seu-api-gateway.execute-api.us-east-1.amazonaws.com
VITE_AWS_REGION=us-east-1
VITE_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_AWS_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ IMPORTANTE**: Substitua pelos valores reais do seu ambiente AWS.

### 4. Configurar Domínio Customizado (Opcional)

1. No Amplify Console, vá em **Domain management**
2. Clique em "Add domain"
3. Siga as instruções para configurar DNS
4. Aguarde a emissão do certificado SSL (automático)

### 5. Configurar Redirects para SPA

Já configurado no `amplify.yml`, mas verifique se está ativo:

```yaml
- source: '</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf)$)([^.]+$)/>'
  target: '/index.html'
  status: '200'
```

## 🚀 Deploy

### Deploy Automático

Após configurar, o deploy acontece automaticamente a cada push na branch configurada.

### Deploy Manual

1. No Amplify Console, clique em "Redeploy this version"
2. Ou faça um push para a branch:

```bash
git add .
git commit -m "deploy: Production release"
git push origin main
```

## ✅ Verificação Pós-Deploy

### 1. Verificar Build

No Amplify Console, verifique se todas as fases passaram:
- ✅ Provision
- ✅ Build
- ✅ Deploy
- ✅ Verify

### 2. Testar Aplicação

Acesse a URL fornecida pelo Amplify e teste:

- [ ] Página inicial carrega
- [ ] Login funciona
- [ ] API está respondendo
- [ ] Não há erros no console do navegador
- [ ] HTTPS está ativo
- [ ] Headers de segurança estão presentes

### 3. Verificar Headers de Segurança

Use [Security Headers](https://securityheaders.com/) para verificar:

```bash
curl -I https://sua-url.amplifyapp.com
```

Deve retornar:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Content-Security-Policy`

### 4. Testar Funcionalidades Críticas

- [ ] Login/Logout
- [ ] Cadastro de paciente
- [ ] Visualização de dados
- [ ] Gráficos carregam
- [ ] Formulários funcionam

## 🔄 Rollback

Se algo der errado:

1. No Amplify Console, vá em **Deployments**
2. Encontre a versão anterior estável
3. Clique em "Redeploy this version"

Ou reverta o commit:

```bash
git revert HEAD
git push origin main
```

## 📊 Monitoramento

### CloudWatch Logs

Acesse logs no Amplify Console → **Monitoring** → **Logs**

### Métricas

Monitore no Amplify Console → **Monitoring**:
- Requests
- Data transfer
- Build duration
- Deploy status

## 🐛 Troubleshooting

### Build Falha

**Erro**: "Variáveis de ambiente obrigatórias não configuradas"
- **Solução**: Configure todas as variáveis no Amplify Console

**Erro**: "npm install failed"
- **Solução**: Verifique package.json e limpe cache do Amplify

### Aplicação Não Carrega

**Erro**: Página em branco
- **Solução**: Verifique console do navegador, pode ser erro de API

**Erro**: 404 em rotas
- **Solução**: Verifique configuração de redirects no amplify.yml

### API Não Responde

**Erro**: CORS error
- **Solução**: Configure CORS no API Gateway

**Erro**: 401 Unauthorized
- **Solução**: Verifique configuração do Cognito

## 🔐 Segurança

### Após Deploy

1. **Rotacione credenciais** se foram expostas anteriormente
2. **Configure WAF** no CloudFront (opcional)
3. **Ative logs** de acesso
4. **Configure alertas** no CloudWatch
5. **Execute scan de segurança**

### Manutenção

- Execute `npm audit` mensalmente
- Atualize dependências regularmente
- Monitore logs de erro
- Revise acessos ao Amplify Console

## 📞 Suporte

- **AWS Support**: https://console.aws.amazon.com/support/
- **Amplify Docs**: https://docs.amplify.aws/
- **Documentação do Projeto**: Ver README.md

## 📝 Checklist Final

Antes de considerar o deploy completo:

- [ ] Build passou sem erros
- [ ] Aplicação carrega corretamente
- [ ] Login funciona
- [ ] API responde
- [ ] HTTPS ativo
- [ ] Headers de segurança configurados
- [ ] Domínio customizado configurado (se aplicável)
- [ ] Monitoramento ativo
- [ ] Equipe notificada
- [ ] Documentação atualizada

---

**🎉 Deploy Completo!**

Sua aplicação está em produção. Monitore os logs e métricas nas primeiras horas.
