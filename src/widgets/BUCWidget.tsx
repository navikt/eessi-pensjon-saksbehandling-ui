import Buc from 'applications/BUC/'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import { WidgetFC, WidgetProps } from 'eessi-pensjon-ui/dist/declarations/Dashboard'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'

const BUCWidget: WidgetFC<WidgetProps> = ({
  onResize, onFullFocus, onRestoreFocus, widget
}: WidgetProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return (
    <div className='w-BucWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      />
      <Buc
        allowFullScreen={_.get(widget, 'options.allowFullScreen')}
        onRestoreFocus={onRestoreFocus}
        onFullFocus={onFullFocus}
      />
    </div>
  )
}

BUCWidget.properties = {
  type: 'buc',
  title: 'BUC widget',
  description: 'Widget for BUC',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {
    allowFullScreen: true
  }
}

BUCWidget.propTypes = {
  onResize: PT.func.isRequired,
  onFullFocus: PT.func.isRequired,
  onRestoreFocus: PT.func.isRequired,
  widget: WidgetPropType.isRequired
}

export default BUCWidget
