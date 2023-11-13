import { useEffect } from 'react'
import useResizeObserver from 'use-resize-observer'
import { IframeRenderedMessage } from './useIframeHeight'

export const IframeApp = () => {
  const { ref, height } = useResizeObserver<HTMLIFrameElement>({
    box: 'border-box',
  })

  useEffect(() => {
    if (height) {
      const message: IframeRenderedMessage = {
        type: 'iframe-rendered',
        // We need to get full height of the iframe including default html margin
        height: document.documentElement.getBoundingClientRect().height,
      }

      parent.postMessage(message)
    }
  }, [height])

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: 'rebeccapurple',
        color: 'white',
        padding: '2rem',
        borderRadius: '1rem',
        fontSize: '2rem',
      }}
    >
      Dynamic marketing content will be here
    </div>
  )
}
