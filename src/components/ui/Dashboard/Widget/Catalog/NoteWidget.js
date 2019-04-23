import React, { useState, useEffect } from 'react'
import ReactResizeDetector from 'react-resize-detector'

const NoteWidget = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && props.onResize) {
      props.onResize()
      setMounted(true)
    }
  }, [])

  const onBlur = () => {
    const width = document.getElementById('widget-note-' + props.layout.i).offsetWidth
    const height = document.getElementById('widget-note-' + props.layout.i).offsetHeight
    props.onResize(width, height)
  }

  const backgroundColor = props.widget.options.backgroundColor || 'white'
  return <div className='p-3 c-ui-d-NoteWidget' id={'widget-note-' + props.layout.i} style={{
    backgroundColor: backgroundColor
    }}>
      <ReactResizeDetector
         handleWidth
         handleHeight
         onResize={props.onResize} />
    <h4>{props.widget.title}</h4>
    <div contenteditable='true' onBlur={onBlur} dangerouslySetInnerHTML={{ __html: props.widget.options.content }} >

    </div>

  </div>
}

export default NoteWidget
