import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Widget from './Widget'

import './Widget.css'

const WidgetContainer = (props) => {
  const [sizes, setSizes] = useState({ lg: {}, md: {}, sm: {} })
  const [mouseOver, setMouseOver] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState('view')

  useEffect(() => {
    if (!mounted) {
      calculateSizes()
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mode === 'view' && props.editMode && mouseOver) {
      setMode('edit')
    }
    if (mode === 'edit' && !mouseOver) {
      setMode('view')
    }
  }, [mouseOver])

  const onUpdate = (update) => {
    props.onWidgetUpdate(update, props.layout)
  }

  const onResize = (width, height) => {
    // console.log("ON RESIZE", width, height)
    if (!height || !width) { return }
    if (props.onWidgetResize) {
      let newLayout = _.cloneDeep(props.layout)
      // these 10 are padding/margin added to each h
      let newH = Math.ceil((height + 10) / (props.rowHeight + 10))

      // do not shrink below minimum H
      if (newH < newLayout.minH) {
        newH = newLayout.minH
      }

      // in edit mode, don't make it smaller than view mode
      if (mode === 'edit' && newH < newLayout.h) {
        newH = newLayout.h
      }
      if (newH !== newLayout.h) {
        newLayout.h = newH
        props.onWidgetResize(newLayout)
      }
    }
  }

  const getSizes = () => {
    return {
      width: document.getElementById('widget-' + props.layout.i).offsetWidth,
      height: document.getElementById('widget-' + props.layout.i).offsetHeight
    }
  }

  const calculateSizes = () => {
    if (document.getElementById('widget-' + props.layout.i)) {
      const newSizes = getSizes()
      let oldSizes = _.cloneDeep(sizes)
      if (_.isEmpty(oldSizes[props.currentBreakpoint]) || (
        ((oldSizes[props.currentBreakpoint].height !== newSizes.height) ||
        (oldSizes[props.currentBreakpoint].width !== newSizes.width)))) {
        oldSizes[props.currentBreakpoint] = newSizes
        setSizes(oldSizes)
      }
    }
  }

  let backgroundColor = props.widget.options.backgroundColor || 'white'
  if (props.editMode) {
    backgroundColor = 'white'
  }

  return <div className='c-ui-d-Widget' style={{ backgroundColor }}
    onMouseEnter={() => setMouseOver(true)}
    onMouseLeave={() => setMouseOver(false)}>
    <Widget {...props}
      mode={mode}
      setMode={setMode}
      onUpdate={onUpdate}
      onResize={onResize}
    />
  </div>
}

export default WidgetContainer
