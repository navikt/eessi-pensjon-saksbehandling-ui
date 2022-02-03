import S3Inventory from 'applications/S3Inventory'
import { WidgetFC, WidgetProps } from '@navikt/dashboard'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'

const S3InventoryWidget: WidgetFC<WidgetProps> = ({
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
        <S3Inventory widget={widget} onUpdate={onUpdate} />
      </ReactResizeDetector>
    </div>
  )
}

S3InventoryWidget.properties = {
  type: 's3inventory',
  title: 'S3 Inventory widget',
  description: 'Widget for S3 inventory',
  layout: {
    lg: { minW: 3, maxW: 6, defaultW: 6, minH: 1, defaultH: 1, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 1, defaultH: 1, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 1, defaultH: 1, maxH: 999 }
  },
  options: {
    collapsed: true
  }
}

S3InventoryWidget.propTypes = {
  widget: PT.any.isRequired// WidgetPropType.isRequired
}

export default S3InventoryWidget
