import './widget.css'
import { useIframeHeight } from './useIframeHeight'

export const Widget = () => {
  const height = useIframeHeight()

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
      >
        <iframe
          height={height}
          width="100%"
          src="/iframe"
          style={{ border: 0 }}
        />
      </div>
    </div>
  )
}
