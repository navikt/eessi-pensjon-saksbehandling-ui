import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import Person from '../../../../../pages/NewFeatures/Person'

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
    <Person t={props.t}/>
  </div>
}

export default PersonWidget
