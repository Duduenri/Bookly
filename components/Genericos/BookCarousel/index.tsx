import { paletasCores } from '@/utils/colors';
import React from 'react';
import { Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Book } from '../BookList';

// Imports condicionais do Chakra UI (apenas para web)
let VStack: any = View;
let Heading: any = Text;

if (Platform.OS === 'web') {
  try {
    const chakra = require('@chakra-ui/react');
    VStack = chakra.VStack;
    Heading = chakra.Heading;
  } catch (error) {
    console.log('Chakra UI não disponível, usando fallback');
  }
}

export interface BookCarouselProps {
  title: string;
  books: Book[];
  onBookPress?: (book: Book) => void;
  onFavoritePress?: (book: Book) => void;
  onWishlistPress?: (book: Book) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.4; // 40% da largura da tela
const CARD_MARGIN = 12;

// Componente BookCard inline
interface BookCardProps {
  book: Book;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onWishlistPress?: () => void;
  width?: number;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onFavoritePress,
  onWishlistPress,
  width = 160,
}) => {
  const getConditionText = (condition: string) => {
    const conditions = {
      NEW: 'Novo',
      LIKE_NEW: 'Como novo',
      GOOD: 'Bom',
      FAIR: 'Regular',
      POOR: 'Ruim'
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      NEW: '#38A169',
      LIKE_NEW: '#319795',
      GOOD: '#3182CE',
      FAIR: '#D69E2E',
      POOR: '#E53E3E'
    };
    return colors[condition as keyof typeof colors] || '#718096';
  };

  return (
    <TouchableOpacity
      style={[bookCardStyles.card, { width }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Imagem do livro */}
      <View style={bookCardStyles.imageContainer}>
        {book.coverImage ? (
          <Image source={{ uri: book.coverImage }} style={bookCardStyles.bookImage} />
        ) : (
          <View style={bookCardStyles.placeholderImage}>
            <Text style={bookCardStyles.placeholderText}>📚</Text>
          </View>
        )}
      </View>

      {/* Informações do livro */}
      <View style={bookCardStyles.bookInfo}>
        <Text style={bookCardStyles.bookTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={bookCardStyles.bookAuthor} numberOfLines={1}>
          {book.author}
        </Text>

        {/* Preço */}
        {book.price && (
          <Text style={bookCardStyles.bookPrice}>
            R$ {book.price.toFixed(2)}
          </Text>
        )}

        {/* Tag de condição */}
        <View style={bookCardStyles.tagsContainer}>
          <View style={[bookCardStyles.tag, { backgroundColor: getConditionColor(book.condition) }]}>
            <Text style={bookCardStyles.tagText}>{getConditionText(book.condition)}</Text>
          </View>
        </View>

        {/* Localização */}
        <Text style={bookCardStyles.locationText} numberOfLines={1}>
          📍 {book.location}
        </Text>
      </View>

      {/* Botões de ação */}
      <View style={bookCardStyles.actionsContainer}>
        <TouchableOpacity
          style={bookCardStyles.actionButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <Text style={bookCardStyles.actionIcon}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={bookCardStyles.actionButton}
          onPress={onWishlistPress}
          activeOpacity={0.7}
        >
          <Text style={bookCardStyles.actionIcon}>📝</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const BookCarousel: React.FC<BookCarouselProps> = ({
  title,
  books,
  onBookPress,
  onFavoritePress,
  onWishlistPress,
}) => {
  const renderBookItem = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      onPress={() => onBookPress?.(item)}
      onFavoritePress={() => onFavoritePress?.(item)}
      onWishlistPress={() => onWishlistPress?.(item)}
      width={CARD_WIDTH}
    />
  );

  const HeadingComponent = Platform.OS === 'web' && Heading !== Text ? (
    <Heading size="md" style={styles.title}>
      {title}
    </Heading>
  ) : (
    <Text style={styles.title}>{title}</Text>
  );

  return (
    <VStack style={Platform.OS === 'web' ? { space: 4 } : styles.container}>
      {HeadingComponent}
      
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
          </View>
        )}
      />
    </VStack>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  separator: {
    width: CARD_MARGIN,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: paletasCores.cinza.solido,
    textAlign: 'center',
  },
});

const bookCardStyles = StyleSheet.create({
  card: {
    backgroundColor: paletasCores.cinza.texto,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bookImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  bookInfo: {
    flex: 1,
    gap: 4,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    lineHeight: 18,
  },
  bookAuthor: {
    fontSize: 12,
    color: paletasCores.cinza.solido,
    fontStyle: 'italic',
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  locationText: {
    fontSize: 11,
    color: paletasCores.cinza.solido,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: paletasCores.cinza.contorno,
  },
  actionButton: {
    padding: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
});

export default BookCarousel;