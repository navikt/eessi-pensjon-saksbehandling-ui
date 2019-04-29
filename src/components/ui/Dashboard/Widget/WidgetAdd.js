import React, { useState, useEffect } from 'react'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import classNames from 'classnames'
import _ from 'lodash'

import './Widget.css'

const WidgetAdd = (props) => {
  const [mouseOver, setMouseOver] = useState(false)

  useEffect(() => {
    if (props.connectDragPreview) {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      props.connectDragPreview(getEmptyImage(), {
        // IE fallback: specify that we'd rather screenshot the node
        // when it already knows it's being dragged so we can hide it with CSS.
        captureDraggingState: true
      })
    }
  }, [])

  return <div>
    <div
      className={classNames('c-ui-d-widgetAdd', {
        'selected': props.isDragging,
        'hover': mouseOver
      })}
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      title={props.widget.description}
      ref={props.connectDragSource}>
      <div className='p-2 content'>
        <h6>{props.widget.title}</h6>
        <p><small>{props.widget.description}</small></p>
      </div>
    </div>
  </div>
}

export default DragSource(
  'newWidget', {
    beginDrag: (props) => {
      // console.log('WidgetAdd: BeginDrag')
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
      // console.log('WidgetAdd: EndDrag')
      const item = monitor.getItem()
      const dropResult = monitor.getDropResult()
      // if drag was not successful, clean up
      if (!dropResult) {
        props.setWidgets(_.reject(props.widgets, { 'i': item.newId }))
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
