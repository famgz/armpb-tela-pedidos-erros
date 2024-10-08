import { LoaderIcon } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-center bg-background-500/90 absolute inset-0">
      <LoaderIcon className="size-20 animate-spin text-muted-foreground" />
    </div>
  );
}
