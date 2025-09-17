import Button from '@/components/Genericos/Button';
import Input, { PasswordInput } from '@/components/Genericos/Input';
import { useAuth } from '@/src/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    // validação simples de formato
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email inválido');
      return false;
    }
    if (!password) {
      setError('Senha é obrigatória');
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(private)/home');
    } catch (err: any) {
      console.error('Erro no login:', err);
      
      // Tratamento específico de erros do Supabase
      if (err?.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else if (err?.message?.includes('email not confirmed')) {
        setError('Por favor, confirme seu email antes de fazer login.');
      } else if (err?.message?.includes('too many requests')) {
        setError('Muitas tentativas. Tente novamente em alguns minutos.');
      } else {
        setError(err?.message || 'Falha ao autenticar. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bookly</Text>
        <Text style={styles.subtitle}>Sua plataforma de livros</Text>

        <View style={styles.form}>

          <Input
            placeholder="Email"
            value={email}
            onChange={(e: any) => setEmail(e.target?.value ?? e.nativeEvent?.text ?? (typeof e === 'string' ? e : ''))}
            mb={3}
          />

          <PasswordInput
            placeholder="Senha"
            value={password}
            onChange={(e: any) => setPassword(e.target?.value ?? e.nativeEvent?.text ?? (typeof e === 'string' ? e : ''))}
            mb={6}
            visibilityIcon={{ on: <LuEye size={18} />, off: <LuEyeOff size={18} /> }}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <Button size="lg" variant="solid" onPress={handleLogin} loading={loading}>
              Entrar
            </Button>
          </View>
           <View style={{ marginTop: 12 }}>
              <Text style={styles.subtitle}>Ainda não possui conta? <Text style={styles.link} onPress={() => router.push('/(public)/register')}>Cadastre</Text></Text>
           </View>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#718096',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 360,
  },
  buttonContainer: {
    width: '100%',
  },
  error: {
    color: '#e53e3e',
    marginBottom: 12,
  },
  link: {
    color: '#3182ce',
    textDecorationLine: 'underline',
  },
});
