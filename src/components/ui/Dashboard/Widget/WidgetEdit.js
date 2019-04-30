import React from 'react'
import WidgetEditOptions from './WidgetEditOptions'

import './Widget.css'

const WidgetEdit = (props) => {
  return <div className='c-ui-d-WidgetEdit'>

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
