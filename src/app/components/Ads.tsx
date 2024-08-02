/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useRef } from 'react'
import { ImagesQuery } from '../queries'

const everyNthSlotAdPredicate = (
  query: ImagesQuery,
  pageIndex: number,
  pictureIndex: number,
) =>
  query.data &&
  (query.data.pages.slice(0, pageIndex).flat().length + (pictureIndex + 1)) %
    3 ===
    0

const firstNthInPageSlotAdPredicate = (
  query: ImagesQuery,
  pageIndex: number,
  pictureIndex: number,
) => pictureIndex + 1 === 3

const getIsAdSlot = (
  query: ImagesQuery,
  pageIndex: number,
  pictureIndex: number,
) => firstNthInPageSlotAdPredicate(query, pageIndex, pictureIndex)

const getAdSlotId = (id: string) => `native-ad-${id}`

// required for react strict mode so as not to call googletag.cmd.push twice on initial render
const cache = { current: new Array<string>() }

export const useAds = (query: ImagesQuery) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.querySelectorAll('.ad-slot:empty').forEach(adSlot => {
      if (!cache.current.includes(adSlot.id)) {
        cache.current.push(adSlot.id)
        googletag.cmd.push(() => {
          const slot = googletag
            .defineSlot('/6355419/Travel', ['fluid'], adSlot.id)!
            .addService(googletag.pubads())

          googletag.display(slot)
        })
      }
    })
  }, [query.data?.pages])

  return { ref }
}

export const AdSlot: React.FC<{
  query: ImagesQuery
  pageIndex: number
  catIndex: number
}> = ({ query, pageIndex, catIndex }) => {
  return (
    getIsAdSlot(query, pageIndex, catIndex) && (
      <div className="ad-container">
        <div
          id={getAdSlotId(`${pageIndex}-${catIndex}`)}
          className="ad-slot"
        ></div>
      </div>
    )
  )
}
