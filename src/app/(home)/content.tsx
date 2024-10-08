'use client';

import { getOCCErrors } from '@/actions/error';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ErrorData } from '@/types/data';
import { useQuery } from '@tanstack/react-query';
import copy from 'clipboard-copy';
import { CopyIcon, SearchIcon, SquarePenIcon } from 'lucide-react';
import { useState } from 'react';

const tabs = ['Protheus', 'OCC', 'Histórico'];
const filterOptions = ['pedido', 'data'];

export default function Home() {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [currentFilterOption, setCurrentFilterOption] = useState(
    filterOptions[0],
  );
  const query = useQuery({
    queryKey: ['dataKey'],
    queryFn: getOCCErrors,
  });

  if (query.error instanceof Error)
    return <div>Error: {query.error.message}</div>;

  async function handleCopyToClipboard(text: string) {
    try {
      await copy(text);
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  }

  return (
    <div className="container flex-1 space-y-12 overflow-hidden rounded-2xl bg-background-medium">
      {/* tabs */}
      <div className="grid grid-cols-3 bg-background">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={cn(
              'rounded-t-2xl bg-background-medium p-4 text-center',
              {
                'bg-background-light shadow-[10px_0_20px_rgba(0,0,0,0.25)]':
                  tab !== currentTab,
              },
            )}
          >
            <p
              onClick={() => setCurrentTab(tab)}
              className="cursor-pointer text-xl font-semibold hover:opacity-90"
            >
              {tab}
            </p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex-center mx-auto max-w-[1200px] gap-4 p-4">
        <div className="flex flex-1 items-center border-b border-muted-foreground">
          <SearchIcon className="size-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por pedido"
            className="no-style text-lg"
          />
        </div>

        <Select
          value={currentFilterOption}
          onValueChange={setCurrentFilterOption}
          defaultValue={currentFilterOption}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue aria-label={currentFilterOption}>
              <span className="capitalize">{currentFilterOption}</span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((op) => (
              <SelectItem value={op} key={op} className="capitalize">
                {op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="px-8 text-xl">Buscar</Button>
      </div>

      {/* error table */}
      <div className="flex flex-col gap-2 p-4">
        {query.isLoading && <Loading />}

        {query.data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-xl font-bold text-foreground">
                  Data
                </TableHead>
                <TableHead className="text-center text-xl font-bold text-foreground">
                  Pedido
                </TableHead>
                <TableHead className="text-center text-xl font-bold text-foreground">
                  Descrição
                </TableHead>
                <TableHead className="text-center text-xl font-bold text-foreground">
                  Editar
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {query.data.map((item: ErrorData) => (
                <TableRow key={item.pedidoId}>
                  <TableCell>{item.data}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="min-w-24">{item.pedidoId}</span>
                      <Button
                        variant={'ghost'}
                        className="size-8 p-1"
                        onClick={() => handleCopyToClipboard(item.pedidoId)}
                      >
                        <CopyIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{item.erro}</TableCell>
                  <TableCell>
                    <Button size={'icon'}>
                      <SquarePenIcon className="size-6 text-muted" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
