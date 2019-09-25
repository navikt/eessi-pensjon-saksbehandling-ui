import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'
import Overview from './Overview'

const OverviewWidget = (props) => {
  const { t, onResize, onUpdate, widget } = props
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  return (
    <div className='w-OverviewWidget'>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      />
      <Overview t={t} onUpdate={onUpdate} widget={widget} />
    </div>
  )
}

OverviewWidget.properties = {
  type: 'overview',
  title: 'Overview widget',
  description: 'Widget with overview info',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {
    collapsed: false,
    tabIndex: 0
  }
}

OverviewWidget.propTypes = {
  t: PT.func.isRequired,
  onResize: PT.func.isRequired,
  onUpdate: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default OverviewWidget
