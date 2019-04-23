import React from 'react'

import NoteOptionsWidget from './Catalog/NoteOptionsWidget'

const WidgetEditOptions = (props) => {
  switch (props.widget.type) {
    case 'note':
      return <NoteOptionsWidget {...props} />
        default:
      return null
  }
}

export default WidgetEditOptions
