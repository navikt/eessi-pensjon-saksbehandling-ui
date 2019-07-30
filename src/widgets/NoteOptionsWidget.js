import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import * as Nav from '../components/Nav'

const NoteOptionsWidget = (props) => {
  const { widget, onWidgetUpdate, layout, availableWidgets } = props
  const [backgroundColor, setBackgroundColor] = useState(widget.options.backgroundColor)

  const chooseColor = (e) => {
    const color = e.target.value
    const newWidget = _.cloneDeep(widget)
    newWidget.options.backgroundColor = color
    setBackgroundColor(color)
    onWidgetUpdate(newWidget, layout)
  }

  const widgetTemplate = _.find(availableWidgets, { type: 'note' })
  return <div className='p-3'>

    <Nav.Select label={'color'} value={backgroundColor || ''}
      onChange={chooseColor}>
      {widgetTemplate.options.availableColors.map(color => {
        return <option key={color} value={color}>{color}</option>
      })}
    </Nav.Select>
    <br />
    <br />
    <br />
  </div>
}

NoteOptionsWidget.propTypes = {
  widget: PT.object.isRequired,
  onWidgetUpdate: PT.func.isRequired,
  layout: PT.object.isRequired,
  availableWidgets: PT.array.isRequired
}

export default NoteOptionsWidget
