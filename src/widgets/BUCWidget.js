import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import Buc from 'applications/BUC/widgets/'

const BUCWidget = (props) => {
  const [mounted, setMounted] = useState(false)
  const { onResize } = props

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
      <Buc />
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
  options: {}
}

BUCWidget.propTypes = {
  onResize: PT.func.isRequired
}

export default BUCWidget
