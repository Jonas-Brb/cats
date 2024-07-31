'use client'
import { Button } from '@/lib/components/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <>
      <h2 className="text-3xl">Something went wrong!</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </>
  )
}
