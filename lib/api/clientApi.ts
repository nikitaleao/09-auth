import { api } from './api';
import { Note, NewNote, FetchNotesResponse } from '@/types/note';
import { User } from '@/types/user';

export const fetchNotes = async (
  search: string = '',
  page: number = 1,
  tag?: string
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    search,
    page,
    perPage: 12,
  };

  if (tag && tag !== 'all') {
    params.tag = tag;
  }

  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const response = await api.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (data: Record<string, string>): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);
  return response.data;
};

export const login = async (data: Record<string, string>): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const response = await api.get<User>('/auth/session');
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
};
