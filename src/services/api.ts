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

// Hook personalizado para usar a API
export const useApi = () => {
  return {
    getBooks: apiClient.getBooks.bind(apiClient),
    getBooksByCategory: apiClient.getBooksByCategory.bind(apiClient),
    searchBooks: apiClient.searchBooks.bind(apiClient),
    getBookById: apiClient.getBookById.bind(apiClient),
    addToFavorites: apiClient.addToFavorites.bind(apiClient),
    addToWishlist: apiClient.addToWishlist.bind(apiClient),
  };
};
