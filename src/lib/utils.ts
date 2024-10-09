import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import copy from 'clipboard-copy';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function handleCopyToClipboard(text: string) {
  try {
    await copy(text);
    toast.success(`Pedido ${text} copiado`, {
      classNames: {
        title: 'font-normal text-foreground',
        toast: 'bg-background-medium',
      },
    });
  } catch (error) {
    console.error('Failed to copy text to clipboard', error);
  }
}
