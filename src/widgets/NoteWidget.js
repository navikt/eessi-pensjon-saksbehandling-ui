import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import ReactResizeDetector from 'react-resize-detector'

const NoteWidget = (props) => {
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    if (!mounted && props.onResize) {
      setMounted(true)
    }
    setContent(props.widget.options.content)
  }, [])

  const id = 'widget-note-' + (props.layout !== undefined ? props.layout.i : '' + new Date().getTime())

  const resize = () => {
    const width = document.getElementById(id).offsetWidth
    const height = document.getElementById(id).offsetHeight
    props.onResize(width, height)
  }

  const onBlur = (e) => {
    resize()
    saveContent(e)
  }

  const saveContent = (e) => {
    const newContent = e.target.innerHTML
    let newWidget = _.cloneDeep(props.widget)
    newWidget.options.content = newContent
    setContent(newContent)
    props.onWidgetUpdate(newWidget, props.layout)
  }

  return <div className='p-3 c-ui-d-NoteWidget' id={id}>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={props.onResize} />
    <h4>{props.widget.title}</h4>
    <div contentEditable='true' onBlur={onBlur} dangerouslySetInnerHTML={{ __html: content }} />
  </div>
}

NoteWidget.properties = {
  type: 'note',
  title: 'Note widget',
  description: 'Post-it notes',
  layout: {
    lg: { minW: 4, maxW: 6, defaultW: 4, minH: 5, defaultH: 5, maxH: Infinity },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 5, defaultH: 5, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 5, defaultH: 5, maxH: Infinity }
  },
  options: {
    backgroundColor: 'yellow',
    availableColors: ['white', 'yellow', 'orange', 'pink', 'lightgreen']
  }
}

export default NoteWidget
