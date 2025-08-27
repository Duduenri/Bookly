import { Provider } from '@/src/components/ui/provider';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(private)';
    
    if (isAuthenticated && !inAuthGroup) {
      // Se está autenticado mas não está na área privada, redirecionar para home
      router.replace('/(private)/home');
    } else if (!isAuthenticated && inAuthGroup) {
      // Se não está autenticado mas está na área privada, redirecionar para login
      router.replace('/(public)/login');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack>
      {/* Rotas públicas - rota padrão */}
      <Stack.Screen 
        name="(public)" 
        options={{ headerShown: false }} 
      />
      
      {/* Rotas privadas */}
      <Stack.Screen 
        name="(private)" 
        options={{ headerShown: false }} 
      />
      
      {/* Rotas antigas (tabs) - podem ser removidas depois */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      
      <Stack.Screen name="+not-found" />
      
      {/* Rota raiz */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
