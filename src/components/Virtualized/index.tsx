import { cloneElement, JSX, useMemo, useRef, useState } from 'react'
import { useResizeObserver } from 'usehooks-ts'

import './styles.css'

const bufferedItems = 2

export interface WindowProps {
  children: Array<JSX.Element>
  gap?: number
  isVirtualizationEnabled?: boolean
  rowHeight: number
}

const Virtualized: React.FC<WindowProps> = ({
  children,
  gap = 10,
  isVirtualizationEnabled = true,
  rowHeight,
}) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const { height: containerHeight = 120 } = useResizeObserver({
    box: 'border-box',
    ref: containerRef as React.RefObject<HTMLElement>,
  })

  const [scrollPosition, setScrollPosition] = useState(0)

  const onScroll = useMemo(
    () =>
      function (e: React.UIEvent<HTMLUListElement, UIEvent>) {
        setScrollPosition(e.currentTarget.scrollTop)
      },

    []
  )

  const visibleChildren = useMemo(() => {
    if (!isVirtualizationEnabled)
      return children.map((child, index) =>
        cloneElement(child, {
          style: {
            height: rowHeight,
            left: 0,
            lineHeight: `${rowHeight}px`,
            position: 'absolute',
            right: 0,
            top: index * rowHeight + index * gap,
          },
        })
      )
    const startIndex = Math.max(
      Math.floor(scrollPosition / rowHeight) - bufferedItems,
      0
    )
    const endIndex = Math.min(
      Math.ceil((scrollPosition + containerHeight) / rowHeight - 1) +
        bufferedItems,
      children.length - 1
    )

    return children.slice(startIndex, endIndex + 1).map((child, index) =>
      cloneElement(child, {
        style: {
          height: rowHeight,
          left: 0,
          lineHeight: `${rowHeight}px`,
          position: 'absolute',
          right: 0,
          top: (startIndex + index) * rowHeight + index * gap,
        },
      })
    )
  }, [
    children,
    containerHeight,
    rowHeight,
    scrollPosition,
    gap,
    isVirtualizationEnabled,
  ])

  return (
    <ul ref={containerRef} className="container" onScroll={onScroll}>
      {visibleChildren}
    </ul>
  )
}

export default Virtualized
