import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { InfiniteGallery } from './components/InfiniteGallery'
import { imagesQueryOptions } from './queries'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery(imagesQueryOptions)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InfiniteGallery />
    </HydrationBoundary>
  )
}
