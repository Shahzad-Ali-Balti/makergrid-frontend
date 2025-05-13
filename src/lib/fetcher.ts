// lib/fetcher.ts

export async function fetcher<T>(url: string): Promise<T> {
    const res = await fetch(url);
  
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
  
    return res.json();
  }
  