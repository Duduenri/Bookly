# Bookly

Bookly é uma plataforma inovadora para amantes de livros, livrarias e sebos. Ela oferece um espaço para conectar leitores, facilitar transações de livros e promover a leitura.

## Funcionalidades

- **Perfis de Usuários**:
  - Criação de perfis com informações como nome, email, telefone, avatar e biografia.
  - Diferentes tipos de contas: Usuário, Livraria e Sebo.

- **Livrarias e Sebos**:
  - Cadastro de livrarias e sebos com informações detalhadas, incluindo localização, descrição e contatos.
  - Gerenciamento de listagens de livros.

- **Livros**:
  - Cadastro de livros com informações como título, autor, ISBN, editora, data de publicação, número de páginas e idioma.
  - Classificação de livros por categorias.

- **Listagens**:
  - Criação de listagens para venda, troca ou aluguel de livros.
  - Suporte para diferentes condições de livros (novo, usado, etc.).
  - Gerenciamento de status das listagens (ativo, vendido, alugado, etc.).

- **Localizações**:
  - Cadastro de locais associados a livrarias e sebos.
  - Informações detalhadas como endereço, cidade, estado, país e coordenadas geográficas.

- **Favoritos e Wishlist**:
  - Adicionar livros, listagens, livrarias e sebos aos favoritos.
  - Gerenciamento de uma lista de desejos personalizada.

- **Avaliações**:
  - Sistema de avaliações para livros, listagens, livrarias e sebos.
  - Classificação por estrelas e comentários.

- **Amizades e Conexões**:
  - Envio e recebimento de solicitações de amizade.
  - Gerenciamento de uma lista de amigos.

## Modelos do Banco de Dados

O banco de dados é estruturado com os seguintes modelos principais:

- **Profile**: Representa os usuários da plataforma.
- **Bookstore**: Representa livrarias.
- **SecondhandStore**: Representa sebos.
- **Book**: Representa livros.
- **Listing**: Representa listagens de livros.
- **Location**: Representa localizações de livrarias e sebos.
- **Category**: Representa categorias de livros.
- **Review**: Representa avaliações.
- **Favorite**: Representa itens favoritos.
- **WishlistItem**: Representa itens na lista de desejos.
- **FriendRequest**: Representa solicitações de amizade.
- **Friendship**: Representa conexões de amizade.

## Tecnologias Utilizadas

- **Backend**:
  - Prisma ORM para gerenciamento do banco de dados.
  - PostgreSQL como banco de dados.

- **Frontend**:
  - React Native para interface do usuário.
  - Chakra UI para componentes estilizados.

- **Outras Ferramentas**:
  - Supabase para autenticação e backend adicional.
  - Google Maps API para integração de mapas.

## Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/Duduenri/Bookly.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` baseado no `.env.example`.
   - Adicione as chaves necessárias, como `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_ACCESS_TOKEN`.

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.
