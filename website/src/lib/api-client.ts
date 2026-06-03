import { getClientApiBase } from './api-base';
import type {
  CartResponse,
  LoginResponse,
  Order,
  Paginated,
  Project,
  User,
} from '@/types';

const BASE = getClientApiBase();

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store', ...init });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Client-only API — use in `'use client'` pages (account, cart, projects). */
export const apiClient = {
  getUser: () => fetchJson<User>('/api/users/me'),
  getCart: () => fetchJson<CartResponse>('/api/cart'),
  getOrders: () => fetchJson<{ data: Order[] }>('/api/orders'),
  login: (email: string, password: string) =>
    fetchJson<LoginResponse>('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
  getProjects: () => fetchJson<Paginated<Project>>('/api/projects'),
  createProject: (body: {
    title?: string;
    templateId?: string;
    width?: number;
    height?: number;
  }) =>
    fetchJson<Project>('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};
