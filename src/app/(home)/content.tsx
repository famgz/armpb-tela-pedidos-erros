'use client';

import { getOCCErrors } from '@/actions/error';
import EditButton from '@/app/(home)/_components/edit-button';
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
import { cn, handleCopyToClipboard } from '@/lib/utils';
import { ErrorData, ErrorDataKey } from '@/types/data';
import { useQuery } from '@tanstack/react-query';
import { CopyIcon, SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const tabs = ['Protheus', 'OCC', 'Histórico'];
const filterOptions: ErrorDataKey[] = ['pedidoId', 'data'];

export default function Home() {
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [currentFilterOption, setCurrentFilterOption] = useState(
    filterOptions[0],
  );
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);

  const query = useQuery({
    queryKey: ['dataKey'],
    queryFn: getOCCErrors,
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (query.data) {
      setItems(query.data);
    }
  }, [query.data]);

  function handleFilterItems() {
    const trimmedSearch = search.trim();
    if (!(trimmedSearch && query.data)) return;
    setItems(
      query.data.filter(
        (item: ErrorData) => item[currentFilterOption] === trimmedSearch,
      ),
    );
  }

  function handleClearSearch() {
    setSearch('');
    setItems(query.data);
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
                'bg-background-light': tab !== currentTab,
              },
            )}
          >
            <p
              onClick={() => setCurrentTab(tab)}
              className="cursor-pointer text-xl font-semibold hover:text-muted/80"
            >
              {tab}
            </p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex-center mx-auto max-w-[1200px] gap-4 p-4">
        {/* campo de busca */}
        <div className="flex flex-1 items-center border-b border-muted-foreground">
          <SearchIcon className="size-5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por pedido"
            className="no-style text-lg"
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>

        {/* tipo de busca */}
        <Select
          value={currentFilterOption}
          onValueChange={(value: ErrorDataKey) => setCurrentFilterOption(value)}
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

        {/* botão filtrar */}
        <Button className="px-8 text-xl" onClick={handleFilterItems}>
          Buscar
        </Button>

        {/* botão resetar */}
        <Button
          className="px-8 text-xl"
          variant={'outline'}
          onClick={handleClearSearch}
        >
          Limpar
        </Button>
      </div>

      {/* table */}
      <div className="flex flex-col gap-2">
        {query.isLoading && <Loading />}

        {query.error instanceof Error && (
          <div>Error: {query.error.message}</div>
        )}

        {items.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center text-xl font-semibold text-foreground">
                  Data
                </TableHead>
                <TableHead className="text-center text-xl font-semibold text-foreground">
                  Pedido
                </TableHead>
                <TableHead className="text-center text-xl font-semibold text-foreground">
                  Descrição
                </TableHead>
                <TableHead className="text-center text-xl font-semibold text-foreground">
                  Editar
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item: ErrorData, i: number) => (
                <TableRow
                  key={item.pedidoId}
                  className={cn({
                    'bg-background-light/40': i % 2 === 0,
                  })}
                >
                  {/* data */}
                  <TableCell align="center" className="px-8">
                    {item.data}
                  </TableCell>
                  {/* pedido id */}
                  <TableCell align="center">
                    <div className="flex items-center gap-1">
                      <span className="min-w-24">{item.pedidoId}</span>
                      <Button
                        variant={'ghost'}
                        className="size-8 p-1"
                        onClick={() => handleCopyToClipboard(item.pedidoId)}
                        title="Copiar id pedido"
                      >
                        <CopyIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                  {/* descrição */}
                  <TableCell>{item.erro}</TableCell>
                  {/* ações */}
                  <TableCell align="center" className="px-8">
                    <EditButton errorData={item} />
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
