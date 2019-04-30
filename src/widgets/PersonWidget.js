import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import Person from '../applications/NewFeatures/Person'

const PersonWidget = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
  }, [])

  return <div className='c-ui-d-PersonWidget'>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={props.onResize} />
    <Person t={props.t} />
  </div>
}

PersonWidget.properties = {
  type: 'person',
  title: 'Person widget',
  description: 'Widget with person info',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {}
}

export default PersonWidget
