export interface ErrorData {
  data: string;
  erro: string;
  pedidoId: string;
}

export type ErrorDataKey = keyof ErrorData;
