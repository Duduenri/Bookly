# 🚀 Configuração do Supabase para Bookly

## 📋 Pré-requisitos

- ✅ Conta no Supabase criada
- ✅ Projeto configurado
- ✅ Banco de dados PostgreSQL ativo
- ✅ Tabelas criadas via Prisma

## 🔧 Configuração dos Triggers e Políticas

### **1. Acesse o SQL Editor do Supabase**

1. Vá para o dashboard do seu projeto
2. Clique em **"SQL Editor"** no menu lateral
3. Clique em **"New Query"**

### **2. Execute o arquivo `supabase-triggers.sql`**

Copie e cole todo o conteúdo do arquivo `supabase-triggers.sql` no editor SQL e execute.

**⚠️ IMPORTANTE:** Execute o arquivo completo de uma vez, pois ele cria funções, triggers e políticas em sequência.

### **3. Verificação da Instalação**

Após executar, você deve ver:
- ✅ **13 funções** criadas
- ✅ **13 triggers** ativos
- ✅ **RLS habilitado** em todas as tabelas
- ✅ **Políticas de segurança** configuradas
- ✅ **Índices** criados para performance

## 🛡️ O que os Triggers Fazem

### **1. `validate_user_exists()`**
- ✅ Valida se o `userId` existe em `auth.users`
- ✅ Impede criação de perfis com usuários inexistentes
- ✅ Executa ANTES de INSERT/UPDATE em `profiles`

### **2. `validate_profile_email()`**
- ✅ Valida se o email do profile corresponde ao email do auth.users
- ✅ Impede inconsistências entre as tabelas
- ✅ Executa ANTES de INSERT/UPDATE em `profiles`

### **3. `cleanup_user_data()`**
- ✅ Limpa todos os dados relacionados quando um usuário é deletado
- ✅ Remove: perfil, anúncios, reviews, favoritos, lista de desejos, amizades
- ✅ Executa ANTES de DELETE em `auth.users`

## 🔐 Políticas RLS (Row Level Security)

### **Perfis (`profiles`)**
- 👁️ **Ver**: Todos podem ver todos os perfis
- ➕ **Criar**: Usuário só pode criar seu próprio perfil
- ✏️ **Editar**: Usuário só pode editar seu próprio perfil
- 🗑️ **Deletar**: Usuário só pode deletar seu próprio perfil

### **Anúncios (`listings`)**
- 👁️ **Ver**: Todos podem ver anúncios ativos + usuários veem seus próprios
- ➕ **Criar**: Usuário autenticado pode criar anúncios
- ✏️ **Editar**: Usuário só pode editar seus próprios anúncios
- 🗑️ **Deletar**: Usuário só pode deletar seus próprios anúncios

### **Reviews (`reviews`)**
- 👁️ **Ver**: Todos podem ver todas as reviews
- ➕ **Criar**: Usuário autenticado pode criar reviews
- ✏️ **Editar**: Usuário só pode editar suas próprias reviews
- 🗑️ **Deletar**: Usuário só pode deletar suas próprias reviews

### **Favoritos (`favorites`)**
- 👁️ **Ver**: Usuário só pode ver seus próprios favoritos
- ➕ **Criar**: Usuário autenticado pode criar favoritos
- 🗑️ **Deletar**: Usuário só pode deletar seus próprios favoritos

### **Lista de Desejos (`wishlist_items`)**
- 👁️ **Ver**: Usuário só pode ver sua própria lista
- ➕ **Criar**: Usuário autenticado pode criar itens
- ✏️ **Editar**: Usuário só pode editar seus próprios itens
- 🗑️ **Deletar**: Usuário só pode deletar seus próprios itens

### **Sistema de Amigos**
- **Friend Requests**: Usuários só veem solicitações relacionadas a eles
- **Friendships**: Usuários só veem suas amizades confirmadas

## 📊 Índices Criados

Para otimizar a performance, foram criados índices em:

- `profiles.userId` - Busca rápida por usuário
- `profiles.email` - Busca rápida por email
- `listings.status` - Filtro por status
- `listings.profileId` - Busca por criador do anúncio
- `listings.bookId` - Busca por livro
- `listings.locationId` - Busca por localização
- `books.isbn` - Busca rápida por ISBN
- `books.title, author` - Busca por título e autor
- `reviews.profileId` - Busca por autor da review
- `favorites.profileId` - Busca por usuário
- `wishlist_items.profileId` - Busca por usuário

## 🧪 Testando os Triggers

### **1. Teste de Validação de Usuário**
```sql
-- Isso deve falhar (usuário inexistente)
INSERT INTO public.profiles (id, userId, email, name)
VALUES ('test-1', 'user-inexistente', 'test@email.com', 'Test User');
```

### **2. Teste de Validação de Email**
```sql
-- Primeiro crie um usuário no auth
-- Depois tente criar profile com email diferente
-- Deve falhar
```

### **3. Teste de Cleanup**
```sql
-- Delete um usuário do auth.users
-- Verifique se todos os dados relacionados foram removidos
```

## 🔍 Monitoramento

### **Ver Triggers Ativos**
```sql
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

### **Ver Políticas RLS**
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### **Ver Funções Criadas**
```sql
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE 'validate_%' 
OR routine_name LIKE 'cleanup_%';
```

## 🚨 Troubleshooting

### **Erro: "function does not exist"**
- Verifique se executou o arquivo completo
- Execute novamente a seção de funções

### **Erro: "trigger does not exist"**
- Verifique se as funções foram criadas primeiro
- Execute novamente a seção de triggers

### **Erro: "policy already exists"**
- Normal, as políticas são criadas com `CREATE POLICY IF NOT EXISTS`
- Pode ignorar esses warnings

### **RLS não funcionando**
- Verifique se `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` foi executado
- Verifique se as políticas foram criadas corretamente

## 📚 Próximos Passos

Após configurar os triggers e políticas:

1. **Teste a autenticação** com usuários reais
2. **Implemente as APIs** usando Prisma Client
3. **Configure o frontend** para usar o Supabase Auth
4. **Monitore os logs** para identificar problemas
5. **Ajuste as políticas** conforme necessário

## 🔗 Links Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Triggers PostgreSQL](https://www.postgresql.org/docs/current/triggers.html)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
