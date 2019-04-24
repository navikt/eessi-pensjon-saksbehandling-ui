import React, { useState } from 'react'
import KnappBase from 'nav-frontend-knapper'
import WidgetEditOptions from './WidgetEditOptions'

import './Widget.css'

const WidgetEdit = (props) => {
  const [deleteMode, setDeleteMode] = useState(false)

  const onWidgetEditClick = (e) => {
    // console.log(e)
  }

  const onWidgetDeleteClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    props.onWidgetDelete(props.layout)
  }

  if (deleteMode) {
    return <div className='c-ui-d-WidgetDelete'>
      <div classname='p-4 text'>
        <p>{props.t('dashboard-deleteWidgetAreYouSure1')}</p>
        <p>{props.t('dashboard-deleteWidgetAreYouSure2')}</p>
      </div>
      <div className='buttons'>
        <KnappBase
          type='hoved'
          onClick={onWidgetDeleteClick}>
          {props.t('ui:yes') + ', ' + props.t('ui:delete')}
        </KnappBase>
        <KnappBase
          type='flat'
          onClick={() => setDeleteMode(false)}>
          {props.t('ui:no') + ', ' + props.t('ui:cancel')}
        </KnappBase>
      </div>
    </div>
  }

  return <div className='c-ui-d-WidgetEdit'
    onClick={onWidgetEditClick}>
    <div className='titleDiv draggableHandle'>
      <div className='title'>
        {props.t('ui:dashboard-dragHereToMoveWidget')}
        <div className='deleteButton'>
          <a href='#delete' onClick={() => setDeleteMode(true)}>🗑</a>
        </div>
      </div>
    </div>
    <WidgetEditOptions {...props} />
  </div>
}

export default WidgetEdit
