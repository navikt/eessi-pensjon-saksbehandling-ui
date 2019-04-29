import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import './CatWidget.css'

const CatWidget = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
  }, [])

  return <div className='c-ui-d-catWidget'>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={props.onResize} />
    <img alt='cat' src={require('../resources/images/cat.jpg')} />
  </div>
}

CatWidget.properties = {
  type: 'cat',
  title: 'Cat widget',
  description: 'A 🐈 in a widget',
  layout: {
    lg: { minW: 4, maxW: 6, defaultW: 4, minH: 5, defaultH: 5, maxH: 999 },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 5, defaultH: 5, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 5, defaultH: 5, maxH: 999 }
  },
  options: {
    backgroundColor: 'white'
  }
}

export default CatWidget
