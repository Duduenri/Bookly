-- =====================================================
-- SUPABASE TRIGGERS PARA INTEGRIDADE REFERENCIAL
-- =====================================================

-- Função para validar se um userId existe em auth.users
CREATE OR REPLACE FUNCTION validate_user_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o userId existe em auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = NEW.userId
  ) THEN
    RAISE EXCEPTION 'User ID % does not exist in auth.users', NEW.userId;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para validar se o email do profile corresponde ao email do auth.users
CREATE OR REPLACE FUNCTION validate_profile_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar se o email do profile corresponde ao email do auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = NEW.userId AND email = NEW.email
  ) THEN
    RAISE EXCEPTION 'Email mismatch: profile email % does not match auth.users email for user ID %', NEW.email, NEW.userId;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para limpar dados relacionados quando um usuário é deletado
CREATE OR REPLACE FUNCTION cleanup_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Deletar perfil do usuário
  DELETE FROM public.profiles WHERE userId = OLD.id;
  
  -- Deletar anúncios do usuário
  DELETE FROM public.listings WHERE profileId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  );
  
  -- Deletar reviews do usuário
  DELETE FROM public.reviews WHERE profileId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  );
  
  -- Deletar favoritos do usuário
  DELETE FROM public.favorites WHERE profileId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  );
  
  -- Deletar lista de desejos do usuário
  DELETE FROM public.wishlist_items WHERE profileId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  );
  
  -- Deletar solicitações de amizade enviadas
  DELETE FROM public.friend_requests WHERE senderId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  );
  
  -- Deletar solicitações de amizade recebidas
  DELETE FROM public.friend_requests WHERE receiverId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  );
  
  -- Deletar amizades confirmadas
  DELETE FROM public.friendships WHERE profileId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  ) OR friendId IN (
    SELECT id FROM public.profiles WHERE userId = OLD.id
  );
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para validar userId antes de inserir/atualizar profile
DROP TRIGGER IF EXISTS trigger_validate_user_exists ON public.profiles;
CREATE TRIGGER trigger_validate_user_exists
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_user_exists();

-- Trigger para validar email antes de inserir/atualizar profile
DROP TRIGGER IF EXISTS trigger_validate_profile_email ON public.profiles;
CREATE TRIGGER trigger_validate_profile_email
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_profile_email();

-- Trigger para limpar dados quando usuário é deletado do auth.users
DROP TRIGGER IF EXISTS trigger_cleanup_user_data ON auth.users;
CREATE TRIGGER trigger_cleanup_user_data
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_data();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookstores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secondhand_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA PROFILES
-- =====================================================

-- Usuários podem ver todos os perfis
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

-- Usuários só podem inserir/atualizar seu próprio perfil
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid()::text = userId);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid()::text = userId);

-- Usuários só podem deletar seu próprio perfil
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid()::text = userId);

-- =====================================================
-- POLÍTICAS PARA LISTINGS
-- =====================================================

-- Usuários podem ver todos os anúncios ativos
CREATE POLICY "Users can view active listings" ON public.listings
  FOR SELECT USING (status = 'ACTIVE');

-- Usuários podem ver seus próprios anúncios (qualquer status)
CREATE POLICY "Users can view own listings" ON public.listings
  FOR SELECT USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem criar anúncios
CREATE POLICY "Users can create listings" ON public.listings
  FOR INSERT WITH CHECK (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem atualizar seus próprios anúncios
CREATE POLICY "Users can update own listings" ON public.listings
  FOR UPDATE USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem deletar seus próprios anúncios
CREATE POLICY "Users can delete own listings" ON public.listings
  FOR DELETE USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- =====================================================
-- POLÍTICAS PARA REVIEWS
-- =====================================================

-- Usuários podem ver todas as reviews
CREATE POLICY "Users can view all reviews" ON public.reviews
  FOR SELECT USING (true);

-- Usuários podem criar reviews
CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem atualizar/deletar suas próprias reviews
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- =====================================================
-- POLÍTICAS PARA FAVORITES
-- =====================================================

-- Usuários podem ver seus próprios favoritos
CREATE POLICY "Users can view own favorites" ON public.favorites
  FOR SELECT USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem criar favoritos
CREATE POLICY "Users can create favorites" ON public.favorites
  FOR INSERT WITH CHECK (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem deletar seus próprios favoritos
CREATE POLICY "Users can delete own favorites" ON public.favorites
  FOR DELETE USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- =====================================================
-- POLÍTICAS PARA WISHLIST
-- =====================================================

-- Usuários podem ver sua própria lista de desejos
CREATE POLICY "Users can view own wishlist" ON public.wishlist_items
  FOR SELECT USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem criar itens na lista de desejos
CREATE POLICY "Users can create wishlist items" ON public.wishlist_items
  FOR INSERT WITH CHECK (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem atualizar/deletar itens da sua lista
CREATE POLICY "Users can update own wishlist items" ON public.wishlist_items
  FOR UPDATE USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own wishlist items" ON public.wishlist_items
  FOR DELETE USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- =====================================================
-- POLÍTICAS PARA SISTEMA DE AMIGOS
-- =====================================================

-- Usuários podem ver solicitações de amizade relacionadas a eles
CREATE POLICY "Users can view related friend requests" ON public.friend_requests
  FOR SELECT USING (
    senderId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    ) OR receiverId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem enviar solicitações de amizade
CREATE POLICY "Users can send friend requests" ON public.friend_requests
  FOR INSERT WITH CHECK (
    senderId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem atualizar solicitações recebidas (aceitar/rejeitar)
CREATE POLICY "Users can update received friend requests" ON public.friend_requests
  FOR UPDATE USING (
    receiverId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Usuários podem deletar suas solicitações enviadas
CREATE POLICY "Users can delete sent friend requests" ON public.friend_requests
  FOR DELETE USING (
    senderId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- Políticas para amizades confirmadas
CREATE POLICY "Users can view their friendships" ON public.friendships
  FOR SELECT USING (
    profileId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    ) OR friendId IN (
      SELECT id FROM public.profiles WHERE userId = auth.uid()::text
    )
  );

-- =====================================================
-- POLÍTICAS PARA OUTRAS TABELAS
-- =====================================================

-- Categorias são públicas (leitura)
CREATE POLICY "Categories are public" ON public.categories
  FOR SELECT USING (true);

-- Livros são públicos (leitura)
CREATE POLICY "Books are public" ON public.books
  FOR SELECT USING (true);

-- Imagens de anúncios são públicas (leitura)
CREATE POLICY "Listing images are public" ON public.listing_images
  FOR SELECT USING (true);

-- =====================================================
-- ÍNDICES RECOMENDADOS
-- =====================================================

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(userId);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_profile_id ON public.listings(profileId);
CREATE INDEX IF NOT EXISTS idx_listings_book_id ON public.listings(bookId);
CREATE INDEX IF NOT EXISTS idx_listings_location_id ON public.listings(locationId);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON public.books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_title_author ON public.books(title, author);
CREATE INDEX IF NOT EXISTS idx_reviews_profile_id ON public.reviews(profileId);
CREATE INDEX IF NOT EXISTS idx_favorites_profile_id ON public.favorites(profileId);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_profile_id ON public.wishlist_items(profileId);

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================

-- Este arquivo deve ser executado no SQL Editor do Supabase
-- Execute cada seção separadamente se necessário
-- As políticas RLS garantem que usuários só acessem seus próprios dados
-- Os triggers garantem integridade referencial com auth.users
