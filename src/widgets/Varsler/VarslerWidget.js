import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import VarslerPanel from './VarslerPanel'

const VarslerWidget = (props) => {
  const { onResize } = props
  const [mounted, setMounted] = useState(false)

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
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {}
}

VarslerWidget.propTypes = {
  onResize: PT.func.isRequired
}

export default VarslerWidget
