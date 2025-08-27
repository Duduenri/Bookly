import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed da base de dados...');

  // Limpar dados existentes (opcional - descomente se quiser resetar)
  // await prisma.friendship.deleteMany();
  // await prisma.friendRequest.deleteMany();
  // await prisma.wishlistItem.deleteMany();
  // await prisma.favorite.deleteMany();
  // await prisma.review.deleteMany();
  // await prisma.listingImage.deleteMany();
  // await prisma.listing.deleteMany();
  // await prisma.book.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.profile.deleteMany();

  // Criar categorias de livros
  console.log('📚 Criando categorias...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Ficção' },
      update: {},
      create: { name: 'Ficção', description: 'Livros de ficção e literatura' }
    }),
    prisma.category.upsert({
      where: { name: 'Não-Ficção' },
      update: {},
      create: { name: 'Não-Ficção', description: 'Livros informativos e educativos' }
    }),
    prisma.category.upsert({
      where: { name: 'Tecnologia' },
      update: {},
      create: { name: 'Tecnologia', description: 'Livros sobre tecnologia e programação' }
    }),
    prisma.category.upsert({
      where: { name: 'Biografia' },
      update: {},
      create: { name: 'Biografia', description: 'Biografias e memórias' }
    }),
    prisma.category.upsert({
      where: { name: 'História' },
      update: {},
      create: { name: 'História', description: 'Livros de história e geografia' }
    })
  ]);

  console.log(`✅ ${categories.length} categorias criadas`);

  // Criar usuários de teste
  console.log('👥 Criando usuários de teste...');

  // Usuário 1: João Silva (Usuário comum)
  const joao = await prisma.profile.upsert({
    where: { email: 'joao.silva@email.com' },
    update: {},
    create: {
      userId: 'auth-user-1', // ID fictício do Supabase auth
      email: 'joao.silva@email.com',
      name: 'João Silva',
      phone: '(11) 99999-1111',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Apaixonado por livros de ficção e tecnologia. Sempre em busca de novas histórias para ler.',
      accountType: 'USER'
    }
  });

  // Usuário 2: Maria Santos (Livraria)
  const maria = await prisma.profile.upsert({
    where: { email: 'maria.santos@livraria.com' },
    update: {},
    create: {
      userId: 'auth-user-2', // ID fictício do Supabase auth
      email: 'maria.santos@livraria.com',
      name: 'Maria Santos',
      phone: '(11) 88888-2222',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Proprietária da Livraria Santos há 15 anos. Especializada em livros técnicos e acadêmicos.',
      accountType: 'BOOKSTORE'
    }
  });

  // Usuário 3: Pedro Costa (Sebo)
  const pedro = await prisma.profile.upsert({
    where: { email: 'pedro.costa@sebo.com' },
    update: {},
    create: {
      userId: 'auth-user-3', // ID fictício do Supabase auth
      email: 'pedro.costa@sebo.com',
      name: 'Pedro Costa',
      phone: '(11) 77777-3333',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      bio: 'Proprietário do Sebo Costa. Especializado em livros raros, usados e edições antigas.',
      accountType: 'SECONDHAND_STORE'
    }
  });

  console.log(`✅ ${3} usuários criados`);

  // Criar alguns livros de exemplo
  console.log('📖 Criando livros de exemplo...');

  const books = await Promise.all([
    prisma.book.upsert({
      where: { isbn: '9788535902775' },
      update: {},
      create: {
        title: 'O Senhor dos Anéis',
        author: 'J.R.R. Tolkien',
        isbn: '9788535902775',
        publisher: 'Martins Fontes',
        publishedAt: new Date('2000-01-01'),
        pages: 1216,
        language: 'Português',
        description: 'Uma das maiores obras de fantasia da literatura mundial.',
        categoryId: categories.find(c => c.name === 'Ficção')?.id || categories[0].id
      }
    }),
    prisma.book.upsert({
      where: { isbn: '9788573025639' },
      update: {},
      create: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '9788573025639',
        publisher: 'Alta Books',
        publishedAt: new Date('2009-01-01'),
        pages: 425,
        language: 'Português',
        description: 'Um guia para escrever código limpo e legível.',
        categoryId: categories.find(c => c.name === 'Tecnologia')?.id || categories[0].id
      }
    }),
    prisma.book.upsert({
      where: { isbn: '9788535909552' },
      update: {},
      create: {
        title: '1984',
        author: 'George Orwell',
        isbn: '9788535909552',
        publisher: 'Companhia das Letras',
        publishedAt: new Date('2009-01-01'),
        pages: 416,
        language: 'Português',
        description: 'Um clássico da literatura distópica.',
        categoryId: categories.find(c => c.name === 'Ficção')?.id || categories[0].id
      }
    })
  ]);

  console.log(`✅ ${books.length} livros criados`);

  // Criar algumas localizações de exemplo
  console.log('📍 Criando localizações de exemplo...');

  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Metrô Trianon-Masp',
        address: 'Av. Paulista, 900 - Bela Vista, São Paulo - SP',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        latitude: -23.5631,
        longitude: -46.6544,
        notes: 'Ponto de encontro no metrô, próximo ao MASP'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Livraria Santos',
        address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01001-000',
        latitude: -23.5505,
        longitude: -46.6333,
        notes: 'Livraria no centro da cidade'
      }
    }),
    prisma.location.create({
      data: {
        name: 'Sebo Costa',
        address: 'Rua Harmonia, 456 - Vila Madalena, São Paulo - SP',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '05435-000',
        latitude: -23.5671,
        longitude: -46.6919,
        notes: 'Sebo especializado em livros raros'
      }
    })
  ]);

  console.log(`✅ ${locations.length} localizações criadas`);

  // Criar algumas listagens de exemplo
  console.log('🏷️ Criando listagens de exemplo...');

  const listings = await Promise.all([
    // João vende um livro
    prisma.listing.create({
      data: {
        condition: 'LIKE_NEW',
        price: 45.00,
        transactionType: 'SALE',
        status: 'ACTIVE',
        profileId: joao.id,
        bookId: books.find(b => b.title.includes('Senhor dos Anéis'))?.id || books[0].id,
        locationId: locations[0].id
      }
    }),

    // Maria (livraria) vende um livro técnico
    prisma.listing.create({
      data: {
        condition: 'NEW',
        price: 89.90,
        transactionType: 'SALE',
        status: 'ACTIVE',
        profileId: maria.id,
        bookId: books.find(b => b.title.includes('Clean Code'))?.id || books[0].id,
        locationId: locations[1].id
      }
    }),

    // Pedro (sebo) troca um livro
    prisma.listing.create({
      data: {
        condition: 'GOOD',
        price: 0.00,
        transactionType: 'EXCHANGE',
        status: 'ACTIVE',
        profileId: pedro.id,
        bookId: books.find(b => b.title.includes('1984'))?.id || books[0].id,
        locationId: locations[2].id
      }
    })
  ]);

  console.log(`✅ ${listings.length} listagens criadas`);

  // Criar algumas reviews de exemplo
  console.log('⭐ Criando reviews de exemplo...');

  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excelente atendimento! O livro chegou em perfeito estado.',
        profileId: joao.id,
        listingId: listings[1].id // Review da livraria da Maria
      }
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Sebo muito organizado, encontrei livros raros que procurava há tempo.',
        profileId: maria.id,
        listingId: listings[2].id // Review do sebo do Pedro
      }
    })
  ]);

  console.log(`✅ ${reviews.length} reviews criadas`);

  // Criar algumas amizades de exemplo
  console.log('🤝 Criando amizades de exemplo...');

  const friendships = await Promise.all([
    // João e Maria são amigos
    prisma.friendship.create({
      data: {
        profileId: joao.id,
        friendId: maria.id
      }
    }),
    // João e Pedro são amigos
    prisma.friendship.create({
      data: {
        profileId: joao.id,
        friendId: pedro.id
      }
    })
  ]);

  console.log(`✅ ${friendships.length} amizades criadas`);

  // Criar alguns favoritos de exemplo
  console.log('❤️ Criando favoritos de exemplo...');

  const favorites = await Promise.all([
    prisma.favorite.create({
      data: {
        profileId: joao.id,
        listingId: listings[1].id // João favorita o livro da livraria
      }
    }),
    prisma.favorite.create({
      data: {
        profileId: maria.id,
        listingId: listings[2].id // Maria favorita o livro do sebo
      }
    })
  ]);

  console.log(`✅ ${favorites.length} favoritos criados`);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📊 Resumo dos dados criados:');
  console.log(`   • ${categories.length} categorias`);
  console.log(`   • ${3} usuários de teste`);
  console.log(`   • ${books.length} livros`);
  console.log(`   • ${listings.length} listagens`);
  console.log(`   • ${reviews.length} reviews`);
  console.log(`   • ${friendships.length} amizades`);
  console.log(`   • ${favorites.length} favoritos`);
  
  console.log('\n👥 Usuários de teste criados:');
  console.log(`   • João Silva (${joao.email}) - Usuário comum`);
  console.log(`   • Maria Santos (${maria.email}) - Livraria`);
  console.log(`   • Pedro Costa (${pedro.email}) - Sebo`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
