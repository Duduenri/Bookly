import Button from '@/components/Genericos/Button';
import Input, { PasswordInput } from '@/components/Genericos/Input';
import { useColorMode } from '@/src/components/ui/color-mode';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/hooks/useToast';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const toast = useToast();
  const { setColorMode } = useColorMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Garantir que a tela de login sempre use tema claro
  useEffect(() => {
    setColorMode('light');
  }, [setColorMode]);

  const validate = () => {
    if (!email.trim()) {
      toast.error('Erro de validação', 'Email é obrigatório');
      return false;
    }
    // validação simples de formato
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Erro de validação', 'Email inválido');
      return false;
    }
    if (!password) {
      toast.error('Erro de validação', 'Senha é obrigatória');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Sucesso!', 'Login realizado com sucesso. Bem-vindo de volta!');
      router.replace('/(private)/home');
    } catch (err: any) {
      console.error('Erro no login:', err);
      
      // Tratamento específico de erros do Supabase
      if (err?.message?.includes('Invalid login credentials')) {
        toast.error('Erro no login', 'Email ou senha incorretos.');
      } else if (err?.message?.includes('email not confirmed')) {
        toast.error('Erro no login', 'Por favor, confirme seu email antes de fazer login.');
      } else if (err?.message?.includes('too many requests')) {
        toast.error('Erro no login', 'Muitas tentativas. Tente novamente em alguns minutos.');
      } else {
        toast.error('Erro no login', err?.message || 'Falha ao autenticar. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: '#1a202c' }]}>Bookly</Text>
        <Text style={[styles.subtitle, { color: '#4a5568' }]}>Sua plataforma de livros</Text>

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

          <View style={styles.buttonContainer}>
            <Button size="lg" variant="solid" onPress={handleLogin} loading={loading}>
              Entrar
            </Button>
          </View>
           <View style={{ marginTop: 12 }}>
              <Text style={[styles.subtitle, { color: '#4a5568' }]}>Ainda não possui conta? <Text style={[styles.link, { color: '#3182ce' }]} onPress={() => router.push('/(public)/register')}>Cadastre</Text></Text>
           </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color: '#1a202c',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#4a5568',
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
  link: {
    color: '#3182ce',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
