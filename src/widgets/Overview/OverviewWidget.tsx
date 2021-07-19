import { WidgetFC, WidgetProps } from 'nav-dashboard'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import Overview from './Overview'

const OverviewWidget: WidgetFC<WidgetProps> = ({
  onResize, onUpdate, widget
}: WidgetProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return (
    <div data-test-id='w-OverviewWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        refreshMode='debounce'
        refreshRate={50}
        onResize={onResize}
      >
        <Overview onUpdate={onUpdate} widget={widget} />
      </ReactResizeDetector>
    </div>
  )
}

OverviewWidget.properties = {
  type: 'overview',
  title: 'Overview widget',
  description: 'Widget with overview info',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {
    collapsed: false
  }
}

OverviewWidget.propTypes = {
  onResize: PT.func.isRequired,
  onUpdate: PT.func.isRequired,
  widget: PT.any.isRequired // WidgetPropType.isRequired
}

export default OverviewWidget
