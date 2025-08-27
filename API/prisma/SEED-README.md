# 🌱 Seeder da Base de Dados - Bookly

Este seeder cria dados de teste para a aplicação Bookly, incluindo usuários, livros, categorias e relacionamentos.

## 📋 Dados Criados

### 👥 Usuários de Teste
1. **João Silva** - Usuário comum
   - Email: `joao.silva@email.com`
   - Tipo: `USER`
   - Bio: Apaixonado por livros de ficção e tecnologia

2. **Maria Santos** - Livraria
   - Email: `maria.santos@livraria.com`
   - Tipo: `BOOKSTORE`
   - Bio: Proprietária da Livraria Santos há 15 anos

3. **Pedro Costa** - Sebo
   - Email: `pedro.costa@sebo.com`
   - Tipo: `SECONDHAND_STORE`
   - Bio: Proprietário do Sebo Costa

### 📚 Categorias
- Ficção
- Não-Ficção
- Tecnologia
- Biografia
- História

### 📖 Livros de Exemplo
- **O Senhor dos Anéis** - J.R.R. Tolkien
- **Clean Code** - Robert C. Martin
- **1984** - George Orwell

### 🏷️ Listagens de Exemplo
- João vende "O Senhor dos Anéis" por R$ 45,00
- Maria (livraria) vende "Clean Code" por R$ 89,90
- Pedro (sebo) troca "1984"

### ⭐ Reviews e Relacionamentos
- Reviews entre usuários
- Amizades entre João, Maria e Pedro
- Favoritos de listagens

## 🚀 Como Executar

### Pré-requisitos
1. Banco de dados configurado e migrado
2. Prisma Client gerado
3. Dependências instaladas

### Comandos Disponíveis

```bash
# Executar o seed (cria dados sem limpar existentes)
npm run seed

# Executar o seed com reset (limpa dados existentes)
npm run seed:reset
```

### Execução Manual

```bash
# Usando tsx diretamente
npx tsx prisma/seed.ts

# Usando ts-node (se instalado)
npx ts-node prisma/seed.ts
```

## ⚠️ Importante

- O seeder usa `upsert` para evitar duplicatas
- IDs de usuário são fictícios (`auth-user-1`, `auth-user-2`, `auth-user-3`)
- Para produção, substitua os IDs por IDs reais do Supabase Auth
- O seeder pode ser executado múltiplas vezes sem problemas

## 🔧 Personalização

Para adicionar mais dados de teste:

1. Edite o arquivo `seed.ts`
2. Adicione novos usuários, livros ou relacionamentos
3. Execute `npm run seed` novamente

## 📊 Estrutura dos Dados

```
profiles (usuários)
├── categories (categorias)
├── books (livros)
│   └── listings (anúncios)
│       ├── reviews (avaliações)
│       ├── favorites (favoritos)
│       └── listing_images (imagens)
├── friendships (amizades)
└── friend_requests (solicitações de amizade)
```

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Erro: "Database connection failed"
- Verifique o arquivo `.env`
- Confirme se o banco está rodando
- Teste a conexão com `npx prisma db pull`

### Erro: "Table doesn't exist"
- Execute as migrações primeiro: `npx prisma db push`
- Ou use: `npx prisma migrate dev`

## 📝 Logs

O seeder exibe logs detalhados durante a execução:

```
🌱 Iniciando seed da base de dados...
📚 Criando categorias...
✅ 5 categorias criadas
👥 Criando usuários de teste...
✅ 3 usuários criados
📖 Criando livros de exemplo...
✅ 3 livros criados
...
🎉 Seed concluído com sucesso!
```
