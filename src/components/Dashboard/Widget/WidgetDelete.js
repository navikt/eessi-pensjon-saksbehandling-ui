import React from 'react'
import KnappBase from 'nav-frontend-knapper'
import ReactResizeDetector from 'react-resize-detector'

import './Widget.css'

const WidgetDelete = (props) => {
  const onWidgetDeleteClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    props.onWidgetDelete(props.layout)
  }

  return (
    <div className='c-d-WidgetDelete' style={{ minHeight: '300px' }}>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={props.onResize}
      />
      <div className='deleteText'>
        <p>{props.t('dashboard-deleteWidgetAreYouSure1')}</p>
        <p>{props.t('dashboard-deleteWidgetAreYouSure2')}</p>
      </div>
      <div className='buttons'>
        <KnappBase
          type='hoved'
          onClick={onWidgetDeleteClick}
        >
          {props.t('ui:yes') + ', ' + props.t('ui:delete')}
        </KnappBase>
        <KnappBase
          type='flat'
          onClick={() => props.setMode('edit')}
        >
          {props.t('ui:no') + ', ' + props.t('ui:cancel')}
        </KnappBase>
      </div>
    </div>
  )
}

export default WidgetDelete
