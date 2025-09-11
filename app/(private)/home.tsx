import { Book } from '@/components/Genericos/BookList';
import HomeTemplate from '@/components/Genericos/HomeTemplate';
import { useAuth } from '@/src/contexts/AuthContext';
import { useApi } from '@/src/services/api';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getBooks, addToFavorites, addToWishlist } = useApi();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock de sebos/livrarias com lat/long (substitua por dados reais depois)
  const stores = [
    {
      id: 's1',
      name: 'Sebo Paulista',
      latitude: -23.556580,
      longitude: -46.662113,
      address: 'Av. Paulista, São Paulo - SP',
    },
    {
      id: 's2',
      name: 'Livraria Cultura (Conjunto Nacional)',
      latitude: -23.561684,
      longitude: -46.655981,
      address: 'Av. Paulista, 2073 - Bela Vista, São Paulo - SP',
    },
    {
      id: 's3',
      name: 'Blooks Livraria',
      latitude: -22.972706,
      longitude: -43.182365,
      address: 'Botafogo, Rio de Janeiro - RJ',
    },
  ];

  // Buscar livros do Supabase
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Buscando livros do Supabase...');
        const booksData = await getBooks();
        
        console.log(`✅ ${booksData.length} livros encontrados`);
        setBooks(booksData);
        
      } catch (err) {
        console.error('❌ Erro ao buscar livros:', err);
        setError('Erro ao carregar os livros. Tente novamente.');
        
        // Fallback: usar dados de exemplo se a API falhar
        const fallbackBooks: Book[] = [
          {
            id: '1',
            title: 'O Senhor dos Anéis',
            author: 'J.R.R. Tolkien',
            description: 'Uma épica jornada pela Terra-média, onde um hobbit deve destruir um anel poderoso.',
            coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop',
            price: 45.90,
            condition: 'GOOD',
            transactionType: 'SALE',
            location: 'São Paulo, SP',
            sellerName: 'João Silva',
            sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
          },
          {
            id: '2',
            title: '1984',
            author: 'George Orwell',
            description: 'Uma distopia que retrata uma sociedade totalitária e vigilante.',
            coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop',
            price: 32.50,
            condition: 'LIKE_NEW',
            transactionType: 'EXCHANGE',
            location: 'Rio de Janeiro, RJ',
            sellerName: 'Maria Santos',
            sellerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
          }
        ];
        setBooks(fallbackBooks);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // Removida a dependência getBooks para evitar loop infinito

  const handleBookPress = useCallback((book: Book) => {
    Alert.alert(
      'Livro Selecionado',
      `Título: ${book.title}\nAutor: ${book.author}\nPreço: R$ ${book.price?.toFixed(2) || 'Não informado'}\nLocalização: ${book.location}`,
      [{ text: 'OK' }]
    );
  }, []);

  const handleFavoritePress = useCallback(async (book: Book) => {
    try {
      if (!user?.id) {
        Alert.alert('Erro', 'Você precisa estar logado para adicionar favoritos.');
        return;
      }

      await addToFavorites(book.id, user.id);
      Alert.alert('Favorito', `"${book.title}" adicionado aos favoritos! ❤️`);
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      Alert.alert('Erro', 'Não foi possível adicionar aos favoritos. Tente novamente.');
    }
  }, [user?.id, addToFavorites]);

  const handleWishlistPress = useCallback(async (book: Book) => {
    try {
      if (!user?.id) {
        Alert.alert('Erro', 'Você precisa estar logado para adicionar à lista de desejos.');
        return;
      }

      await addToWishlist(book.id, user.id);
      Alert.alert('Lista de Desejos', `"${book.title}" adicionado à lista de desejos! 📝`);
    } catch (error) {
      console.error('Erro ao adicionar à wishlist:', error);
      Alert.alert('Erro', 'Não foi possível adicionar à lista de desejos. Tente novamente.');
    }
  }, [user?.id, addToWishlist]);

  const handleAvatarPress = useCallback(() => {
    router.push('/(private)/profile');
  }, [router]);

  const handleTitlePress = useCallback(() => {
    router.push('/(private)/home');
  }, [router]);

  // Mostrar loading ou erro
  if (loading) {
    return (
      <HomeTemplate
        books={[]}
        stores={stores}
        onBookPress={handleBookPress}
        onFavoritePress={handleFavoritePress}
        onWishlistPress={handleWishlistPress}
        onAvatarPress={handleAvatarPress}
        onTitlePress={handleTitlePress}
      />
    );
  }

  if (error) {
    Alert.alert('Erro', error);
  }

  return (
    <HomeTemplate
      books={books}
      stores={stores}
      onBookPress={handleBookPress}
      onFavoritePress={handleFavoritePress}
      onWishlistPress={handleWishlistPress}
      onAvatarPress={handleAvatarPress}
      onTitlePress={handleTitlePress}
    />
  );
}
