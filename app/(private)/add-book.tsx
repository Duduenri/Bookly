import BookForm from '@/components/BookForm';
import { useToast } from '@/src/hooks/useToast';
import { BookFormData, BookListingData, bookService } from '@/src/services/bookService';
import { PadraoBookly, paletasCores } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddBookPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (bookData: BookFormData, listingData: BookListingData) => {
    setLoading(true);
    
    try {
      // Primeiro, criar o livro
      const bookResult = await bookService.createBook(bookData);
      
      // Depois, criar o anúncio
      await bookService.createListing(bookResult.id, listingData);
      
      showToast({
        title: 'Sucesso!',
        description: 'Livro cadastrado com sucesso!',
        type: 'success',
      });
      
      // Redirecionar para a home
      router.replace('/(private)/home');
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
      
      showToast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o livro. Tente novamente.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={paletasCores.principal.texto} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastrar Livro</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Formulário */}
      <View style={styles.content}>
        <BookForm onSubmit={handleSubmit} loading={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PadraoBookly.corSecundaria,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: paletasCores.principal.solido,
    borderBottomWidth: 1,
    borderBottomColor: paletasCores.principal.contorno,
    shadowColor: paletasCores.principal.solido,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: paletasCores.principal.texto,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
});
