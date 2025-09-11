import { supabase } from './supabase';

export interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
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

export async function getMyReviews(profileId: string, page = 1, pageSize = 10): Promise<PaginatedResult<ReviewItem>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from('reviews')
    .select('id, rating, comment, createdAt, book:bookId(id,title), listing:listingId(id), bookstore:bookstoreId(id,name), secondhandStore:secondhandStoreId(id,name)', { count: 'exact' })
    .eq('profileId', profileId)
    .order('createdAt', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    items: (data as any[]) as ReviewItem[],
    total: count ?? 0,
    page,
    pageSize,
  };
}
