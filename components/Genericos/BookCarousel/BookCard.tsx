import { paletasCores } from '@/utils/colors';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Book } from '../BookList';

export interface BookCardProps {
  book: Book;
  onPress?: () => void;
  onFavoritePress?: () => void;
  onWishlistPress?: () => void;
  width?: number;
}

export const BookCard: React.FC<BookCardProps> = ({
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

  const getTransactionTypeText = (type: string) => {
    const types = {
      SALE: 'Venda',
      EXCHANGE: 'Troca',
      RENTAL: 'Aluguel'
    };
    return types[type as keyof typeof types] || type;
  };

  const getTransactionTypeColor = (type: string) => {
    const colors = {
      SALE: '#38A169',
      EXCHANGE: '#805AD5',
      RENTAL: '#3182CE'
    };
    return colors[type as keyof typeof colors] || '#718096';
  };

  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Imagem do livro */}
      <View style={styles.imageContainer}>
        {book.coverImage ? (
          <Image source={{ uri: book.coverImage }} style={styles.bookImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📚</Text>
          </View>
        )}
      </View>

      {/* Informações do livro */}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {book.author}
        </Text>

        {/* Preço */}
        {book.price && (
          <Text style={styles.bookPrice}>
            R$ {book.price.toFixed(2)}
          </Text>
        )}

        {/* Tags de condição e tipo */}
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: getConditionColor(book.condition) }]}>
            <Text style={styles.tagText}>{getConditionText(book.condition)}</Text>
          </View>
        </View>

        {/* Localização */}
        <Text style={styles.locationText} numberOfLines={1}>
          📍 {book.location}
        </Text>
      </View>

      {/* Botões de ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onFavoritePress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onWishlistPress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>📝</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default BookCard;