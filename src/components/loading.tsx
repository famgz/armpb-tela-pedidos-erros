import { LoaderIcon } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-center size-full flex-1">
      <LoaderIcon className="size-20 animate-spin text-muted-foreground" />
    </div>
  );
}
