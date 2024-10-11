import { getErrors } from '@/actions/error';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { errorInfos, ErrorKey, errorKeys } from '@/constants/data';
import getEndpoint from '@/lib/axios';
import {
  cn,
  convertOrderIdToNumber,
  handleCopyToClipboard,
  reverseStringDate,
} from '@/lib/utils';
import EditButton from '@/pages/home/components/edit-button';
import { ErrorData, ErrorDataKey } from '@/types/data';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  SearchIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type SortDirType = 'asc' | 'desc';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [errorKey, setErrorKey] = useState<ErrorKey>(errorKeys[0]);
  const errorInfo = useMemo(
    () => errorInfos[errorKey as keyof typeof errorInfos],
    [errorKey]
  );
  const [sort, setSort] = useState<ErrorDataKey | undefined>();
  const [sortDir, setSortDir] = useState<SortDirType>('asc');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<ErrorData[]>([]);
  const [paginatedItems, setPaginatedItems] = useState<ErrorData[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const pagination = useMemo(
    () => ({
      start: currentPage * ITEMS_PER_PAGE,
      end: (currentPage + 1) * ITEMS_PER_PAGE,
      total: Math.ceil(items.length / ITEMS_PER_PAGE),
      hasPagination: items.length > ITEMS_PER_PAGE,
    }),
    [currentPage, items]
  );

  const api = getEndpoint(errorKey);

  const query = useQuery({
    queryKey: [errorKey],
    queryFn: () => getErrors(errorKey, api),
  });

  function handleTabChange(errorKey: ErrorKey) {
    setErrorKey(errorKey);
  }

  function handleFilterItems() {
    if (!query.data) return;
    const trimmedSearch = search.trim();
    setItems(
      trimmedSearch
        ? query.data.filter((item: ErrorData) =>
            errorInfo.keysToSearch.some((key) =>
              item[key as keyof ErrorData].includes(trimmedSearch)
            )
          )
        : query.data
    );
  }

  function handleClearSearch() {
    if (search) {
      setSearch('');
      setItems(query.data as ErrorData[]);
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
    }

    setItems((prev) =>
      [...prev].sort((_a, _b) => {
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
      })
    );
    setSortDir(newSortDir);
    setSort(sortType);
    setCurrentPage(0);
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

  useEffect(() => {
    if (query.data) {
      handleFilterItems();
    }
  }, [query.data]);

  useEffect(() => {
    setPaginatedItems(items.slice(pagination.start, pagination.end));
  }, [items, pagination]);

  return (
    <div className="container flex flex-1 flex-col overflow-hidden rounded-b-2xl bg-background-medium">
      {/* tabs */}
      <div className="grid grid-cols-3 bg-background">
        {Object.entries(errorInfos).map(([key, { label }]) => (
          <div
            key={key}
            className={cn(
              '-mr-px rounded-t-2xl border-b border-black/50 bg-background-light p-4 text-center',
              {
                'z-10 border border-b-0 bg-background-medium': key === errorKey,
              }
            )}
          >
            <p
              onClick={() => handleTabChange(key as ErrorKey)}
              className="cursor-pointer text-xl font-semibold hover:text-white/70"
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-6 rounded-b-2xl border border-t-0 border-black/50 pt-6">
        {/* filters */}
        <div className="flex-center mx-auto mt-4 w-full max-w-[700px] gap-4 p-4">
          {/* search field */}
          <div className="flex flex-1 items-center border-b border-muted-foreground">
            <SearchIcon className="size-5 text-muted-foreground" />
            <Input
              placeholder={'Pesquisar'}
              className="no-style text-lg"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
            />
          </div>

          {/* filter button */}
          <Button
            className="px-8 text-xl"
            onClick={handleFilterItems}
            disabled={!query.data}
          >
            Buscar
          </Button>

          {/* reset filter button */}
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
        <div className="flex h-full flex-1 flex-col gap-2">
          {query.isLoading && <Loading />}

          {query.error instanceof Error && (
            <div>Error: {query.error.message}</div>
          )}

          {query.data && (
            <>
              <p className="px-8 text-right text-sm">
                {items.length} items encontrados
              </p>

              <Table>
                <TableHeader className="border-b border-background-light/40">
                  <TableRow>
                    <TableHead
                      className="relative w-[140px] cursor-pointer text-center text-xl font-semibold text-foreground"
                      onClick={() => handleSortItems('data')}
                    >
                      Data
                      {getTableHeaderSortIcon('data')}
                    </TableHead>
                    <TableHead
                      className="relative w-[140px] cursor-pointer text-center text-xl font-semibold text-foreground"
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

                <TableBody>
                  {paginatedItems.map((item: ErrorData, i: number) => (
                    <TableRow
                      key={item.pedidoId}
                      className={cn({
                        'bg-background-light/40': i % 2 === 0,
                      })}
                    >
                      {/* date */}
                      <TableCell align="center">{item.data}</TableCell>

                      {/* order id */}
                      <TableCell align="center">
                        <div className="flex items-center justify-between gap-1">
                          <span>{item.pedidoId}</span>
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

                      {/* description */}
                      <TableCell align="center">{item.erro}</TableCell>

                      {/* edit button */}
                      <TableCell align="center">
                        <EditButton errorData={item} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {!query.isLoading && query.data && items.length === 0 && (
            <div className="flex-center flex-1 py-10">
              <p className="text-center text-xl">Nenhum item encontrado</p>
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="flex-center gap-2.5 pb-10">
          {pagination.hasPagination && (
            <>
              {Array.from({ length: pagination.total }).map((_, i) => (
                <Button
                  key={i}
                  variant={i === currentPage ? 'outline' : 'ghost'}
                  size={'icon'}
                  className="size-11 text-lg shadow-md"
                  onClick={() => handleSetCurrentPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
