import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = '@bookly/auth_user';

  const isAuthenticated = !!user;

  // Carrega sessão persistida ao iniciar
  useEffect(() => {
    const loadPersistedUser = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: User = JSON.parse(raw);
          setUser(parsed);
        }
      } catch (error) {
        console.warn('Falha ao carregar sessão persistida', error);
      } finally {
        setLoading(false);
      }
    };
    loadPersistedUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Simular login - em produção, aqui seria a chamada para a API
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuário mockado para teste
      const mockUser: User = {
        id: '1',
        email: email,
        name: 'Usuário Teste',
        avatar: 'https://via.placeholder.com/50', // Adicionado avatar mockado
      };
      
      setUser(mockUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {
      // noop
    });
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    logout,
    loading,
  }), [user, isAuthenticated, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
