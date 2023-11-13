import React, { useEffect, useRef, useState } from 'react'
import { PillData } from './data'
import { Pill } from './Pill'
import useResizeObserver from 'use-resize-observer'

interface PillsProps {
  pills: PillData[]
  headers: string[] // ids of pills that are toggled on
  toggleHeader: (id: string) => void
}

interface LayoutBreakElement {
  index: string
  type: 'line-break'
}

interface LayoutPillElement {
  index: string
  type: 'pill'
  pill: PillData
}

type LayoutElement = LayoutBreakElement | LayoutPillElement

type LayoutConfig = {
  items: LayoutElement[]
  ready: boolean
}

export function Pills({ pills, headers, toggleHeader }: PillsProps) {
  const [pillHeaderWidth, setPillHeaderWidth] = useState(0)
  const { ref: containerNode, width: containerWidth } = useResizeObserver<HTMLDivElement>({})
  const pillRefs = React.useRef<{ [id: PillData['id']]: HTMLDivElement }>({})
  const [layoutElements, setLayoutElements] = React.useState<LayoutConfig>(() => {
    return {
      ready: false,
      items: pills.map(pill => ({
        index: pill.id,
        type: 'pill',
        pill: pill,
      })),
    }
  })

  useEffect(() => {
    if (!containerWidth || !pillHeaderWidth) return

    setLayoutElements({
      ready: true,
      items: pills.reduce((current, pill) => {
        const layoutPill: LayoutPillElement = {
          index: pill.id,
          type: 'pill',
          pill: pill,
        }

        const currentRowPills: LayoutPillElement[] = [
          ...(current.slice(
            findLastIndex(current, pill => pill.type === 'line-break') + 1
          ) as LayoutPillElement[]),
          layoutPill,
        ]

        const requiredRowWidth = currentRowPills
          .map(
            pill =>
              pillRefs.current[pill.pill.id].getBoundingClientRect().width +
              (headers.includes(pill.pill.id) ? 0 : pillHeaderWidth)
          )
          .reduce((a, b) => a + b, 0)

        return [
          ...current,
          ...(requiredRowWidth > containerWidth
            ? [
                {
                  index: `line-break-${layoutPill.pill.id}`,
                  type: 'line-break',
                } as LayoutBreakElement,
              ]
            : []),
          layoutPill,
        ]
      }, [] as LayoutElement[]),
    })
  }, [pills, containerWidth, headers, pillHeaderWidth])

  const setPillRef = (id: PillData['id'], node: HTMLDivElement) => {
    if (node) {
      pillRefs.current[id] = node
    }
  }

  return (
    <div
      ref={containerNode}
      style={{ visibility: layoutElements.ready ? 'visible' : 'hidden' }}
    >
      {layoutElements.items.map(el => {
        if (el.type === 'line-break') {
          return <br key={`__${el.type}-${el.index}`} />
        } else {
          return (
            <Pill
              key={el.pill.id}
              header={headers.includes(el.pill.id)}
              onClick={() => {
                toggleHeader(el.pill.id)
              }}
              ref={element => element && setPillRef(el.pill.id, element)}
            >
              {el.pill.value}
            </Pill>
          )
        }
      })}
      {/* Need to render element to measure the header, would be easier to have fixed width  */}
      {!pillHeaderWidth && (
        <PillHeaderWidthMeasurer
          onMeasure={pillHeaderWidth => setPillHeaderWidth(pillHeaderWidth)}
        />
      )}
    </div>
  )
}

function PillHeaderWidthMeasurer({ onMeasure }: { onMeasure: (width: number) => void }) {
  const withoutHeader = useRef<HTMLDivElement>(null)
  const withHeader = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!withHeader.current || !withoutHeader.current) return

    onMeasure(
      withHeader.current?.getBoundingClientRect()?.width -
        withoutHeader.current?.getBoundingClientRect()?.width
    )
  }, [onMeasure])

  return (
    <div style={{ visibility: 'hidden', position: 'fixed', zIndex: -1 }}>
      <Pill
        ref={withHeader}
        header
        children=" "
      />
      <Pill
        ref={withoutHeader}
        header={false}
        children=" "
      />
    </div>
  )
}

// from https://stackoverflow.com/questions/40929260/find-last-index-of-element-inside-array-by-certain-condition
export function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length
  while (l--) {
    if (predicate(array[l], l, array)) return l
  }
  return -1
}
