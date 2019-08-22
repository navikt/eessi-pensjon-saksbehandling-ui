import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import Person from './Person'

const PersonWidget = (props) => {
  const [mounted, setMounted] = useState(false)
  const { t, onResize } = props

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return (
    <div className='c-d-PersonWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      />
      <Person t={t} />
    </div>
  )
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

PersonWidget.propTypes = {
  t: PT.func.isRequired,
  onResize: PT.func.isRequired
}

export default PersonWidget
