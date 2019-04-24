import React from 'react'

import * as Widgets from '../../../../widgets'

const Widget = (props) => {
  switch (props.widget.type) {
    case 'ekspandertbart':
      return <Widgets.EkspandertBartWidget {...props} />
    case 'panel':
      return <Widgets.PanelWidget {...props} />
    case 'smiley':
      return <Widgets.SmileyWidget {...props} />
    case 'cat':
      return <Widgets.CatWidget {...props} />
    case 'note':
      return <Widgets.NoteWidget {...props} />
    case 'documentstatus':
      return <Widgets.DocumentStatusWidget {...props} />
    case 'links':
      return <Widgets.LinksWidget {...props} />
    case 'person':
      return <Widgets.PersonWidget {...props} />
    case 'sedlist':
      return <Widgets.SedListWidget {...props} />
    default:
      return <div>{props.t('ui:dashboard-noWidgetForType', { type: props.widget.type })}</div>
  }
}

export default Widget
