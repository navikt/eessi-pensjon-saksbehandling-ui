import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import * as Nav from '../components/ui/Nav'

const SmileyOptionsWidget = (props) => {
  const [mood, setMood] = useState(null)

  useEffect(() => {
    setMood(props.widget.options.mood)
  }, [])

  const chooseMood = (e) => {
    let newWidget = _.cloneDeep(props.widget)
    newWidget.options.mood = e.target.value
    setMood(e.target.value)
    props.onWidgetUpdate(newWidget, props.layout)
  }

  let widgetTemplate = _.find(props.availableWidgets, { type: 'smiley' })
  return <div className='p-3'>
    <Nav.Select label={'mood'} value={mood}
      onChange={chooseMood}>
      {widgetTemplate.options.availableMoods.map(_mood => {
        return <option value={_mood.value}>{_mood.label}{' - '}{_mood.value}</option>
      })}
    </Nav.Select>
  </div>
}

export default SmileyOptionsWidget
