import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import ReactResizeDetector from 'react-resize-detector'
import Buc from 'applications/BUC/'

const BUCWidget = ({ onResize, onFullFocus, onRestoreFocus, widget }) => {
  const [mounted, setMounted] = useState(false)

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
  widget: PT.object
}

export default BUCWidget
