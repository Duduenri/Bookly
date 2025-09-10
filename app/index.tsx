import { router } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    // Redirecionar automaticamente para a página de login
    router.replace('/(public)/login');
  }, []);

  // Não renderiza nada, apenas redireciona
  return null;
}
