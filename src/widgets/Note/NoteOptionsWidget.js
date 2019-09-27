import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Nav } from 'eessi-pensjon-ui'

const NoteOptionsWidget = (props) => {
  const { availableWidgets, layout, onWidgetUpdate, widget } = props
  const [backgroundColor, setBackgroundColor] = useState(widget.options.backgroundColor)

  const chooseColor = (e) => {
    const color = e.target.value
    const newWidget = _.cloneDeep(widget)
    newWidget.options.backgroundColor = color
    setBackgroundColor(color)
    onWidgetUpdate(newWidget, layout)
  }

  const widgetTemplate = _.find(availableWidgets, { type: 'note' })

  return (
    <div className='w-NoteOptionsWidget p-3'>
      <Nav.Select
        id='w-NoteOptionsWidget__color-select-id'
        label='color'
        value={backgroundColor || ''}
        onChange={chooseColor}
      >
        {widgetTemplate.options.availableColors.map(color => {
          return <option key={color} value={color}>{color}</option>
        })}
      </Nav.Select>
      <br />
      <br />
      <br />
    </div>
  )
}

NoteOptionsWidget.propTypes = {
  availableWidgets: PT.array.isRequired,
  layout: PT.object.isRequired,
  onWidgetUpdate: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default NoteOptionsWidget
