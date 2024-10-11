import { ErrorData, ErrorKey } from '@/constants/data';
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
