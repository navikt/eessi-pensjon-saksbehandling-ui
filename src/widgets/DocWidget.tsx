import Doc from 'applications/Doc/'
import { WidgetFC, WidgetProps } from 'nav-dashboard'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'

const DocWidget: WidgetFC<WidgetProps> = ({
  onResize
}: WidgetProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return (
    <div className='w-DocWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      >
        <Doc/>
      </ReactResizeDetector>
    </div>
  )
}

DocWidget.properties = {
  type: 'doc',
  title: 'Doc widget',
  description: 'Widget for Doc',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {}
}

DocWidget.propTypes = {
  widget: PT.any.isRequired// WidgetPropType.isRequired
}

export default DocWidget
