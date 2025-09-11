import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { Profile, getProfileByEmail, updateProfile } from '@/src/services/profileService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    avatar: '',
    bio: '',
  });

  // Proteção de rota: redireciona para login se não autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(public)/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const data = await getProfileByEmail(user.email);
        setProfile(data);
        setForm({
          name: data?.name ?? user.name ?? '',
          phone: data?.phone ?? '',
          avatar: data?.avatar ?? user.avatar ?? '',
          bio: data?.bio ?? '',
        });
      } catch (e: any) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível carregar o perfil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.email, user?.name, user?.avatar]);

  const onSave = async () => {
    if (!profile?.id) {
      Alert.alert('Aviso', 'Perfil ainda não existe no banco para este usuário.');
      return;
    }
    setLoading(true);
    try {
      const updated = await updateProfile(profile.id, {
        name: form.name || undefined,
        phone: form.phone || null,
        avatar: form.avatar || null,
        bio: form.bio || null,
      });
      setProfile(updated);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Você não está logado</Text>
        <Text style={styles.subtitle}>Faça login para ver e editar seu perfil.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Meu Perfil</Text>

      <View style={styles.avatarRow}>
        {form.avatar ? (
          <Image source={{ uri: form.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={{ color: '#888' }}>Sem foto</Text>
          </View>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
          placeholder="Seu nome"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 80 }]} multiline
          value={form.bio}
          onChangeText={(t) => setForm((f) => ({ ...f, bio: t }))}
          placeholder="Fale um pouco sobre você"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
          placeholder="(xx) xxxxx-xxxx"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>URL do Avatar</Text>
        <TextInput
          style={styles.input}
          value={form.avatar}
          onChangeText={(t) => setForm((f) => ({ ...f, avatar: t }))}
          placeholder="https://..."
          autoCapitalize='none'
        />
      </View>

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.6 }]} onPress={onSave} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={logout}>
        <Text style={[styles.buttonText, { color: '#333' }]}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  avatarRow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  secondaryButton: {
    backgroundColor: '#f2f2f2',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
