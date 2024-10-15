import { ErrorData, ErrorKey } from '@/constants/data';
import getEndpoint from '@/lib/axios';
import { normalizeOCCResponse } from '@/lib/utils';
import { AxiosInstance, isAxiosError } from 'axios';

export async function getErrors(
  errorKey: ErrorKey,
  api: AxiosInstance
): Promise<ErrorData[]> {
  try {
    const response = await api.get('');
    const data = response.data;

    if (errorKey === 'occ') {
      return normalizeOCCResponse(data);
    }
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      // If the error is a 404 Not Found, return an empty array
      if (errorKey === 'occ' && error?.response?.status === 404) {
        return [];
      }
    }
    throw error;
  }
}

export async function updateErrorStatus(
  orderId: string,
  body: { status: string; motivo: string }
) {
  if (!orderId) throw new Error('Id do pedido não pode ser vazio');
  if (!body.motivo) throw new Error('O campo "motivo" não pode ser vazio');
  const api = getEndpoint('base');
  const response = await api.put(`/${orderId}`, body);
  return response.data;
}
