import type { PropsWithChildren } from 'react'
import { useInViewport } from '../../hooks/useInViewport'

type RevealOnScrollProps = PropsWithChildren<{
  className?: string
}>

function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const { ref, inView } = useInViewport<HTMLDivElement>()
  const classes = ['reveal', className, inView && 'is-visible']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} ref={ref}>
      {children}
    </div>
  )
}

export default RevealOnScroll