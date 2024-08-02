/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useLayoutEffect, useRef } from 'react'
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

  useLayoutEffect(() => {
    ref.current?.querySelectorAll('.ad-slot:empty').forEach(adSlot => {
      if (!cache.current.includes(adSlot.id)) {
        cache.current.push(adSlot.id)

        googletag.cmd.push(() => {
          const slot = googletag
            .defineSlot(
              '/6355419/Travel/Europe/France/Paris',
              // if continous width/height was supported we could use the ad container square dimnesions to set ad dimensions on request.
              // if discrete width/height was supported that cover multiple ad container square dimensions we could use the ad container square dimensions to set ad dimensions on request.
              // ads would need to be cleared and added again on window resize both for fixed ad size and responsive ad size mode.
              // ads do not get updated on window resize automatically because they are set on initial ad request.
              // window resize watcher would need to be debounced because ads cannot be requested too frequently.
              [
                100 ?? document.getElementById(adSlot.id)?.clientWidth,
                100 ?? document.getElementById(adSlot.id)?.clientHeight,
              ],
              adSlot.id,
            )!
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
