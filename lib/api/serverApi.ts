import { api } from './api';
import { cookies } from 'next/headers';
import { Note, FetchNotesResponse } from '@/types/note';
import { User } from '@/types/user';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
}

export const fetchNotes = async (
  search: string = '',
  page: number = 1,
  tag?: string
): Promise<FetchNotesResponse> => {
  const authHeaders = await getAuthHeaders();
  const params: Record<string, string | number> = { search, page, perPage: 12 };
  if (tag && tag !== 'all') params.tag = tag;

  const response = await api.get<FetchNotesResponse>('/notes', {
    ...authHeaders,
    params,
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<Note>(`/notes/${id}`, authHeaders);
  return response.data;
};

export const checkSession = async (): Promise<User | null> => {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<User>('/auth/session', authHeaders);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const authHeaders = await getAuthHeaders();
  const response = await api.get<User>('/users/me', authHeaders);
  return response.data;
};
