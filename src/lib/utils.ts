import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import copy from 'clipboard-copy';
import { toast } from 'sonner';
import { ErrorData, OCCData } from '@/constants/data';

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
    console.error('Failed to copy text to clipboard', error);
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
