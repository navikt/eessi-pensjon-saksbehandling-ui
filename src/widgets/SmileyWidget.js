import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'

const SmileyWidget = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
  }, [])

  return <div className='p-3 c-ui-d-SmileyWidget text-center'>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={props.onResize} />
    <h4>{props.widget.title}</h4>
    <p style={{
      fontSize: '100px'
    }}><span role='img' aria-label='smiley'>&#128512;</span></p>
  </div>
}

SmileyWidget.properties = {
  type: 'smiley',
  title: 'Smiley widget',
  description: 'Widget with a 😀',
  layout: {
    lg: { minW: 2, maxW: 4, defaultW: 2, minH: 6, defaultH: 6, maxH: Infinity },
    md: { minW: 1, maxW: 3, defaultW: 1, minH: 6, defaultH: 6, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 6, defaultH: 6, maxH: Infinity }
  },
  options: {}
}

export default SmileyWidget
