import { supabase } from './supabase';

export interface FriendProfile {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface FriendItem {
  id: string; // friendship id
  createdAt: string;
  profile: FriendProfile; // the friend profile
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Fetch friendships in both directions and merge them, then paginate client-side
export async function getMyFriends(profileId: string, page = 1, pageSize = 10): Promise<PaginatedResult<FriendItem>> {
  const { data: asOwner, error: err1 } = await supabase
    .from('friendships')
    .select('id, createdAt, friend:friendId(id,name,avatar)')
    .eq('profileId', profileId);

  if (err1) throw err1;

  const { data: asFriend, error: err2 } = await supabase
    .from('friendships')
    .select('id, createdAt, profile:profileId(id,name,avatar)')
    .eq('friendId', profileId);

  if (err2) throw err2;

  const list: FriendItem[] = [];

  (asOwner as any[] | null || []).forEach((row: any) => {
    if (row && row.friend) {
      list.push({ id: row.id, createdAt: row.createdAt, profile: row.friend });
    }
  });

  (asFriend as any[] | null || []).forEach((row: any) => {
    if (row && row.profile) {
      list.push({ id: row.id, createdAt: row.createdAt, profile: row.profile });
    }
  });

  // sort by createdAt desc
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const total = list.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = list.slice(start, end);

  return { items, total, page, pageSize };
}
