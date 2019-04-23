import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import ReactResizeDetector from 'react-resize-detector'

const NoteWidget = (props) => {
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
    setContent(props.widget.options.content)
  }, [])

  const id = 'widget-note-' + (props.layout !== undefined ? props.layout.i : '' + new Date().getTime())

  const onBlur = (e) => {
    const width = document.getElementById(id).offsetWidth
    const height = document.getElementById(id).offsetHeight
    props.onResize(width, height)
    saveContent(e)
  }

  const saveContent = (e) => {
    const newContent = e.target.innerHTML
    let newWidget = _.cloneDeep(props.widget)
    newWidget.options.content = newContent
    setContent(newContent)
    props.onWidgetUpdate(newWidget, props.layout)
  }

  const backgroundColor = props.widget.options.backgroundColor || 'white'

  return <div className='p-3 c-ui-d-NoteWidget' id={id} style={{
    backgroundColor: backgroundColor
    }}>
    <ReactResizeDetector
      handleWidth
      handleHeight
      onResize={props.onResize} />
    <h4>{props.widget.title}</h4>
    <div contenteditable='true' onBlur={onBlur} dangerouslySetInnerHTML={{ __html: content }}/>
  </div>
}

export default NoteWidget
