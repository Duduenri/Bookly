import { supabase } from './supabase';

export type ListingStatus = 'ACTIVE' | 'SOLD' | 'RENTED' | 'INACTIVE';

export interface ListingItem {
  id: string;
  status: ListingStatus;
  price?: number | null;
  transactionType: 'SALE' | 'EXCHANGE' | 'RENTAL';
  createdAt: string;
  book?: { id: string; title: string; author?: string | null; coverImage?: string | null } | null;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getMyListings(profileId: string, page = 1, pageSize = 10, status?: ListingStatus): Promise<PaginatedResult<ListingItem>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('listings')
    .select('id, status, price, transactionType, createdAt, book:bookId(id,title,author,coverImage)', { count: 'exact' })
    .eq('profileId', profileId)
    .order('createdAt', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    items: (data as any[]) as ListingItem[],
    total: count ?? 0,
    page,
    pageSize,
  };
}
