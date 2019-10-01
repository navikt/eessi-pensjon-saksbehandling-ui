import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Nav } from 'eessi-pensjon-ui'
import ReactResizeDetector from 'react-resize-detector'

const EkspandertBartWidget = ({ content, onResize, onUpdate, widget }) => {
  const [_content, setContent] = useState(content || widget.options.content)

  const onClick = () => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    onUpdate(newWidget)
  }

  useEffect(() => {
    if (content && content !== _content) {
      setContent(content)
    }
  }, [content, _content])

  const _onResize = (w, h) => {
    if (onResize) {
      // give more 50 for the panel header
      onResize(w, h + 60)
    }
  }

  return (
    <div className='w-EkspandertbartWidget'>
      <Nav.Ekspanderbartpanel
        apen={!widget.options.collapsed}
        tittel={widget.title || ''}
        onClick={onClick}
      >
        <div>
          <ReactResizeDetector
            handleWidth
            handleHeight
            onResize={_onResize}
          />
          {widget.options.collapsed === true
            ? ''
            : (
              <div
                className='content'
                dangerouslySetInnerHTML={{ __html: _content }}
              />
            )}
        </div>
      </Nav.Ekspanderbartpanel>
    </div>
  )
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

EkspandertBartWidget.propTypes = {
  content: PT.string,
  onResize: PT.func.isRequired,
  onUpdate: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default EkspandertBartWidget
