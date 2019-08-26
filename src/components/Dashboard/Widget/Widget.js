import React from 'react'
import PT from 'prop-types'
import WidgetEdit from './WidgetEdit'
import WidgetDelete from './WidgetDelete'
import * as Widgets from 'widgets'

const Widget = (props) => {

  const { mode, t, widget } = props
  if (mode === 'edit') {
    return <WidgetEdit {...props} />
  }

  if (mode === 'delete') {
    return <WidgetDelete {...props} />
  }

  switch (widget.type) {
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
      return <div>{t('ui:dashboard-noWidgetForType', { type: widget.type })}</div>
  }
}

Widget.propTypes ={
  mode: PT.string,
  t: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default Widget
