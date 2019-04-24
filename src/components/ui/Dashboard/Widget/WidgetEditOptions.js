import React from 'react'

import * as Widgets from '../../../../widgets'

const WidgetEditOptions = (props) => {
  switch (props.widget.type) {
    case 'note':
      return <Widgets.NoteOptionsWidget {...props} />
    case 'smiley':
      return <Widgets.SmileyOptionsWidget {...props} />
    default:
      return null
  }
}

export default WidgetEditOptions
