import Journalføring from 'applications/Journalføring'
import { WidgetFC, WidgetProps } from '@navikt/dashboard'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'

const JournalføringWidget: WidgetFC<WidgetProps> = ({
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
    <div className='w-JournalføringWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      >
        <Journalføring widget={widget} onUpdate={onUpdate} />
      </ReactResizeDetector>
    </div>
  )
}

JournalføringWidget.properties = {
  type: 'journalføring',
  title: 'Journalføring widget',
  description: 'Widget for journalføring',
  layout: {
    lg: { minW: 3, maxW: 12, defaultW: 6, minH: 1, defaultH: 1, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 1, defaultH: 1, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 1, defaultH: 1, maxH: 999 }
  },
  options: {
    collapsed: true
  }
}

JournalføringWidget.propTypes = {
  widget: PT.any.isRequired// WidgetPropType.isRequired
}

export default JournalføringWidget
