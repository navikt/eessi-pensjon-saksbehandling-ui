import React from 'react'
import _ from 'lodash'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import ReactResizeDetector from 'react-resize-detector'

const EkspandertBartWidget = (props) => {
  const onClick = () => {
    let newWidget = _.cloneDeep(props.widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    props.onUpdate(newWidget)
  }

  const _onResize = (w, h) => {
    if (props.onResize) {
      // give more 50 for the panel header
      props.onResize(w, h + 60)
    }
  }

  return <div className='c-ui-d-EkspandertbartWidget'>
    <Ekspanderbartpanel
      apen={!props.widget.options.collapsed}
      tittel={props.widget.title}
      onClick={onClick}>
      <div>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={_onResize} />
        {props.widget.options.collapsed === true
          ? null
          : <div dangerouslySetInnerHTML={{ __html: props.widget.options.content }} />
        }
      </div>
    </Ekspanderbartpanel>
  </div>
}

EkspandertBartWidget.properties = {
  type: 'ekspandertbart',
  title: 'Ekspandertbart widget',
  description: 'Widget that can collapse',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, maxH: Infinity, defaultH: 6 },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 2, maxH: Infinity, defaultH: 3 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, maxH: Infinity, defaultH: 3 }
  },
  options: {
    collapsed: false
  }
}

export default EkspandertBartWidget
