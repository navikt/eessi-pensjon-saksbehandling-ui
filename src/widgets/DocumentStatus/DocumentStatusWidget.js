import React from 'react'
import _ from 'lodash'
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel'
import ReactResizeDetector from 'react-resize-detector'
import DocumentStatus from './DocumentStatus'
import { withRouter } from 'react-router-dom'

import './DocumentStatusWidget.css'

const EkspandertBartWidget = (props) => {
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

export default withRouter(EkspandertBartWidget)
