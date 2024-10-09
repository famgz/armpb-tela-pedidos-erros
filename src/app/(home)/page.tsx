import { getOCCErrors } from '@/actions/error';
import Home from '@/app/(home)/content';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function ErrorsHomePage() {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ['occ-errors'],
  //   queryFn: getOCCErrors,
  // });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home />
    </HydrationBoundary>
  );
}
