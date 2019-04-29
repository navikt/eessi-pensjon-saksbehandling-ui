import React from 'react'
import _ from 'lodash'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import ReactResizeDetector from 'react-resize-detector'
import DocumentStatus from './DocumentStatus'
import { withRouter } from 'react-router-dom'

import './DocumentStatusWidget.css'

const DocumentStatusWidget = (props) => {
  const onClick = () => {
    let newWidget = _.cloneDeep(props.widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    props.onUpdate(newWidget)
  }

  const _onResize = (w, h) => {
    if (props.onResize) {
      // give more 25 + 16*2 padding for the panel header
      props.onResize(w, h + 62)
    }
  }

  return <div className='c-ui-d-DocumentStatusWidget'>
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
          : <DocumentStatus history={props.history} />
        }
      </div>
    </Ekspanderbartpanel>
  </div>
}

DocumentStatusWidget.properties = {
  type: 'documentstatus',
  title: 'Document Status widget',
  description: 'Widget with document status',
  layout: {
    lg: { minW: 6, maxW: 12, defaultW: 6, minH: 2, maxH: 999, defaultH: 6 },
    md: { minW: 3, maxW: 3, defaultW: 3, minH: 2, maxH: 999, defaultH: 3 },
    sm: { minW: 1, maxW: 1, defaultW: 1, minH: 2, maxH: 999, defaultH: 3 }
  },
  options: {
    collapsed: false
  }
}

export default withRouter(DocumentStatusWidget)
