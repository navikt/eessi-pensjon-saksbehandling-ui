import React from 'react'
import PanelBase from 'nav-frontend-paneler'

const PanelWidget = (props) => {
  return <div className='c-ui-d-PanelWidget p-3'>
    <h4>{props.widget.title}</h4>
    <PanelBase border>
      <div dangerouslySetInnerHTML={{ __html: props.widget.options.content }} />
    </PanelBase>
  </div>
}

PanelWidget.properties = {
  type: 'panel',
  title: 'Panel widget',
  description: 'Widget that is a basic panel',
  layout: {
    lg: { minW: 2, maxW: 12, defaultW: 3, minH: 3, defaultH: 3, maxH: Infinity },
    md: { minW: 1, maxW: 3, defaultW: 1, minH: 3, defaultH: 3, maxH: Infinity },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 3, defaultH: 3, maxH: Infinity }
  },
  options: {}
}

export default PanelWidget
