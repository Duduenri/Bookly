import { supabase } from './supabase';

export interface WishlistItem {
  id: string;
  createdAt: string;
  notes?: string | null;
  bookId?: string | null;
  listingId?: string | null;
  title?: string | null;
  author?: string | null;
  isbn?: string | null;
  book?: { id: string; title: string } | null;
  listing?: { id: string } | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getMyWishlist(profileId: string, page = 1, pageSize = 10): Promise<PaginatedResult<WishlistItem>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('wishlist_items')
    .select('id, createdAt, notes, bookId, listingId, title, author, isbn, book:bookId(id,title), listing:listingId(id)', { count: 'exact' })
    .eq('profileId', profileId)
    .order('createdAt', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    items: (data as any[]) as WishlistItem[],
    total: count ?? 0,
    page,
    pageSize,
  };
}
