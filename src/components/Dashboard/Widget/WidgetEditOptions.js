import React from 'react'
import PT from 'prop-types'
import * as Widgets from 'widgets'

const WidgetEditOptions = (props) => {

  const { widget } = props

  switch (widget.type) {
    case 'note':
      return <Widgets.NoteOptionsWidget {...props} />
    case 'smiley':
      return <Widgets.SmileyOptionsWidget {...props} />
    default:
      return null
  }
}

WidgetEditOptions.propTypes = {
  widget: PT.object.isRequired
}

export default WidgetEditOptions
