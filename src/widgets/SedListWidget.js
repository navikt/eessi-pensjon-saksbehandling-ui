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
    <SedList t={props.t}/>
  </div>
}

export default SedListWidget
