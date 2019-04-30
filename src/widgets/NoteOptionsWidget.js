import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import * as Nav from '../components/ui/Nav'

const NoteOptionsWidget = (props) => {
  const [backgroundColor, setBackgroundColor] = useState(null)

  useEffect(() => {
    setBackgroundColor(props.widget.options.backgroundColor)
  }, [])

  const chooseColor = (e) => {
    const color = e.target.value
    let newWidget = _.cloneDeep(props.widget)
    newWidget.options.backgroundColor = color
    setBackgroundColor(color)
    props.onWidgetUpdate(newWidget, props.layout)
  }

  let widgetTemplate = _.find(props.availableWidgets, { type: 'note' })
  return <div className='p-3'>

    <Nav.Select label={'color'} value={backgroundColor || ''}
      onChange={chooseColor}>
      {widgetTemplate.options.availableColors.map(color => {
        return <option key={color} value={color}>{color}</option>
      })}
    </Nav.Select>
    <br/>
    <br/>
    <br/>
  </div>
}

export default NoteOptionsWidget
