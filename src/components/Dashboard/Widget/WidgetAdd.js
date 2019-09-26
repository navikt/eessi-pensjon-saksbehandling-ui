import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import classNames from 'classnames'
import _ from 'lodash'

import './Widget.css'

export const WidgetAdd = (props) => {
  const { connectDragPreview, connectDragSource, isDragging, widget } = props
  const [mounted, setMounted] = useState(false)
  const [mouseOver, setMouseOver] = useState(false)

  useEffect(() => {
    if (!mounted && connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true
      })
      setMounted(true)
    }
  }, [mounted, connectDragPreview])

  return (
    <div
      className={classNames('c-d-widgetAdd', {
        selected: isDragging,
        hover: mouseOver
      })}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      title={widget.description}
      ref={connectDragSource}
    >
      <div className='p-2 content'>
        <h6 className='c-d-widgetAdd__title'>{widget.title}</h6>
        <p className='c-d-widgetAdd__description'>
          <small>{widget.description}</small>
        </p>
      </div>
    </div>
  )
}

WidgetAdd.propTypes = {
  connectDragPreview: PT.func.isRequired,
  connectDragSource: PT.func.isRequired,
  isDragging: PT.bool,
  widget: PT.object.isRequired
}

const WidgetAddDragSource = DragSource(
  'newWidget', {
    beginDrag: (props) => {
      const newId = 'w-' + new Date().getTime() + '-' + props.widget.type
      // create new Widget from template
      props.setWidgets(props.widgets.concat({
        i: newId,
        type: props.widget.type,
        title: props.widget.title,
        options: props.widget.options
      }))
      // return the object I want to send to dropTarget when dropped
      return {
        widget: props.widget,
        newId: newId
      }
    },
    endDrag: (props, monitor) => {
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      // if drag was not successful, clean up
      if (!dropResult) {
        props.setWidgets(_.reject(props.widgets, { i: item.newId }))
      }
    },
    canDrag: () => {
      return true
    }
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  })
)(WidgetAdd)

export default WidgetAddDragSource
