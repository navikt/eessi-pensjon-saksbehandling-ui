import React from 'react'
import _ from 'lodash'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import ReactResizeDetector from 'react-resize-detector'
import Links from './Links'

import './LinksWidget.css'

const LinksWidget = (props) => {
  const onClick = () => {
    const newWidget = _.cloneDeep(props.widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    props.onUpdate(newWidget)
  }

  const _onResize = (w, h) => {
    if (props.onResize) {
      // give more 70 for the panel header
      props.onResize(w, h + 70)
    }
  }

  return <div className='c-d-LinksWidget'>
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
          : <Links />
        }
      </div>
    </Ekspanderbartpanel>
  </div>
}

LinksWidget.properties = {
  type: 'links',
  title: 'Links widget',
  description: 'Widget with links',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, defaultH: 4, maxH: 999 },
    md: { minW: 3, maxW: 3, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, defaultH: 4, maxH: 999 }
  },
  options: {}
}

export default LinksWidget
