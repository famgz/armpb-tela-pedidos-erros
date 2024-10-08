'use client';

import { getOCCErrors } from '@/actions/error';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ErrorData } from '@/types/data';
import { useQuery } from '@tanstack/react-query';
import { CopyIcon, SearchIcon } from 'lucide-react';
import copy from 'clipboard-copy';

export default function Home() {
  const query = useQuery({
    queryKey: ['dataKey'],
    queryFn: getOCCErrors,
  });

  const keys = ['data', 'erro', 'pedidoId'];

  if (query.error instanceof Error)
    return <div>Error: {query.error.message}</div>;

  console.log(query.data);

  async function handleCopyToClipboard(text: string) {
    try {
      await copy(text);
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  }

  return (
    <div className="container p-4">
      <div className="flex flex-col gap-2">
        {query.isLoading && <Loading />}

        {query.data &&
          query.data.map((item: ErrorData) => (
            <div key={item.pedidoId}>
              {item.pedidoId}
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={() => handleCopyToClipboard(item.pedidoId)}
              >
                <CopyIcon className="size-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}
