import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Ekspanderbartpanel } from 'components/Nav'
import ReactResizeDetector from 'react-resize-detector'
import Links from './Links'

import './LinksWidget.css'

const LinksWidget = (props) => {
  const { onResize, onUpdate, t, widget } = props

  const onClick = () => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    onUpdate(newWidget)
  }

  const _onResize = (w, h) => {
    if (onResize) {
      // give more 70 for the panel header
      onResize(w, h + 70)
    }
  }

  return <div className='w-LinksWidget'>
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
          : <Links t={t} />
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

LinksWidget.propTypes = {
  onResize: PT.func.isRequired,
  onUpdate: PT.func.isRequired,
  t: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default LinksWidget
