import { ErrorData, OCCData } from '@/constants/data';
import copy from 'clipboard-copy';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleCopyToClipboard(text: string) {
  try {
    await copy(text);
    toast.success(`ID do pedido ${text} copiado`, {
      classNames: {
        title: 'font-normal text-foreground',
        toast: 'bg-background-medium border border-background/50',
      },
    });
  } catch (error) {
    console.error(`Erro ao copiar o texto ${text}`, error);
  }
}

export function reverseStringDate(date: string) {
  return date.split('/').reverse().join('/');
}

export function convertOrderIdToNumber(orderId: string) {
  return Number(orderId.replace('o', ''));
}

export function normalizeOCCResponse(data: OCCData[]): ErrorData[] {
  return data.map((item: OCCData) => ({
    data: '',
    erro: item.motivo || '',
    pedidoId: item.pedido || '',
  }));
}
