import { useLayoutEffect, useRef } from 'react'

/** Fit the longest word to the actual card width, including loaded web fonts. */
export function RoleName({
  name,
  className,
  as: Heading = 'h1',
}: {
  name: string
  className?: string
  as?: 'h1' | 'h2'
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  useLayoutEffect(() => {
    const heading = ref.current
    if (!heading) return
    let disposed = false
    const fit = () => {
      if (disposed || !heading.clientWidth) return
      heading.style.fontSize = ''
      const size = parseFloat(getComputedStyle(heading).fontSize)
      const widest = Math.max(
        ...Array.from(
          heading.children,
          (word) => word.getBoundingClientRect().width,
        ),
      )
      if (widest > heading.clientWidth) {
        heading.style.fontSize = `${(size * heading.clientWidth) / widest}px`
      }
    }
    fit()
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(fit)
    observer?.observe(heading)
    document.fonts?.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => {
      disposed = true
      observer?.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [name])
  return (
    <Heading
      ref={ref}
      className={`role-card-name font-tarot font-bold text-center uppercase mb-2 ${className ?? ''}`}
    >
      {name.split(/\s+/).map((word, index) => (
        <span key={index}>
          {index > 0 && ' '}
          <span className='inline-block whitespace-nowrap'>{word}</span>
        </span>
      ))}
    </Heading>
  )
}
