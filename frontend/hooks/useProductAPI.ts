import { useState, useCallback } from 'react';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');
}

const API_ORIGIN = API_BASE_URL.replace(/\/shop\/?$/, '');

export const useProductAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProduct = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_ORIGIN}/api/${productId}/`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProducts = useCallback(async (page = 1, filters: Record<string, any> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: page.toString(), ...filters });
      const response = await fetch(`${API_ORIGIN}/api/?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getProduct, getProducts, loading, error };
};
