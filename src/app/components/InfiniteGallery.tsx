/* eslint-disable @next/next/no-img-element */
'use client'
import { Button } from '@/lib/components/Button'
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { useEffect, useRef } from 'react'
import { imagesQueryOptions } from '../queries'
import { AdSlot, useAds } from './Ads'

const MANUAL_LIMIT = 5

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

  const { ref: adsContainerRef } = useAds(query)

  return (
    <>
      <div ref={adsContainerRef} className={'photo-gallery'}>
        {query.data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.map((cat, catIndex) => (
              <React.Fragment key={cat.id}>
                <div className="photo-gallery__item">
                  <img
                    className=""
                    src={cat.url}
                    height={cat.height}
                    width={cat.width}
                    loading="lazy"
                    alt="Photo of a cat"
                  />
                </div>
                <AdSlot
                  query={query}
                  pageIndex={pageIndex}
                  catIndex={catIndex}
                />
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
