import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <h1>Not Found</h1>
      <Button size={'lg'}>
        <Link href="/">Go Home</Link>
      </Button>
    </>
  );
}
