import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import SedList from '../pages/NewFeatures/SedList'

const SedListWidget = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
  }, [])

  return <div className='c-ui-d-SedListWidget'>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={props.onResize} />
    <SedList t={props.t} />
  </div>
}

SedListWidget.properties = {
  type: 'sedlist',
  title: 'SED List widget',
  description: 'Widget with Sed list',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: Infinity },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: Infinity }
  },
  options: {}
}

export default SedListWidget
