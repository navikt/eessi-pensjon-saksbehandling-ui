import React from 'react'
import PT from 'prop-types'
import WidgetEditOptions from './WidgetEditOptions'

import './Widget.css'

const WidgetEdit = (props) => {

  const { setMode, t } = props

  return (
    <div className='c-d-WidgetEdit'>
      <div className='titleDiv draggableHandle'>
        <div className='title'>
          {t('ui:dashboard-dragHereToMoveWidget')}
          <div className='deleteButton'>
            <a href='#delete' onClick={() => setMode('delete')}>🗑</a>
          </div>
        </div>
      </div>
      <WidgetEditOptions {...props} />
    </div>
  )
}

WidgetEdit.propTypes = {
  setMode: PT.func.isRequired,
  t: PT.func.isRequired
}

export default WidgetEdit
