import { WidgetFC, WidgetProps } from 'eessi-pensjon-ui/dist/declarations/Dashboard'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import VarslerPanel from 'widgets/Varsler/VarslerPanel'

const VarslerWidget: WidgetFC<WidgetProps> = (props: WidgetProps): JSX.Element => {
  const { onResize } = props
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return (
    <div className='w-varslerWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      />
      <VarslerPanel {...props} />
    </div>
  )
}

VarslerWidget.properties = {
  type: 'varsler',
  title: 'Varsler widget',
  description: 'Varsler widget',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 12, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 3, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {
    collapsed: true
  }
}

VarslerWidget.propTypes = {
  onResize: PT.func.isRequired
}

export default VarslerWidget
