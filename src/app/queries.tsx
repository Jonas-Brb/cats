import {
  DefaultError,
  InfiniteData,
  infiniteQueryOptions,
  QueryKey,
  UseInfiniteQueryResult,
} from '@tanstack/react-query'
import { Cat } from './types'

type PagePram = {
  page: number
  limit?: number
}

export const imagesQueryOptions = infiniteQueryOptions<
  Cat[],
  DefaultError,
  InfiniteData<Cat[], PagePram>,
  QueryKey,
  PagePram
>({
  queryKey: [
    'images',
    process.env.NEXT_PUBLIC_API_KEY,
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ],
  queryFn: async context => {
    const urlSearchParams = new URLSearchParams({
      limit: (context.pageParam.limit ?? 25).toString(),
      order: 'DESC',
      page: (context.pageParam.page ?? 1).toString(),
    })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/images/search?${urlSearchParams}`,
      {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
        },
      },
    )
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return response.json() as unknown as Cat[]
  },
  initialPageParam: { limit: 25, page: 1 },
  getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => ({
    ...lastPageParam,
    page: lastPageParam.page + 1,
  }),
})

export type ImagesQuery = UseInfiniteQueryResult<
  InfiniteData<Cat[], PagePram>,
  DefaultError
>
