import { useToast } from '@/src/hooks/useToast';
import { BookFormData, BookListingData, Category, Location, bookService } from '@/src/services/bookService';
import { PadraoBookly, paletasCores } from '@/utils/colors';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface BookFormProps {
  onSubmit: (bookData: BookFormData, listingData: BookListingData) => Promise<void>;
  loading?: boolean;
}

export default function BookForm({ onSubmit, loading = false }: BookFormProps) {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Dados do livro
  const [bookData, setBookData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    isbn: '',
    publisher: '',
    publishedAt: '',
    pages: undefined,
    language: 'Português',
    categoryId: '',
  });

  // Dados do anúncio
  const [listingData, setListingData] = useState<BookListingData>({
    condition: 'GOOD',
    price: undefined,
    rentalPrice: undefined,
    exchangeFor: '',
    transactionType: 'SALE',
    locationId: '',
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesData, locationsData] = await Promise.all([
          bookService.getCategories(),
          bookService.getUserLocations(),
        ]);
        
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast({
          title: 'Erro',
          description: 'Não foi possível carregar as categorias e localizações.',
          type: 'error',
        });
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, [showToast]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        
        // Fazer upload da imagem para o Supabase
        try {
          const fileName = `book-cover-${Date.now()}.jpg`;
          const uploadResult = await bookService.uploadImage(imageUri, fileName);
          setBookData(prev => ({ ...prev, coverImage: uploadResult.url }));
        } catch (uploadError) {
          console.error('Erro ao fazer upload da imagem:', uploadError);
          // Manter a URI local como fallback
          setBookData(prev => ({ ...prev, coverImage: imageUri }));
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      showToast({
        title: 'Erro',
        description: 'Não foi possível selecionar a imagem.',
        type: 'error',
      });
    }
  };

  const handleSubmit = async () => {
    if (!bookData.title.trim() || !bookData.author.trim()) {
      showToast({
        title: 'Campos obrigatórios',
        description: 'Título e autor são obrigatórios.',
        type: 'error',
      });
      return;
    }

    if (!listingData.locationId) {
      showToast({
        title: 'Localização obrigatória',
        description: 'Selecione uma localização para o anúncio.',
        type: 'error',
      });
      return;
    }

    try {
      await onSubmit(bookData, listingData);
    } catch (error) {
      console.error('Erro ao cadastrar livro:', error);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Informações do Livro</Text>
      
      {/* Imagem da capa */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.coverImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>+ Adicionar capa</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Título */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={bookData.title}
          onChangeText={(text) => setBookData(prev => ({ ...prev, title: text }))}
          placeholder="Digite o título do livro"
          placeholderTextColor="#999"
        />
      </View>

      {/* Autor */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Autor *</Text>
        <TextInput
          style={styles.input}
          value={bookData.author}
          onChangeText={(text) => setBookData(prev => ({ ...prev, author: text }))}
          placeholder="Digite o nome do autor"
          placeholderTextColor="#999"
        />
      </View>

      {/* Descrição */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={bookData.description}
          onChangeText={(text) => setBookData(prev => ({ ...prev, description: text }))}
          placeholder="Descreva o livro..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* ISBN */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>ISBN</Text>
        <TextInput
          style={styles.input}
          value={bookData.isbn}
          onChangeText={(text) => setBookData(prev => ({ ...prev, isbn: text }))}
          placeholder="Digite o ISBN (opcional)"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      {/* Editora */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Editora</Text>
        <TextInput
          style={styles.input}
          value={bookData.publisher}
          onChangeText={(text) => setBookData(prev => ({ ...prev, publisher: text }))}
          placeholder="Digite a editora"
          placeholderTextColor="#999"
        />
      </View>

      {/* Ano de publicação */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ano de Publicação</Text>
        <TextInput
          style={styles.input}
          value={bookData.publishedAt}
          onChangeText={(text) => setBookData(prev => ({ ...prev, publishedAt: text }))}
          placeholder="Ex: 2023"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      {/* Número de páginas */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número de Páginas</Text>
        <TextInput
          style={styles.input}
          value={bookData.pages?.toString()}
          onChangeText={(text) => setBookData(prev => ({ 
            ...prev, 
            pages: text ? parseInt(text) : undefined 
          }))}
          placeholder="Ex: 300"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      {/* Idioma */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Idioma</Text>
        <TextInput
          style={styles.input}
          value={bookData.language}
          onChangeText={(text) => setBookData(prev => ({ ...prev, language: text }))}
          placeholder="Ex: Português"
          placeholderTextColor="#999"
        />
      </View>

      {/* Categoria */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={bookData.categoryId}
            onValueChange={(value) => setBookData(prev => ({ ...prev, categoryId: value }))}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.id} label={category.name} value={category.id} />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Informações do Anúncio</Text>

      {/* Condição do livro */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Condição do Livro</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={listingData.condition}
            onValueChange={(value) => setListingData(prev => ({ ...prev, condition: value }))}
            style={styles.picker}
          >
            <Picker.Item label="Novo" value="NEW" />
            <Picker.Item label="Como novo" value="LIKE_NEW" />
            <Picker.Item label="Bom" value="GOOD" />
            <Picker.Item label="Aceitável" value="ACCEPTABLE" />
            <Picker.Item label="Ruim" value="POOR" />
          </Picker>
        </View>
      </View>

      {/* Tipo de transação */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tipo de Transação</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={listingData.transactionType}
            onValueChange={(value) => setListingData(prev => ({ ...prev, transactionType: value }))}
            style={styles.picker}
          >
            <Picker.Item label="Venda" value="SALE" />
            <Picker.Item label="Troca" value="EXCHANGE" />
            <Picker.Item label="Aluguel" value="RENTAL" />
          </Picker>
        </View>
      </View>

      {/* Preço (se venda) */}
      {listingData.transactionType === 'SALE' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preço (R$)</Text>
          <TextInput
            style={styles.input}
            value={listingData.price?.toString()}
            onChangeText={(text) => setListingData(prev => ({ 
              ...prev, 
              price: text ? parseFloat(text) : undefined 
            }))}
            placeholder="Ex: 25.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Preço do aluguel (se aluguel) */}
      {listingData.transactionType === 'RENTAL' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preço do Aluguel (R$)</Text>
          <TextInput
            style={styles.input}
            value={listingData.rentalPrice?.toString()}
            onChangeText={(text) => setListingData(prev => ({ 
              ...prev, 
              rentalPrice: text ? parseFloat(text) : undefined 
            }))}
            placeholder="Ex: 5.00"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Troca por (se troca) */}
      {listingData.transactionType === 'EXCHANGE' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Troca por</Text>
          <TextInput
            style={styles.input}
            value={listingData.exchangeFor}
            onChangeText={(text) => setListingData(prev => ({ ...prev, exchangeFor: text }))}
            placeholder="Descreva o que você gostaria em troca"
            placeholderTextColor="#999"
          />
        </View>
      )}

      {/* Localização */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Localização *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={listingData.locationId}
            onValueChange={(value) => setListingData(prev => ({ ...prev, locationId: value }))}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma localização" value="" />
            {locations.map((location) => (
              <Picker.Item 
                key={location.id} 
                label={`${location.name} - ${location.city}, ${location.state}`} 
                value={location.id} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Botão de cadastrar */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Cadastrar Livro</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: PadraoBookly.corSecundaria,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PadraoBookly.corSecundaria,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: paletasCores.cinza.solido,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    marginBottom: 20,
    marginTop: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: paletasCores.cinza.contorno,
  },
  imagePlaceholder: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: paletasCores.cinza.contorno,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: paletasCores.principal.solido,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: paletasCores.principal.solido,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: paletasCores.principal.solido,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: paletasCores.principal.contorno,
    color: paletasCores.principal.solido,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: paletasCores.principal.contorno,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: paletasCores.principal.solido,
  },
  submitButton: {
    backgroundColor: paletasCores.principal.solido,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: paletasCores.principal.solido,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: paletasCores.cinza.solido,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: paletasCores.principal.texto,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
