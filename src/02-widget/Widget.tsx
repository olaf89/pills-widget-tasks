import './widget.css'
import useResizeObserver from 'use-resize-observer'
import { useIframeHeight } from './useIframeHeight'

export const Widget = () => {
  const height = useIframeHeight()
  const { ref: containerNode, width: containerWidth } = useResizeObserver<HTMLIFrameElement>({})

  return (
    <div
      className="widget"
      style={{ visibility: height ? 'visible' : 'hidden' }}
    >
      <h1>App content</h1>
      <p>Check out our latest podcast</p>
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
        }}
        ref={containerNode}
      >
        <iframe
          height={height}
          width={containerWidth}
          src="/iframe"
          style={{ border: 0 }}
        />
      </div>
    </div>
  )
}
