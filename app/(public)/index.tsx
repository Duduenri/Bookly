import { router } from 'expo-router';
import { useEffect } from 'react';

export default function PublicIndex() {
  useEffect(() => {
    // Redirecionar para o login
    router.replace('/(public)/login');
  }, []);

  return null;
}
