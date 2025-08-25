# 📚 Bookly - Documentação do Schema Prisma

## Visão Geral

O Bookly é um marketplace de livros que conecta usuários, livrarias e sebos. Esta documentação descreve a estrutura do banco de dados usando Prisma ORM.

## 🏗️ Estrutura do Banco de Dados

### Configuração

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 📊 Enums

### AccountType
Tipos de conta no sistema:
- `USER` - Usuário pessoa física
- `BOOKSTORE` - Livraria
- `SECONDHAND_STORE` - Sebo

### TransactionType
Tipos de transação para anúncios:
- `SALE` - Venda
- `EXCHANGE` - Troca
- `RENTAL` - Aluguel

### BookCondition
Condição do livro:
- `NEW` - Novo
- `LIKE_NEW` - Como novo
- `GOOD` - Bom
- `ACCEPTABLE` - Aceitável
- `POOR` - Ruim

### ListingStatus
Status do anúncio:
- `ACTIVE` - Ativo
- `SOLD` - Vendido
- `RENTED` - Alugado
- `INACTIVE` - Inativo

## 🗂️ Modelos

### User
Usuários pessoas físicas que podem anunciar livros.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  phone     String?
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos
  listings  Listing[]
  reviews   Review[]
  favorites Favorite[]
  wishlist  WishlistItem[]

  // Sistema de amigos
  sentFriendRequests     FriendRequest[] @relation("SentFriendRequests")
  receivedFriendRequests FriendRequest[] @relation("ReceivedFriendRequests")
  friends                Friendship[]    @relation("UserFriends")
  friendsOf              Friendship[]    @relation("FriendsOfUser")

  @@map("users")
}
```

**Campos:**
- `id` - Identificador único
- `email` - Email único do usuário
- `name` - Nome completo
- `phone` - Telefone (opcional)
- `avatar` - URL da foto de perfil (opcional)
- `bio` - Biografia/descrição (opcional)
- `createdAt` - Data de criação
- `updatedAt` - Data da última atualização

### Bookstore
Livrarias que podem anunciar livros.

```prisma
model Bookstore {
  id          String   @id @default(cuid())
  name        String
  description String?
  logo        String?
  phone       String?
  email       String?
  website     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  locations Location[]
  listings  Listing[]
  reviews   Review[]
  favorites Favorite[]

  @@map("bookstores")
}
```

**Campos:**
- `id` - Identificador único
- `name` - Nome da livraria
- `description` - Descrição da livraria (opcional)
- `logo` - URL do logo (opcional)
- `phone` - Telefone (opcional)
- `email` - Email (opcional)
- `website` - Site da livraria (opcional)

### SecondhandStore
Sebos que podem anunciar livros usados.

```prisma
model SecondhandStore {
  id          String   @id @default(cuid())
  name        String
  description String?
  logo        String?
  phone       String?
  email       String?
  website     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  locations Location[]
  listings  Listing[]
  reviews   Review[]
  favorites Favorite[]

  @@map("secondhand_stores")
}
```

**Campos:** (mesmos campos da Bookstore)

### Location
Localizações onde os livros podem ser retirados.

```prisma
model Location {
  id        String   @id @default(cuid())
  name      String // Nome do local (ex: "Loja Centro", "Ponto de encontro Shopping")
  address   String
  city      String
  state     String
  zipCode   String?
  country   String   @default("Brasil")
  latitude  Float?
  longitude Float?
  notes     String? // Instruções específicas para retirada
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos
  bookstoreId       String?
  bookstore         Bookstore?       @relation(fields: [bookstoreId], references: [id], onDelete: Cascade)
  secondhandStoreId String?
  secondhandStore   SecondhandStore? @relation(fields: [secondhandStoreId], references: [id], onDelete: Cascade)
  listings          Listing[]

  @@map("locations")
}
```

**Campos:**
- `id` - Identificador único
- `name` - Nome do local (ex: "Loja Centro", "Ponto de encontro Shopping")
- `address` - Endereço completo
- `city` - Cidade
- `state` - Estado
- `zipCode` - CEP (opcional)
- `country` - País (padrão: "Brasil")
- `latitude` - Latitude GPS (opcional)
- `longitude` - Longitude GPS (opcional)
- `notes` - Instruções específicas para retirada (opcional)

### Category
Categorias para organizar os livros.

```prisma
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relacionamentos
  books    Book[]
  listings Listing[]

  @@map("categories")
}
```

**Campos:**
- `id` - Identificador único
- `name` - Nome da categoria (único)
- `description` - Descrição da categoria (opcional)

### Book
Dados do livro em si (separado do anúncio para evitar duplicação).

```prisma
model Book {
  id          String    @id @default(cuid())
  title       String
  author      String
  description String?
  isbn        String?   @unique
  publisher   String?
  publishedAt DateTime?
  pages       Int?
  language    String?
  coverImage  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relacionamentos
  categoryId    String?
  category      Category?      @relation(fields: [categoryId], references: [id])
  listings      Listing[]
  reviews       Review[]
  favorites     Favorite[]
  wishlistItems WishlistItem[]

  @@map("books")
}
```

**Campos:**
- `id` - Identificador único
- `title` - Título do livro
- `author` - Autor do livro
- `description` - Sinopse/descrição (opcional)
- `isbn` - ISBN único (opcional)
- `publisher` - Editora (opcional)
- `publishedAt` - Data de publicação (opcional)
- `pages` - Número de páginas (opcional)
- `language` - Idioma (opcional)
- `coverImage` - URL da capa (opcional)

### Listing
Anúncios de livros para venda, troca ou aluguel.

```prisma
model Listing {
  id              String          @id @default(cuid())
  condition       BookCondition
  price           Float? // Para vendas
  rentalPrice     Float? // Para aluguel (por dia/semana)
  exchangeFor     String? // Para trocas (ex: "troco por livro de ficção")
  transactionType TransactionType
  status          ListingStatus   @default(ACTIVE)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  // Relacionamentos
  bookId     String
  book       Book      @relation(fields: [bookId], references: [id])
  categoryId String?
  category   Category? @relation(fields: [categoryId], references: [id])

  // Quem criou o anúncio
  userId            String?
  user              User?            @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookstoreId       String?
  bookstore         Bookstore?       @relation(fields: [bookstoreId], references: [id], onDelete: Cascade)
  secondhandStoreId String?
  secondhandStore   SecondhandStore? @relation(fields: [secondhandStoreId], references: [id], onDelete: Cascade)

  // Onde retirar
  locationId String
  location   Location @relation(fields: [locationId], references: [id])

  // Imagens do anúncio
  images ListingImage[]

  // Reviews e favoritos
  reviews       Review[]
  favorites     Favorite[]
  wishlistItems WishlistItem[]

  @@map("listings")
}
```

**Campos:**
- `id` - Identificador único
- `condition` - Condição do livro (enum BookCondition)
- `price` - Preço para venda (opcional)
- `rentalPrice` - Preço para aluguel (opcional)
- `exchangeFor` - Descrição do que aceita em troca (opcional)
- `transactionType` - Tipo de transação (enum TransactionType)
- `status` - Status do anúncio (enum ListingStatus, padrão: ACTIVE)

### ListingImage
Imagens dos anúncios de livros.

```prisma
model ListingImage {
  id        String   @id @default(cuid())
  url       String
  alt       String?
  order     Int      @default(0)
  createdAt DateTime @default(now())

  // Relacionamentos
  listingId String
  listing   Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@map("listing_images")
}
```

**Campos:**
- `id` - Identificador único
- `url` - URL da imagem
- `alt` - Texto alternativo (opcional)
- `order` - Ordem das imagens (padrão: 0)
- `createdAt` - Data de criação

### Review
Avaliações/Reviews de livros, anúncios, livrarias e sebos.

```prisma
model Review {
  id        String   @id @default(cuid())
  rating    Int // 1-5 estrelas
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Pode ser review de book, listing, bookstore ou secondhand store
  bookId            String?
  book              Book?            @relation(fields: [bookId], references: [id], onDelete: Cascade)
  listingId         String?
  listing           Listing?         @relation(fields: [listingId], references: [id], onDelete: Cascade)
  bookstoreId       String?
  bookstore         Bookstore?       @relation(fields: [bookstoreId], references: [id], onDelete: Cascade)
  secondhandStoreId String?
  secondhandStore   SecondhandStore? @relation(fields: [secondhandStoreId], references: [id], onDelete: Cascade)

  @@map("reviews")
}
```

**Campos:**
- `id` - Identificador único
- `rating` - Avaliação de 1 a 5 estrelas
- `comment` - Comentário da avaliação (opcional)
- `createdAt` - Data de criação
- `updatedAt` - Data da última atualização

### Favorite
Sistema de favoritos para livros, anúncios, livrarias e sebos.

```prisma
model Favorite {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  // Relacionamentos
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Pode favoritar book, listing, bookstore ou secondhand store
  bookId            String?
  book              Book?            @relation(fields: [bookId], references: [id], onDelete: Cascade)
  listingId         String?
  listing           Listing?         @relation(fields: [listingId], references: [id], onDelete: Cascade)
  bookstoreId       String?
  bookstore         Bookstore?       @relation(fields: [bookstoreId], references: [id], onDelete: Cascade)
  secondhandStoreId String?
  secondhandStore   SecondhandStore? @relation(fields: [secondhandStoreId], references: [id], onDelete: Cascade)

  @@unique([userId, bookId]) // Um usuário só pode favoritar um livro uma vez
  @@unique([userId, listingId]) // Um usuário só pode favoritar um listing uma vez
  @@unique([userId, bookstoreId]) // Um usuário só pode favoritar uma livraria uma vez
  @@unique([userId, secondhandStoreId]) // Um usuário só pode favoritar um sebo uma vez
  @@map("favorites")
}
```

**Constraints únicos:**
- Um usuário só pode favoritar um livro uma vez
- Um usuário só pode favoritar um anúncio uma vez
- Um usuário só pode favoritar uma livraria uma vez
- Um usuário só pode favoritar um sebo uma vez

### WishlistItem
Lista de desejos dos usuários.

```prisma
model WishlistItem {
  id        String   @id @default(cuid())
  notes     String? // Notas pessoais sobre o livro desejado
  createdAt DateTime @default(now())

  // Relacionamentos
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookId    String?
  book      Book?    @relation(fields: [bookId], references: [id], onDelete: Cascade)
  listingId String?
  listing   Listing? @relation(fields: [listingId], references: [id], onDelete: Cascade)

  // Se não for um book/listing específico, pode ser apenas um livro desejado
  title  String?
  author String?
  isbn   String?

  @@map("wishlist_items")
}
```

**Campos:**
- `id` - Identificador único
- `notes` - Notas pessoais sobre o livro desejado (opcional)
- `createdAt` - Data de criação
- `title` - Título do livro desejado (opcional, se não for um livro específico)
- `author` - Autor do livro desejado (opcional, se não for um livro específico)
- `isbn` - ISBN do livro desejado (opcional, se não for um livro específico)

### FriendRequest
Solicitações de amizade entre usuários.

```prisma
model FriendRequest {
  id        String   @id @default(cuid())
  status    String   @default("PENDING") // PENDING, ACCEPTED, REJECTED
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos
  senderId   String
  sender     User   @relation("SentFriendRequests", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String
  receiver   User   @relation("ReceivedFriendRequests", fields: [receiverId], references: [id], onDelete: Cascade)

  @@unique([senderId, receiverId]) // Não pode enviar múltiplas solicitações para a mesma pessoa
  @@map("friend_requests")
}
```

**Campos:**
- `id` - Identificador único
- `status` - Status da solicitação (PENDING, ACCEPTED, REJECTED)
- `createdAt` - Data de criação
- `updatedAt` - Data da última atualização
- `senderId` - ID do usuário que enviou a solicitação
- `receiverId` - ID do usuário que recebeu a solicitação

### Friendship
Amizades confirmadas entre usuários.

```prisma
model Friendship {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  // Relacionamentos
  userId   String
  user     User   @relation("UserFriends", fields: [userId], references: [id], onDelete: Cascade)
  friendId String
  friend   User   @relation("FriendsOfUser", fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId]) // Não pode ter amizade duplicada
  @@map("friendships")
}
```

**Campos:**
- `id` - Identificador único
- `createdAt` - Data de criação da amizade
- `userId` - ID do primeiro usuário
- `friendId` - ID do segundo usuário

## 🔗 Relacionamentos Principais

### Book ↔ Listing
- Um **Book** pode ter múltiplos **Listing** (diferentes anúncios do mesmo livro)
- Um **Listing** pertence a um **Book** específico

### User/Bookstore/SecondhandStore ↔ Listing
- Usuários, livrarias e sebos podem criar anúncios
- Um anúncio pertence a apenas um tipo de conta

### Location ↔ Listing
- Cada anúncio tem uma localização específica para retirada
- Uma localização pode ter múltiplos anúncios

### User ↔ Review/Favorite/WishlistItem
- Usuários podem fazer reviews, favoritar itens e ter lista de desejos
- Relacionamentos com cascade delete

## 🚀 Comandos Úteis

### Gerar cliente Prisma
```bash
npx prisma generate
```

### Fazer migração (desenvolvimento)
```bash
npx prisma db push
```

### Fazer migração (produção)
```bash
npx prisma migrate dev --name init
```

### Visualizar banco de dados
```bash
npx prisma studio
```

### Resetar banco de dados
```bash
npx prisma migrate reset
```

## 📝 Exemplos de Uso

### Buscar livro com anúncios
```typescript
const book = await prisma.book.findUnique({
  where: { isbn: "978-1234567890" },
  include: {
    listings: {
      include: {
        user: true,
        location: true,
        images: true
      }
    }
  }
});
```

### Buscar anúncios por localização
```typescript
const listings = await prisma.listing.findMany({
  where: {
    location: {
      city: "São Paulo"
    },
    status: "ACTIVE"
  },
  include: {
    book: true,
    location: true,
    user: true
  }
});
```

### Buscar favoritos de um usuário
```typescript
const favorites = await prisma.favorite.findMany({
  where: { userId: "user-id" },
  include: {
    book: true,
    listing: true,
    bookstore: true,
    secondhandStore: true
  }
});
```

## 🔒 Constraints e Validações

- **ISBN único**: Cada livro pode ter apenas um ISBN
- **Email único**: Cada usuário deve ter um email único
- **Favoritos únicos**: Usuários não podem favoritar o mesmo item múltiplas vezes
- **Amizades únicas**: Não pode ter amizade duplicada
- **Solicitações únicas**: Não pode enviar múltiplas solicitações para a mesma pessoa

## 📊 Índices Recomendados

- `Book.isbn` - Para busca rápida por ISBN
- `Listing.status` - Para filtrar anúncios ativos
- `Location.city` - Para busca por cidade
- `Review.rating` - Para ordenação por avaliação
- `Listing.createdAt` - Para ordenação por data de criação
