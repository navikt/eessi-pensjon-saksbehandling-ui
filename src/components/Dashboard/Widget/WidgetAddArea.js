import React from 'react'
import WidgetAdd from './WidgetAdd'
import './Widget.css'
import WidgetAddPreview from './WidgetAddPreview'

const WidgetAddArea = (props) => {
  return <div className='c-ui-d-widgetAddContainer'>
    <WidgetAddPreview t={props.t} currentBreakpoint={props.currentBreakpoint} />
    {props.availableWidgets.map((widget, i) => {
      return <WidgetAdd key={i}
        widgets={props.widgets}
        setWidgets={props.setWidgets}
        widget={widget}
        dragApi={props.dragApi} />
    })}
  </div>
}

export default WidgetAddArea
