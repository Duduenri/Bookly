import { supabase } from './supabase';

export interface FavoriteItem {
  id: string;
  createdAt: string;
  bookId?: string | null;
  listingId?: string | null;
  bookstoreId?: string | null;
  secondhandStoreId?: string | null;
  // Expanded (optional):
  book?: { id: string; title: string } | null;
  listing?: { id: string } | null;
  bookstore?: { id: string; name: string } | null;
  secondhandStore?: { id: string; name: string } | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getMyFavorites(profileId: string, page = 1, pageSize = 10): Promise<PaginatedResult<FavoriteItem>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('favorites')
    .select('id, createdAt, bookId, listingId, bookstoreId, secondhandStoreId, book:bookId(id,title), listing:listingId(id), bookstore:bookstoreId(id,name), secondhandStore:secondhandStoreId(id,name)', { count: 'exact' })
    .eq('profileId', profileId)
    .order('createdAt', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    items: (data as any[]) as FavoriteItem[],
    total: count ?? 0,
    page,
    pageSize,
  };
}
