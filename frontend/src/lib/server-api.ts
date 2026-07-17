const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://wallscapebd.onrender.com';

export async function serverFetch<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Server fetch failed: ${res.status} for ${endpoint}`);
  return res.json();
}
