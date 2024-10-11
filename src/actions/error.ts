import { ErrorKey } from '@/constants/data';
import { ErrorData, OCCData } from '@/types/data';
import { AxiosInstance, isAxiosError } from 'axios';

function normalizeOCCResponse(data: OCCData[]): ErrorData[] {
  return data.map((item: OCCData) => ({
    data: '', // No equivalent field in OCCData, so leave as empty
    erro: item.motivo || '', // Map 'motivo' to 'erro'
    pedidoId: item.pedido || '', // Map 'pedido' to 'pedidoId'
  }));
}

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
