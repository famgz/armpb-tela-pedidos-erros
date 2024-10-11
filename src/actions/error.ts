import { AxiosInstance } from 'axios';

export async function getErrors(api: AxiosInstance) {
  const response = await api.get('');
  return response.data;
}
