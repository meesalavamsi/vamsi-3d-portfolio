import type { ReactNode } from 'react'
import { useInView } from '../lib/hooks'

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'span' | 'section'
}

/** Lightweight scroll reveal — CSS transition only, no JS animation loop. */
export default function Reveal({ children, delay = 0, y = 16, className = '', as = 'div' }: Props) {
  const { ref, seen } = useInView<HTMLDivElement>()
  const Tag = as as 'div'

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.2,0.8,0.2,1) ${delay}ms`,
        willChange: seen ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  )
}
