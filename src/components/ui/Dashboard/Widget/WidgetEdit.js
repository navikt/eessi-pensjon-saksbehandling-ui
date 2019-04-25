import React, { useState } from 'react'
import KnappBase from 'nav-frontend-knapper'
import WidgetEditOptions from './WidgetEditOptions'
import ReactResizeDetector from 'react-resize-detector'

import './Widget.css'

const WidgetEdit = (props) => {

  return <div className='c-ui-d-WidgetEdit'>
    <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={props.onResize} />
    <div className='titleDiv draggableHandle'>
      <div className='title'>
        {props.t('ui:dashboard-dragHereToMoveWidget')}
        <div className='deleteButton'>
          <a href='#delete' onClick={() => props.setMode('delete')}>🗑</a>
        </div>
      </div>
    </div>
    <WidgetEditOptions {...props} />
  </div>
}

export default WidgetEdit
