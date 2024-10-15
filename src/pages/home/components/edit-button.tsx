'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ErrorData, updatedErrorStatus } from '@/constants/data';
import { SquarePenIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  errorData: ErrorData;
  onSubmit: (orderId: string, status: string, motivo: string) => void;
}

export default function EditButton({ errorData, onSubmit }: Props) {
  const [obs, setObs] = useState(errorData?.obs || '');

  function handleOnSubmit() {
    onSubmit(errorData.pedidoId, updatedErrorStatus, obs);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={'icon'} className="size-10">
          <SquarePenIcon className="size-6 text-muted" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-[800px] gap-0 bg-background-medium p-0">
        <AlertDialogHeader className="bg-background p-6">
          <AlertDialogTitle className="flex items-start gap-10 font-normal">
            <AlertDialogDescription className="sr-only">
              Modal para edição de obsevação de erro
            </AlertDialogDescription>
            <span>{errorData.data}</span>
            <span>{errorData.pedidoId}</span>
            <span
              className="line-clamp-2 flex-1 text-center"
              title={errorData.erro}
            >
              {errorData.erro}
            </span>
            <AlertDialogCancel className="!-mt-3 -mr-3 size-8 self-start border-none p-1">
              <XIcon
                className="size-5 cursor-pointer text-foreground"
                strokeWidth={3}
              />
            </AlertDialogCancel>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-6 p-6">
          <div>
            <h2>Observação</h2>
            <Textarea
              placeholder="Escrever observação..."
              rows={6}
              className="mt-1 bg-background-light text-xl text-foreground placeholder:font-extralight placeholder:text-foreground/80"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>

          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="px-10 py-3 text-xl">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="px-10 py-3 text-xl"
              onClick={handleOnSubmit}
            >
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
