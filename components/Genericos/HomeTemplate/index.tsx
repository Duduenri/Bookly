import LivrariasMap, { Store } from '@/components/Genericos/Map/LivrariasMap';
import { PadraoBookly, paletasCores } from '@/utils/colors';
import React, { useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BookList, { Book } from '../BookList';
import Header from '../Header';

// Importações condicionais do Chakra UI para web
let VStack: any, Input: any, InputGroup: any, InputLeftElement: any;

if (Platform.OS === 'web') {
  try {
    const chakraComponents = require('@chakra-ui/react');
    VStack = chakraComponents.VStack;
    Input = chakraComponents.Input;
    InputGroup = chakraComponents.InputGroup;
    InputLeftElement = chakraComponents.InputLeftElement;
  } catch (error) {
    console.log('Chakra UI não disponível, usando fallback');
    VStack = View;
    Input = null;
    InputGroup = null;
    InputLeftElement = null;
  }
} else {
  VStack = View;
  Input = null;
  InputGroup = null;
  InputLeftElement = null;
}

export interface HomeTemplateProps {
  books: Book[];
  onBookPress?: (book: Book) => void;
  onFavoritePress?: (book: Book) => void;
  onWishlistPress?: (book: Book) => void;
  onAvatarPress?: () => void;
  onTitlePress?: () => void;
  onSearchChange?: (searchTerm: string) => void;
  stores?: Store[];
}

export const HomeTemplate: React.FC<HomeTemplateProps> = ({
  books,
  onBookPress,
  onFavoritePress,
  onWishlistPress,
  onAvatarPress,
  onTitlePress,
  onSearchChange,
  stores = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    onSearchChange?.(text);
  };

  const SearchBarComponent = Platform.OS === 'web' && Input ? (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Text>🔍</Text>
      </InputLeftElement>
      <Input
        placeholder="Busque por título, autor ou ISBN..."
        value={searchTerm}
        onChange={(e: any) => handleSearchChange(e.target.value)}
      />
    </InputGroup>
  ) : (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Busque por título, autor ou ISBN..."
        value={searchTerm}
        onChangeText={handleSearchChange}
        placeholderTextColor={paletasCores.cinza.solido}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header personalizado */}
      <Header
        avatarName="Usuário"
        avatarSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        title="Bookly"
        subtitle="Hub de descoberta de livros"
        avatarSize="md"
        avatarColorPalette="blue"
        showBorder={true}
        showShadow={false}
        onAvatarPress={onAvatarPress}
        onTitlePress={onTitlePress}
        rightContent={(
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={onTitlePress} disabled={!onTitlePress}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onAvatarPress} disabled={!onAvatarPress}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Perfil</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <VStack style={Platform.OS === 'web' ? { space: 6, p: 4 } : styles.vstack}>
          
          {/* Barra de Busca */}
          <View style={styles.searchSection}>
            {SearchBarComponent}
          </View>

          {/* Mapa de livrarias compacto */}
          {stores.length > 0 && (
            <View style={styles.mapSectionCompact}>
              <Text style={styles.sectionTitle}>📍 Sebos Próximos</Text>
              <LivrariasMap stores={stores} height={150} />
            </View>
          )}

          {/* Seção de livros */}
          <View style={styles.booksSection}>
            <Text style={styles.sectionTitle}>📚 Livros Disponíveis</Text>
            <Text style={styles.sectionSubtitle}>
              {books.length} livro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
            </Text>
            
            <BookList
              books={books}
              onBookPress={onBookPress}
              onFavoritePress={onFavoritePress}
              onWishlistPress={onWishlistPress}
            />
          </View>

        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PadraoBookly.corSecundaria,
  },
  scrollView: {
    flex: 1,
  },
  vstack: {
    padding: 16,
    gap: 24,
  },
  searchSection: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: paletasCores.cinza.texto,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: paletasCores.cinza.contorno,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
    color: paletasCores.cinza.solido,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: paletasCores.cinza.solido,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: paletasCores.cinza.solido,
    padding: 0, // Remove padding padrão do iOS
  },
  mapSectionCompact: {
    backgroundColor: paletasCores.cinza.texto,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  booksSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: paletasCores.cinza.solido,
    marginBottom: 16,
  },
  // Estilos antigos mantidos para compatibilidade
  mapSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: paletasCores.cinza.texto,
    borderBottomWidth: 1,
    borderBottomColor: paletasCores.cinza.contorno,
    gap: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: paletasCores.principal.solido,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: paletasCores.cinza.texto,
    borderBottomWidth: 1,
    borderBottomColor: paletasCores.cinza.contorno,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: paletasCores.cinza.solido,
  },
});

export default HomeTemplate;
