# 🚀 Sistema de Roteamento - Bookly

Este projeto implementa um sistema de roteamento público/privado com autenticação usando Expo Router.

## 📁 Estrutura de Pastas

```
app/
├── _layout.tsx              # Layout principal com AuthProvider
├── index.tsx                # Redireciona para login
├── (public)/                # Rotas públicas (sem autenticação)
│   ├── _layout.tsx         # Layout das páginas públicas
│   └── login.tsx           # Página de login
├── (private)/               # Rotas privadas (com autenticação)
│   ├── _layout.tsx         # Layout das páginas privadas
│   └── home.tsx            # Página home (área privada)
└── (tabs)/                 # Rotas antigas (podem ser removidas)
```

## 🔐 Sistema de Autenticação

### Contexto de Autenticação
- **Arquivo**: `src/contexts/AuthContext.tsx`
- **Funcionalidades**:
  - Gerenciar estado de usuário logado
  - Funções de login/logout
  - Estado de autenticação

### Rotas Protegidas
- **Públicas**: Acessíveis sem login
- **Privadas**: Requerem autenticação
- **Redirecionamento automático** baseado no estado de auth

## 🎯 Como Funciona

### 1. **Acesso Inicial**
- Usuário acessa `/` → redirecionado para `/(public)/login`

### 2. **Login**
- Usuário clica em "Bem Vindo" → simula login
- Redirecionado automaticamente para `/(private)/home`

### 3. **Área Privada**
- Usuário vê "Olá Mundo!" e informações do perfil
- Botão "Sair" para logout

### 4. **Logout**
- Usuário clica em "Sair" → redirecionado para login

## 🛠️ Tecnologias Utilizadas

- **Expo Router** - Sistema de roteamento
- **React Context** - Gerenciamento de estado
- **TypeScript** - Tipagem estática
- **React Native** - Interface mobile

## 🚀 Como Testar

1. **Iniciar o projeto**:
   ```bash
   npm start
   ```

2. **Navegar para login**:
   - Aplicação abre automaticamente na tela de login

3. **Fazer login**:
   - Clicar em "Bem Vindo"
   - Será redirecionado para a área privada

4. **Testar logout**:
   - Na área privada, clicar em "Sair"
   - Será redirecionado para o login

## 🔧 Personalização

### Adicionar Novas Rotas Públicas
```tsx
// app/(public)/nova-pagina.tsx
export default function NovaPagina() {
  return <View><Text>Nova Página Pública</Text></View>;
}
```

### Adicionar Novas Rotas Privadas
```tsx
// app/(private)/nova-pagina.tsx
export default function NovaPaginaPrivada() {
  return <View><Text>Nova Página Privada</Text></View>;
}
```

### Modificar Autenticação
- Editar `src/contexts/AuthContext.tsx`
- Implementar chamadas reais para API
- Adicionar validação de credenciais

## 📱 Telas Implementadas

### Login (`/(public)/login`)
- Título "Bookly"
- Subtítulo explicativo
- Botão "Bem Vindo" para login
- Design limpo e moderno

### Home (`/(private)/home`)
- Mensagem "Olá Mundo!"
- Informações do usuário logado
- Botão de logout
- Header personalizado

## 🔒 Segurança

- **Rotas privadas** são automaticamente protegidas
- **Redirecionamento automático** baseado no estado de auth
- **Contexto isolado** para dados de usuário
- **Navegação segura** entre áreas públicas e privadas

## 🎨 Estilização

- **Design responsivo** para diferentes tamanhos de tela
- **Cores consistentes** com o tema do projeto
- **Tipografia hierárquica** para melhor legibilidade
- **Espaçamento adequado** para boa experiência do usuário

## 🚧 Próximos Passos

1. **Implementar login real** com Supabase
2. **Adicionar validação** de formulários
3. **Criar mais páginas** da aplicação
4. **Implementar persistência** de sessão
5. **Adicionar animações** de transição
