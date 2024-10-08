import api from '@/lib/axios';

export async function getOCCErrors() {
  const response = await api.get('');
  return response.data;
}
