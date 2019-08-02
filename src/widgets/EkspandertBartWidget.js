import React from 'react'
import _ from 'lodash'
import { Ekspanderbartpanel } from 'components/Nav'
import ReactResizeDetector from 'react-resize-detector'

const EkspandertBartWidget = (props) => {

  const { onUpdate, widget } = props
  const onClick = () => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    onUpdate(newWidget)
  }

  const _onResize = (w, h) => {
    if (onResize) {
      // give more 50 for the panel header
      onResize(w, h + 60)
    }
  }

  return <div className='c-d-EkspandertbartWidget'>
    <Ekspanderbartpanel
      apen={!widget.options.collapsed}
      tittel={widget.title}
      onClick={onClick}>
      <div>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={_onResize} />
        {widget.options.collapsed === true
          ? null
          : <div
            className='content'
            dangerouslySetInnerHTML={{ __html: widget.options.content }} />
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
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, maxH: 999, defaultH: 6 },
    md: { minW: 2, maxW: 3, defaultW: 2, minH: 2, maxH: 999, defaultH: 3 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, maxH: 999, defaultH: 3 }
  },
  options: {
    collapsed: false,
    content: ''
  }
}

export default EkspandertBartWidget
