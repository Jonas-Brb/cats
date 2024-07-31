/* eslint-disable @next/next/no-img-element */
'use client'
import { Button } from '@/lib/components/Button'
import { cn } from '@/lib/utils/cn'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { ImagesQuery, imagesQueryOptions } from '../queries'

const MANUAL_LIMIT = 3

export const InfiniteGallery: React.FC = () => {
  const query = useInfiniteQuery(imagesQueryOptions)

  const isManualFetch = query.data?.pageParams.at(-1)?.page === MANUAL_LIMIT

  const observerTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isManualFetch && query.hasNextPage && !query.isFetchingNextPage) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            query.fetchNextPage()
          }
        },
        { threshold: 0.25, rootMargin: '0px 0px 1000px 0px' },
      )
      observer.observe(observerTargetRef.current!)

      return () => observer.disconnect()
    }
  }, [isManualFetch, query])

  return (
    <>
      <div className="mx-auto grid w-full grid-cols-1 place-items-center gap-4 2xl:container sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {query.data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.map((cat, catIndex) => (
              <React.Fragment key={cat.id}>
                <div className={'relative w-full sm:h-0 sm:[padding-top:100%]'}>
                  <div className="w-full sm:absolute sm:inset-0">
                    <img
                      className="m-auto h-full sm:w-full sm:object-contain"
                      src={cat.url}
                      height={cat.height}
                      width={cat.width}
                      loading="lazy"
                      alt="Photo of a cat"
                    />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={observerTargetRef} />
      {query.isFetchingNextPage && (
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-400 border-t-transparent" />
      )}
      {isManualFetch && !query.isFetchingNextPage && (
        <Button
          disabled={!query.hasNextPage || query.isFetchingNextPage}
          onClick={() => query.fetchNextPage()}
        >
          Load more cats
        </Button>
      )}
    </>
  )
}
