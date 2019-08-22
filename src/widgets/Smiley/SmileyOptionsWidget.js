import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Select } from 'components/Nav'

const SmileyOptionsWidget = (props) => {
  const { availableWidgets, layout, onWidgetUpdate, widget } = props
  const [mood, setMood] = useState(widget.options.mood)

  const chooseMood = (e) => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.mood = e.target.value
    setMood(e.target.value)
    onWidgetUpdate(newWidget, layout)
  }

  const widgetTemplate = _.find(availableWidgets, { type: 'smiley' })

  return (
    <div className='w-SmileyOptionsWidget p-3'>
      <Select
        id='w-SmileyOptionsWidget__mood-select-id'
        label='mood'
        value={mood || ''}
        onChange={chooseMood}
      >
        {widgetTemplate.options.availableMoods.map(_mood => {
          return <option key={_mood.label} value={_mood.value}>{_mood.label}{' - '}{_mood.value}</option>
        })}
      </Select>
    </div>
  )
}

SmileyOptionsWidget.propTypes = {
  availableWidgets: PT.array.isRequired,
  layout: PT.object.isRequired,
  onWidgetUpdate: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default SmileyOptionsWidget
