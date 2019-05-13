import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import './CatMidget.css'

const CatMidget = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
  }, [])

  return <div className='c-ui-d-catMidget'>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={props.onResize} />
    <img alt='cat' src={require('../resources/images/cat.jpg')} />
  </div>
}

CatMidget.properties = {
  type: 'cat',
  title: 'Cat midget',
  description: 'A 🐈 midget in a widget',
  layout: {
    lg: { minW: 4, maxW: 6, defaultW: 4, minH: 8, defaultH: 8, maxH: 999 },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 8, defaultH: 8, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 8, defaultH: 8, maxH: 999 }
  },
  options: {
    backgroundColor: 'white'
  }
}

export default CatMidget
