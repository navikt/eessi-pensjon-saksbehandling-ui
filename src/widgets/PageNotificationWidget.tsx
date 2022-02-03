import PageNotification from 'applications/PageNotification'
import { WidgetFC, WidgetProps } from '@navikt/dashboard'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'

const PageNotificationWidget: WidgetFC<WidgetProps> = ({
  onUpdate, onResize, widget
}: WidgetProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return (
    <div className='w-PageNotificationWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      >
        <PageNotification widget={widget} onUpdate={onUpdate} />
      </ReactResizeDetector>
    </div>
  )
}

PageNotificationWidget.properties = {
  type: 'pagenotification',
  title: 'Page Notification widget',
  description: 'Widget for page notification',
  layout: {
    lg: { minW: 3, maxW: 6, defaultW: 6, minH: 1, defaultH: 1, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 1, defaultH: 1, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 1, defaultH: 1, maxH: 999 }
  },
  options: {
    collapsed: true
  }
}

PageNotificationWidget.propTypes = {
  widget: PT.any.isRequired// WidgetPropType.isRequired
}

export default PageNotificationWidget
