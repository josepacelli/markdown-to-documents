# Git Hooks Automáticos - Markdown Studio

## 📋 Visão Geral

Git hooks pré-commit foram configurados para automatizar verificações de qualidade antes de cada commit. O sistema garante que todo código commitado passa por:

1. ✅ **ESLint** — Linting e correção automática
2. ✅ **Prettier** — Formatação de código
3. ✅ **Jest** — Testes unitários
4. ✅ **TypeScript** — Verificação de tipos e build

## 🚀 Instalação

### Primeira Vez Após Clone

```bash
# Instalar dependências
npm install

# Configurar hooks automáticos (necessário uma vez)
npm run setup-hooks
```

ou

```bash
npx husky install
chmod +x .husky/pre-commit
```

### O que Acontece Automaticamente

Após instalar, cada `git commit` triggerará o hook automaticamente.

## 🔄 Fluxo de Commit com Hook

### Exemplo 1: Commit Bem-Sucedido

```bash
$ git add arquivo.tsx
$ git commit -m "Adicionar validação de entrada"

🔍 Executando verificações pre-commit...

📝 Executando ESLint...
✅ ESLint passou

🎨 Formatando com Prettier...
✅ Prettier passou

🧪 Executando testes...
✅ Testes passaram

🔨 Verificando build...
✅ Build passou

✅ Todas as verificações passaram! Commit permitido.

[feature/validacao 3a4b5c6] Adicionar validação de entrada
 1 file changed, 15 insertions(+)
```

### Exemplo 2: Commit Falhando (ESLint)

```bash
$ git commit -m "Adicionar novo componente"

🔍 Executando verificações pre-commit...

📝 Executando ESLint...
❌ ESLint falhou

22:5  error  Unexpected var, use const or let  no-var
```

**O que fazer:**

1. Commit é **cancelado** (ainda em staging)
2. Corrigir os erros de linting
3. Fazer commit novamente

```bash
# ESLint tentará corrigir automaticamente
npm run lint:fix

# Ou corrigir manualmente
# Então fazer commit de novo
git commit -m "Adicionar novo componente"
```

### Exemplo 3: Commit Falhando (Testes)

```bash
$ git commit -m "Atualizar store"

🔍 Executando verificações pre-commit...

📝 Executando ESLint...
✅ ESLint passou

🎨 Formatando com Prettier...
✅ Prettier passou

🧪 Executando testes...
❌ Testes falharam

FAIL  __tests__/lib/store.test.ts
  ● useAppStore › deve adicionar uma nova aba
    Expected 1, received 2
```

**O que fazer:**

1. Commit é **cancelado**
2. Verificar falha de teste: `npm run test`
3. Corrigir código ou teste
4. Fazer commit novamente

## 📁 Arquivos de Configuração

### `.husky/pre-commit`

Hook principal que executa as verificações:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Executando verificações pre-commit..."

# 1. ESLint
npm run lint:fix
if [ $? -ne 0 ]; then
  echo "❌ ESLint falhou"
  exit 1
fi

# 2. Prettier
npm run format
if [ $? -ne 0 ]; then
  echo "❌ Prettier falhou"
  exit 1
fi

# 3. Testes
npm run test -- --passWithNoTests
if [ $? -ne 0 ]; then
  echo "❌ Testes falharam"
  exit 1
fi

# Nota: o passo de 'build' foi movido para o hook `pre-push` para evitar builds longos durante o pre-commit.
# Para garantir que o código ainda builda antes de ser enviado, usamos um hook `pre-push`.

### `.husky/pre-push`

Hook que executa o build antes de permitir o push:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Executando verificações pre-push..."
echo ""

# Rodar build antes do push para garantir que a aplicação builda corretamente
echo "🔨 Executando build (pre-push)..."
if ! npm run build; then
  echo "❌ Build falhou. Push cancelado. Execute 'npm run build' localmente para depurar."
  exit 1
fi

echo "✅ Build passou. Push permitido."
```
```

### `package.json` Scripts Relacionados

```json
{
  "scripts": {
    "lint": "eslint ... --max-warnings=0",
    "lint:fix": "eslint ... --fix",
    "format": "prettier --write ...",
    "format:check": "prettier --check ...",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "build": "next build",
    "setup-hooks": "bash ./scripts/setup-hooks.sh",
    "prepare": "husky install"
  }
}
```

## ⚙️ Customização

### Desabilitar Verificação Específica

Para remover uma verificação do hook, editar `.husky/pre-commit` e comentar a seção:

```bash
# ❌ Desativar testes (não recomendado!)
# npm run test -- --passWithNoTests

# ✅ Manter build checklist
npm run build
```

### Adicionar Nova Verificação

Exemplo: Adicionar verificação de segurança com `npm audit`:

```bash
# Verificar segurança
echo "🔒 Verificando vulnerabilidades..."
npm audit --audit-level=moderate

if [ $? -ne 0 ]; then
  echo "❌ Vulnerabilidades encontradas"
  exit 1
fi

echo "✅ Nenhuma vulnerabilidade"
```

### Hook Automático: post-merge (Git Pull)

Um hook `post-merge` foi configurado para executar automaticamente após `git pull`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔄 Git pull detectado..."

# Se package.json ou .husky foram modificados
if git diff --name-only HEAD@{1} HEAD | grep -q "package.json\|.husky"; then
  echo "📦 Atualizando hooks..."
  npm run setup-hooks
fi
```

**Quando é acionado:**

- Após cada `git pull`
- Se `package.json` ou `.husky` foram modificados

**Benefício:**

- Garante que hooks estão sempre sincronizados com o repositório
- Evita problemas de hooks desatualizados

**Exemplo:**

```bash
$ git pull origin main

🔄 Git pull detectado...
📦 package.json foi modificado
🔧 Executando setup de hooks...

✅ Hooks atualizados com sucesso!
```

### Criar Hook Adicional (commit-msg)

Para validar formato de mensagem de commit:

```bash
npx husky add .husky/commit-msg 'echo "Validando mensagem..."'
```

Editar `.husky/commit-msg` com validação customizada.

## ⏭️ Ignorar Hook (Emergência)

Se absolutamente necessário bypassar o hook:

```bash
git commit --no-verify -m "Mensagem urgente"
```

⚠️ **Aviso:** Isso ignora TODAS as verificações. Use apenas em emergências críticas. Será necessário rodar as verificações manualmente depois:

```bash
npm run lint:fix
npm run format
npm run test
npm run build
```

## 🐛 Troubleshooting

### "Permission denied: .husky/pre-commit"

```bash
chmod +x .husky/pre-commit
```

### "Husky install fails"

```bash
rm -rf node_modules package-lock.json
npm install
npm run setup-hooks
```

### "Hook não funciona após clone"

Após clonar o repositório:

```bash
npm install
npm run setup-hooks
```

O script `prepare` em `package.json` deveria executar automaticamente, mas você pode forçar:

```bash
npx husky install
```

### "Build está demorando muito no hook"

O build pode ser lento. Considere:

1. **Aumentar timeout:** Editar `.husky/pre-commit` para adicionar timeout
2. **Desabilitar build no hook:** Comentar verificação de build
3. **Rodá-lo localmente depois:** Usar `--no-verify` e rodar `npm run build` manualmente

### "Testes falhando e travando"

Se testes ficarem travados:

1. Rodar `npm run test` localmente para entender o problema
2. Usar `npm run test:watch` para debug
3. Se problema está no hook, usar `--no-verify` temporariamente

### "Formatação diferente entre hook e local"

Garantir que:

1. Prettier está instalado: `npm install`
2. `.prettierrc.cjs` está correto
3. Rodar `npm run format` localmente
4. Tentar commit novamente

## 📊 Performance

Tempos aproximados de execução do hook (máquina típica):

| Verificação | Tempo      |
| ----------- | ---------- |
| ESLint      | 2-5s       |
| Prettier    | 1-2s       |
| Testes      | 5-15s      |
| Build       | 10-30s     |
| **Total**   | **20-50s** |

Para acelerar:

- `npm run test -- --passWithNoTests` só roda testes que existem
- `npm run build` é mais rápido em máquinas rápidas
- Considerar desabilitar verificações menos críticas

## 🔗 Referências

- **Husky:** https://typicode.github.io/husky/
- **Git Hooks:** https://git-scm.com/docs/githooks
- **ESLint:** https://eslint.org
- **Prettier:** https://prettier.io
- **Jest:** https://jestjs.io

## ✅ Checklist de Setup

- [ ] `npm install` executado
- [ ] `npm run setup-hooks` executado
- [ ] `.husky/pre-commit` tem permissão de execução
- [ ] Tentar fazer commit test
- [ ] Hook foi executado automaticamente
- [ ] Nenhuma falsa positiva

## 💡 Dicas

1. **Local Development:** Use `npm run test:watch` enquanto desenvolve para pegar erros antes do commit
2. **Pre-test Commits:** Rodar `npm run test` localmente antes de fazer commit economiza tempo
3. **Large Files:** Se commit tem muitos arquivos, hook pode demorar — é normal
4. **Integration:** Considerar adicionar `commit-msg` hook no futuro para padronizar mensagens

---

Git hooks automáticos garantem qualidade de código consistente! 🎉
