import Button from '@/components/Genericos/Button';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(public)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Olá Mundo!</Text>
        <Text style={styles.subtitle}>Bem-vindo à área privada do Bookly</Text>
        <Text style={styles.description}>
          Aqui você pode gerenciar seus livros, favoritos e interagir com outros usuários.
        </Text>
        
        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>Logado como: {user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <Button 
            size="md"
            variant="outline"
            onPress={handleLogout}
          >
            Sair
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#4A5568',
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 40,
  },
  userInfo: {
    backgroundColor: '#EDF2F7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
  },
  userText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#718096',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 200,
  },
});
