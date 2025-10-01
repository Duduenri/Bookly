// Configuração da API
const API_BASE_URL = 'http://localhost:3000'; // URL da API local

// Tipos da API
export interface ApiBook {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  price?: number;
  condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';
  transactionType: 'SALE' | 'EXCHANGE' | 'RENTAL';
  location: string;
  sellerName: string;
  sellerAvatar?: string;
}

// Cliente da API
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Buscar todos os livros disponíveis
  async getBooks(): Promise<ApiBook[]> {
    return this.request<ApiBook[]>('/api/books');
  }

  // Buscar livros por categoria
  async getBooksByCategory(categoryId: string): Promise<ApiBook[]> {
    return this.request<ApiBook[]>(`/api/books?category=${categoryId}`);
  }

  // Buscar livros por busca
  async searchBooks(query: string): Promise<ApiBook[]> {
    return this.request<ApiBook[]>(`/api/books/search?q=${encodeURIComponent(query)}`);
  }

  // Buscar livro por ID
  async getBookById(id: string): Promise<ApiBook> {
    return this.request<ApiBook>(`/api/books/${id}`);
  }

  // Adicionar livro aos favoritos
  async addToFavorites(bookId: string, userId: string): Promise<void> {
    return this.request<void>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ bookId, userId }),
    });
  }

  // Adicionar livro à wishlist
  async addToWishlist(bookId: string, userId: string): Promise<void> {
    return this.request<void>('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ bookId, userId }),
    });
  }
}

// Instância global da API
export const apiClient = new ApiClient(API_BASE_URL);

// Importar supabase para fallback
import { supabase } from './supabase';

// Hook personalizado para usar a API com fallback para Supabase
export const useApi = () => {
  // Função para buscar livros com fallback
  const getBooks = async (): Promise<ApiBook[]> => {
    try {
      // Tentar buscar da API local primeiro
      return await apiClient.getBooks();
    } catch (error) {
      console.log('API local não disponível, usando Supabase...');
      
      // Fallback: buscar do Supabase
      const { data, error: supabaseError } = await supabase
        .from('books')
        .select('*')
        .limit(20);
      
      if (supabaseError) {
        console.error('Erro no Supabase:', supabaseError);
        throw supabaseError;
      }
      
      // Converter dados do Supabase para o formato da API
      return (data || []).map((item: any): ApiBook => ({
        id: item.id,
        title: item.title || 'Título não informado',
        author: item.author || 'Autor não informado',
        description: item.description,
        coverImage: item.coverImage,
        price: item.price,
        condition: item.condition || 'GOOD',
        transactionType: item.transactionType || 'SALE',
        location: item.location || 'Local não informado',
        sellerName: item.sellerName || 'Vendedor',
        sellerAvatar: item.sellerAvatar,
      }));
    }
  };

  // Função para adicionar aos favoritos com fallback
  const addToFavorites = async (bookId: string, userId: string): Promise<void> => {
    try {
      await apiClient.addToFavorites(bookId, userId);
    } catch (error) {
      console.log('API local não disponível, usando Supabase...');
      
      const { error: supabaseError } = await supabase
        .from('favorites')
        .insert({ bookId, profileId: userId });
      
      if (supabaseError) {
        throw supabaseError;
      }
    }
  };

  // Função para adicionar à wishlist com fallback
  const addToWishlist = async (bookId: string, userId: string): Promise<void> => {
    try {
      await apiClient.addToWishlist(bookId, userId);
    } catch (error) {
      console.log('API local não disponível, usando Supabase...');
      
      const { error: supabaseError } = await supabase
        .from('wishlists')
        .insert({ bookId, profileId: userId });
      
      if (supabaseError) {
        throw supabaseError;
      }
    }
  };

  return {
    getBooks,
    getBooksByCategory: apiClient.getBooksByCategory.bind(apiClient),
    searchBooks: apiClient.searchBooks.bind(apiClient),
    getBookById: apiClient.getBookById.bind(apiClient),
    addToFavorites,
    addToWishlist,
  };
};
