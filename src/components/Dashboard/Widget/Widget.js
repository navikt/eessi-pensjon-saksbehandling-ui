import React from 'react'
import WidgetEdit from './WidgetEdit'
import WidgetDelete from './WidgetDelete'
import * as Widgets from 'widgets'

const Widget = (props) => {
  if (props.mode === 'edit') {
    return <WidgetEdit {...props} />
  }

  if (props.mode === 'delete') {
    return <WidgetDelete {...props} />
  }

  switch (props.widget.type) {
    case 'ekspandertbart':
      return <Widgets.EkspandertBartWidget {...props} />
    case 'varsler':
      return <Widgets.VarslerWidget {...props} />
    case 'smiley':
      return <Widgets.SmileyWidget {...props} />
    case 'cat':
      return <Widgets.CatMidget {...props} />
    case 'note':
      return <Widgets.NoteWidget {...props} />
    case 'links':
      return <Widgets.LinksWidget {...props} />
    case 'person':
      return <Widgets.PersonWidget {...props} />
    case 'pdf':
      return <Widgets.PdfWidget {...props} />
    case 'buc':
      return <Widgets.BUCWidget {...props} />
    default:
      return <div>{props.t('ui:dashboard-noWidgetForType', { type: props.widget.type })}</div>
  }
}

export default Widget
