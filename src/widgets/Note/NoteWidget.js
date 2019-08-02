import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import ReactResizeDetector from 'react-resize-detector'

const NoteWidget = (props) => {
  const { id, layout, onResize, onWidgetUpdate, widget } = props
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState(widget.options.content)

  useEffect(() => {
    if (!mounted && onResize) {
      onResize()
      setMounted(true)
    }
  }, [mounted, onResize])

  const _id = id || 'widget-note-' + (layout !== undefined ? layout.i : '' + new Date().getTime())

  const resize = () => {
    const width = document.getElementById(_id).offsetWidth
    const height = document.getElementById(_id).offsetHeight
    onResize(width, height)
  }

  const onBlur = (e) => {
    resize()
    saveContent(e)
  }

  const saveContent = (e) => {
    const newContent = e.target.innerHTML
    const newWidget = _.cloneDeep(widget)
    newWidget.options.content = newContent
    setContent(newContent)
    onWidgetUpdate(newWidget, layout)
  }

  return <div
    id={_id}
    className='p-3 w-NoteWidget'>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={onResize} />
    <h4>{widget.title}</h4>
    <div
      className='w-NoteWidget__content'
      contentEditable='true'
      onBlur={onBlur}
      dangerouslySetInnerHTML={{ __html: content }} />
  </div>
}

NoteWidget.properties = {
  type: 'note',
  title: 'Note widget',
  description: 'Post-it notes',
  layout: {
    lg: { minW: 4, maxW: 6, defaultW: 4, minH: 5, defaultH: 5, maxH: 999 },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 5, defaultH: 5, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 5, defaultH: 5, maxH: 999 }
  },
  options: {
    backgroundColor: 'yellow',
    availableColors: ['white', 'yellow', 'orange', 'pink', 'lightgreen']
  }
}

NoteWidget.propTypes = {
  id: PT.string,
  onResize: PT.func.isRequired,
  widget: PT.object.isRequired,
  layout: PT.object.isRequired,
  onWidgetUpdate: PT.func.isRequired
}

export default NoteWidget
