import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Genericos/Button';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Simular login com credenciais mockadas
      await login('usuario@teste.com', 'senha123');
      // Redirecionar para a área privada
      router.replace('/(private)/home');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bookly</Text>
        <Text style={styles.subtitle}>Sua plataforma de livros</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            size="lg"
            variant="solid"
            onPress={handleLogin}
          >
            Bem Vindo
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#718096',
    marginBottom: 60,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
