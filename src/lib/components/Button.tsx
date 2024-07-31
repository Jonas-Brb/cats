import { cn } from '@/lib/utils/cn'
import React from 'react'

export const Button: React.FC<JSX.IntrinsicElements['button']> = props => (
  <button
    type="button"
    {...props}
    className={cn(
      'rounded border bg-green-400 px-4 py-2',
      'hover:cursor-pointer hover:bg-green-300',
      'focus:outline focus:outline-green-600',
      'disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200',
      props.className,
    )}
  >
    {props.children}
  </button>
)
