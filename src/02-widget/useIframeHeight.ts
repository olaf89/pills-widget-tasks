import { useState, useEffect } from 'react'

export type IframeRenderedMessage = {
  type: 'iframe-rendered'
  height: number
}

export function useIframeHeight() {
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const onMessage = (e: MessageEvent<IframeRenderedMessage>) => {
      if (e.data.type === 'iframe-rendered') {
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', onMessage)

    return () => window.removeEventListener('message', onMessage)
  }, [])

  return height
}
