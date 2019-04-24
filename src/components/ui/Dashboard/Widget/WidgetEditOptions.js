import React from 'react'

import * as Widgets from '../../../../widgets'

const WidgetEditOptions = (props) => {
  switch (props.widget.type) {
    case 'note':
      return <Widgets.NoteOptionsWidget {...props} />
    default:
      return null
  }
}

export default WidgetEditOptions
