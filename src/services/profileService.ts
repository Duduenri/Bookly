import { supabase } from './supabase';

export interface Profile {
  id: string;
  userId: string;
  email: string;
  name: string;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
  accountType: 'USER' | 'BOOKSTORE' | 'SECONDHAND_STORE';
  createdAt?: string;
  updatedAt?: string;
}

export async function getProfileByEmail(email: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | null;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
}

export async function updateProfile(id: string, input: UpdateProfileInput): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...input,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}
