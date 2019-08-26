import React from 'react'
import PT from 'prop-types'
import KnappBase from 'nav-frontend-knapper'
import ReactResizeDetector from 'react-resize-detector'

import './Widget.css'

const WidgetDelete = (props) => {

  const { layout, onResize, onWidgetDelete, setMode, t } = props

  const onWidgetDeleteClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onWidgetDelete(layout)
  }

  return (
    <div className='c-d-WidgetDelete' style={{ minHeight: '300px' }}>
      <ReactResizeDetector
        handleWidth
        handleHeight
        onResize={onResize}
      />
      <div className='deleteText'>
        <p>{t('dashboard-deleteWidgetAreYouSure1')}</p>
        <p>{t('dashboard-deleteWidgetAreYouSure2')}</p>
      </div>
      <div className='buttons'>
        <KnappBase
          type='hoved'
          onClick={onWidgetDeleteClick}
        >
          {t('ui:yes') + ', ' + t('ui:delete')}
        </KnappBase>
        <KnappBase
          type='flat'
          onClick={() => setMode('edit')}
        >
          {t('ui:no') + ', ' + t('ui:cancel')}
        </KnappBase>
      </div>
    </div>
  )
}

WidgetDelete.propTypes = {
  layout: PT.object.isRequired,
  onResize: PT.func.isRequired,
  onWidgetDelete: PT.func.isRequired,
  setMode: PT.func.isRequired,
  t: PT.func.isRequired
}
export default WidgetDelete
