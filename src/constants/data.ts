import getEndpoint from '@/lib/axios';

export type ErrorKey = 'protheus' | 'occ' | 'history';

export const errorKeys: ErrorKey[] = ['protheus', 'occ', 'history'];

export interface ErrorData {
  data: string;
  erro: string;
  pedidoId: string;
}

export type ErrorDataKey = keyof ErrorData;

export type OCCData = { motivo: string; pedido: string };

export const errorInfos = {
  protheus: {
    label: 'Protheus',
    api: getEndpoint('protheus'),
    keysToSearch: ['pedidoId', 'data'],
  },
  occ: {
    label: 'OCC',
    api: getEndpoint('occ'),
    keysToSearch: ['pedidoId'],
  },
  history: {
    label: 'Histórico',
    api: getEndpoint('history'),
    keysToSearch: ['pedidoId', 'data'],
  },
};

export const updatedErrorStatus = 'ER'; // "WA" for web & aps | using "ER" will keep the item active
