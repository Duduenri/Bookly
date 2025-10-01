import Button from '@/components/Genericos/Button';
import { PasswordInput } from '@/components/Genericos/Input';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/hooks/useToast';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para debugar mudanças no email
  const handleEmailChange = (text: string) => {
    console.log('Email changed:', text);
    setEmail(text);
  };

  // Função para debugar o foco no input
  const handleEmailFocus = () => {
    console.log('Email input focused');
  };
  
  const handleEmailBlur = () => {
    console.log('Email input blurred');
  };

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
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bookly</Text>
        <Text style={styles.subtitle}>Sua plataforma de livros</Text>

        <View style={styles.form}>

          <View style={{ marginBottom: 16 }}>
            <TextInput
              placeholder="Digite seu email"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={true}
              selectTextOnFocus={true}
              clearButtonMode="while-editing"
              style={{ 
                minHeight: 48,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                borderWidth: 2,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                backgroundColor: '#ffffff',
                color: '#1a202c'
              }}
              placeholderTextColor="#a0aec0"
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <PasswordInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              visibilityIcon={{ on: <LuEye size={18} />, off: <LuEyeOff size={18} /> }}
            />
          </View>

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
  link: {
    color: '#3182ce',
    textDecorationLine: 'underline',
  },
});
