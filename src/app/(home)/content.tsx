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
import {
  cn,
  convertOrderIdToNumber,
  handleCopyToClipboard,
  reverseStringDate,
} from '@/lib/utils';
import { ErrorData, ErrorDataKey } from '@/types/data';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  SearchIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const tabs = ['Protheus', 'OCC', 'Histórico'];
const filterOptions: ErrorDataKey[] = ['pedidoId', 'data'];

type SortDirType = 'asc' | 'desc';

export default function Home() {
  const hasMounted = useRef(false);
  const paginationRef = useRef<null | HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [currentFilterOption, setCurrentFilterOption] = useState(
    filterOptions[0],
  );
  const [sort, setSort] = useState<ErrorDataKey | undefined>();
  const [sortDir, setSortDir] = useState<SortDirType>('asc');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<ErrorData[]>([]);
  const [croppedItems, setCroppedItems] = useState<ErrorData[]>([]);
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(0);
  const pagination = useMemo(
    () => ({
      start: currentPage * ITEMS_PER_PAGE,
      end: (currentPage + 1) * ITEMS_PER_PAGE,
      total: Math.ceil(items.length / ITEMS_PER_PAGE),
      hasPagination: items.length > ITEMS_PER_PAGE,
    }),
    [currentPage, items.length],
  );

  const query = useQuery({
    queryKey: ['occ-errors'],
    queryFn: getOCCErrors,
    // refetchInterval: 60000,
  });

  function handleFilterItems() {
    if (!query.data) return;
    const trimmedSearch = search.trim();
    setItems(
      trimmedSearch
        ? query.data.filter(
            (item: ErrorData) => item[currentFilterOption] === trimmedSearch,
          )
        : query.data,
    );
  }

  function handleClearSearch() {
    if (search) {
      setSearch('');
      setItems(query.data);
    }
  }

  function getReverseSortDir(): SortDirType {
    return sortDir === 'asc' ? 'desc' : 'asc';
  }

  function handleSortItems(sortType: ErrorDataKey) {
    if (!query.data) return;

    let newSortDir: SortDirType = 'asc';

    if (sortType === sort) {
      newSortDir = getReverseSortDir();
      setSortDir(newSortDir);
    } else {
      setSortDir(newSortDir);
    }

    setSort(sortType);

    setItems((prev) =>
      prev.sort((_a, _b) => {
        let a: string | number = _a[sortType!];
        let b: string | number = _b[sortType!];
        if (sortType === 'data') {
          a = reverseStringDate(a);
          b = reverseStringDate(b);
          if (a < b) return newSortDir === 'asc' ? -1 : 1;
          if (a > b) return newSortDir === 'asc' ? 1 : -1;
          return 0;
        } else {
          a = convertOrderIdToNumber(a);
          b = convertOrderIdToNumber(b);
          return newSortDir === 'asc' ? a - b : b - a;
        }
      }),
    );
  }

  function handleSetCurrentPage(i: number) {
    setCurrentPage(i);
  }

  function getTableHeaderSortIcon(sortType: ErrorDataKey) {
    if (sort !== sortType) return;
    const Icon = sortDir === 'asc' ? ChevronUpIcon : ChevronDownIcon;
    return (
      <div className="absolute right-3 top-3">
        <Icon className="size-4" strokeWidth={3} />
      </div>
    );
  }

  function scrollToPagination() {
    if (paginationRef.current) {
      paginationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end',
      });
    }
  }

  useEffect(() => {
    if (query.data) {
      handleFilterItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  useEffect(() => {
    if (pagination.start > items.length) return;
    setCroppedItems(items.slice(pagination.start, pagination.end));
  }, [items, pagination]);

  useEffect(() => {
    if (!hasMounted.current) {
      // On the first render, set hasMounted to true but don't scroll
      hasMounted.current = true;
    } else if (pagination.hasPagination) {
      scrollToPagination();
    }
  }, [pagination]);

  return (
    <div className="container flex flex-1 flex-col gap-10 overflow-hidden rounded-2xl bg-background-medium">
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
              className="cursor-pointer text-xl font-semibold hover:text-white/70"
            >
              {tab}
            </p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex-center mx-auto w-full max-w-[1200px] gap-4 p-4">
        {/* campo de busca */}
        <div className="flex flex-1 items-center border-b border-muted-foreground">
          <SearchIcon className="size-5 text-muted-foreground" />
          <Input
            placeholder={`Pesquisar por ${currentFilterOption}`}
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
        <Button
          className="px-8 text-xl"
          onClick={handleFilterItems}
          disabled={!query.data}
        >
          Buscar
        </Button>

        {/* botão resetar */}
        <Button
          className="px-8 text-xl"
          variant={'outline'}
          onClick={handleClearSearch}
          disabled={!query.data}
        >
          Limpar
        </Button>
      </div>

      {/* table */}
      <div className="relative flex flex-1 flex-col gap-2">
        {query.isLoading && <Loading />}

        {query.error instanceof Error && (
          <div>Error: {query.error.message}</div>
        )}

        {query.data && (
          <>
            <p className="px-8 text-right text-sm">
              Mostrando {croppedItems.length} de {items.length} items
            </p>

            <Table className="h-full">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="relative w-[190px] cursor-pointer text-center text-xl font-semibold text-foreground"
                    onClick={() => handleSortItems('data')}
                  >
                    Data
                    {getTableHeaderSortIcon('data')}
                  </TableHead>
                  <TableHead
                    className="relative w-[190px] cursor-pointer text-center text-xl font-semibold text-foreground"
                    onClick={() => handleSortItems('pedidoId')}
                  >
                    Pedido
                    {getTableHeaderSortIcon('pedidoId')}
                  </TableHead>
                  <TableHead className="text-center text-xl font-semibold text-foreground">
                    Descrição
                  </TableHead>
                  <TableHead className="w-[120px] text-center text-xl font-semibold text-foreground">
                    Editar
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="relative">
                {items
                  .slice(
                    currentPage * ITEMS_PER_PAGE,
                    (currentPage + 1) * ITEMS_PER_PAGE,
                  )
                  .map((item: ErrorData, i: number) => (
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
                        <div className="flex-center gap-1">
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
                      <TableCell align="center">{item.erro}</TableCell>
                      {/* ações */}
                      <TableCell align="center" className="px-8">
                        <EditButton errorData={item} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </>
        )}

        {!query.isLoading && query.data && items.length === 0 && (
          <div className="flex-center flex-1">
            <p className="text-center text-xl">Nenhum item encontrado</p>
          </div>
        )}
      </div>

      {/* pagination */}
      <div className="flex-center gap-2.5 pb-10" ref={paginationRef}>
        {pagination.hasPagination && (
          <>
            {Array.from({ length: pagination.total }).map((_, i) => (
              <Button
                key={i}
                variant={i === currentPage ? 'outline' : 'ghost'}
                size={'icon'}
                className="size-11 text-lg"
                onClick={() => handleSetCurrentPage(i)}
              >
                {i + 1}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
