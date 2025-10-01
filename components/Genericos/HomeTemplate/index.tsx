import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Book, BookList } from '../BookList';
import { Header } from '../Header';
import LivrariasMap from '../Map/LivrariasMap';

export interface Store {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface HomeTemplateProps {
  books: Book[];
  stores: Store[];
  loading?: boolean;
  onBookPress?: (book: Book) => void;
  onFavoritePress?: (book: Book) => void;
  onWishlistPress?: (book: Book) => void;
  onAvatarPress?: () => void;
  onTitlePress?: () => void;
}

export const HomeTemplate: React.FC<HomeTemplateProps> = ({
  books,
  stores,
  loading = false,
  onBookPress,
  onFavoritePress,
  onWishlistPress,
  onAvatarPress,
  onTitlePress,
}) => {
  return (
    <View style={styles.container}>
      <Header
        title="Bookly"
        subtitle="Sua plataforma de livros"
        onAvatarPress={onAvatarPress}
        onTitlePress={onTitlePress}
        showBorder={true}
        showShadow={true}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção do Mapa */}
        <View style={styles.mapSection}>
          <LivrariasMap 
            stores={stores}
            height={200}
          />
        </View>

        {/* Seção dos Livros */}
        <View style={styles.booksSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3182ce" />
            </View>
          ) : (
            <BookList
              books={books}
              onBookPress={onBookPress}
              onFavoritePress={onFavoritePress}
              onWishlistPress={onWishlistPress}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  mapSection: {
    marginBottom: 20,
  },
  booksSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});

export default HomeTemplate;