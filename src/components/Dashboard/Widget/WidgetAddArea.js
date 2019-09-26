import React from 'react'
import PT from 'prop-types'
import WidgetAdd from './WidgetAdd'
import WidgetAddPreview from './WidgetAddPreview'

import './Widget.css'

const WidgetAddArea = (props) => {
  const { availableWidgets, currentBreakpoint, dragApi, setWidgets, t, widgets } = props
  return (
    <div className='c-d-widgetAddArea'>
      <WidgetAddPreview t={t} currentBreakpoint={currentBreakpoint} />
      {availableWidgets.map((widget, i) => {
        return (
          <WidgetAdd
            key={i}
            widgets={widgets}
            setWidgets={setWidgets}
            widget={widget}
            dragApi={dragApi}
          />
        )
      })}
    </div>
  )
}

WidgetAddArea.propTypes = {
  availableWidgets: PT.array.isRequired,
  currentBreakpoint: PT.string.isRequired,
  dragApi: PT.object,
  setWidgets: PT.func.isRequired,
  t: PT.func.isRequired,
  widgets: PT.array.isRequired
}

export default WidgetAddArea
