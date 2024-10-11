import getEndpoint from '@/lib/axios';

export const errorInfos = {
  protheus: {
    label: 'Protheus',
    api: getEndpoint('protheus'),
    keysToSearch: ['pedidoId', 'data'],
  },
  occ: {
    label: 'OCC',
    api: getEndpoint('occ'),
    keysToSearch: ['pedidoId', 'data'],
  },
  history: {
    label: 'Histórico',
    api: getEndpoint('protheus'),
    keysToSearch: ['pedidoId', 'data'],
  },
};

export const errorKeys = Object.keys(errorInfos);
