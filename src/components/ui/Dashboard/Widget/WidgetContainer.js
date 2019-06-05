import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import Widget from './Widget'

import './Widget.css'

const WidgetContainer = (props) => {
  const { onWidgetUpdate, onWidgetResize } = props
  const { widget, editMode, layout, rowHeight, currentBreakpoint } = props

  const [sizes, setSizes] = useState({ lg: {}, md: {}, sm: {} })
  const [mouseOver, setMouseOver] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState('view')

  useEffect(() => {
    const getSizes = () => {
      return {
        width: document.getElementById('widget-' + layout.i).offsetWidth,
        height: document.getElementById('widget-' + layout.i).offsetHeight
      }
    }

    if (!mounted) {
      if (document.getElementById('widget-' + layout.i)) {
        const newSizes = getSizes()
        let oldSizes = _.cloneDeep(sizes)
        if (_.isEmpty(oldSizes[currentBreakpoint]) || (
          ((oldSizes[currentBreakpoint].height !== newSizes.height) ||
          (oldSizes[currentBreakpoint].width !== newSizes.width)))) {
          oldSizes[currentBreakpoint] = newSizes
          setSizes(oldSizes)
        }
      }
      setMounted(true)
    }
  }, [mounted, layout, sizes, currentBreakpoint])

  useEffect(() => {
    if (mode === 'view' && editMode && mouseOver) {
      setMode('edit')
    }
    if (mode === 'edit' && !mouseOver) {
      setMode('view')
    }
  }, [mode, editMode, mouseOver])

  const onUpdate = (update) => {
    onWidgetUpdate(update, layout)
  }

  const onResize = (width, height) => {
    if (!height || !width) { return }
    if (onWidgetResize) {
      let newLayout = _.cloneDeep(layout)
      // these 10 are padding/margin added to each h
      let newH = Math.ceil((height + 10) / (rowHeight + 10))

      // do not shrink below minimum H
      if (newH < newLayout.minH) {
        console.log('New h ' + newH + ' rejected because minH is ' + newLayout.minH)
        newH = newLayout.minH
      }

      if (newH > newLayout.maxH) {
        console.log('New h ' + newH + ' rejected because maxH is ' + newLayout.maxH)
        newH = newLayout.maxH
      }

      // in edit mode, don't make it smaller than view mode
      if (mode === 'edit' && newH < newLayout.h) {
        console.log('New h ' + newH + ' rejected because edit mode and h is ' + newLayout.h)
        newH = newLayout.h
      }
      if (mode !== 'edit' && newH !== newLayout.h) {
        console.log('Resized ' + newLayout.i + ' from h ' + newLayout.h + ' to ' + newH)
        newLayout.h = newH
        onWidgetResize(newLayout)
      }
    }
  }

  if (!widget) {
    return null
  }

  let backgroundColor = widget.options.backgroundColor || 'transparent'
  if (editMode) {
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
