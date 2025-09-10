import { Redirect } from 'expo-router';

export default function Index() {
  // Redirecionar automaticamente para a página de login
  return <Redirect href="/(public)/login" />;
}
