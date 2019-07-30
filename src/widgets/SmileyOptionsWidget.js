import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import * as Nav from '../components/Nav'

const SmileyOptionsWidget = (props) => {
  const { widget, onWidgetUpdate, layout, availableWidgets } = props
  const [mood, setMood] = useState(widget.options.mood)

  const chooseMood = (e) => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.mood = e.target.value
    setMood(e.target.value)
    onWidgetUpdate(newWidget, layout)
  }

  const widgetTemplate = _.find(availableWidgets, { type: 'smiley' })
  return <div className='p-3'>
    <Nav.Select label={'mood'} value={mood || ''}
      onChange={chooseMood}>
      {widgetTemplate.options.availableMoods.map(_mood => {
        return <option key={_mood.label} value={_mood.value}>{_mood.label}{' - '}{_mood.value}</option>
      })}
    </Nav.Select>
  </div>
}

SmileyOptionsWidget.propTypes = {
  widget: PT.object.isRequired,
  onWidgetUpdate: PT.func.isRequired,
  layout: PT.object.isRequired,
  availableWidgets: PT.array.isRequired
}

export default SmileyOptionsWidget
