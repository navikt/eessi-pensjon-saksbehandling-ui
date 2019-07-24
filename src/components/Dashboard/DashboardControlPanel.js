import React from 'react'
import DashboardConfig from './Config/DashboardConfig'

const DashboardControlPanel = (props) => {
  return <div className='c-d-dashboardControlPanel pt-2 pb-0 pr-4 pl-4'>
    <div className='d-inline-block'>
      {props.editMode
        ? props.addMode ? props.t('ui:dashboard-dragNewWidgets') : props.t('ui:dashboard-arrangeWidgets')
        : null}
    </div>
    <div className='c-d-dashboardControlPanel-buttons'>
      {props.editMode ? <button className='c-d-dashboardControlPanel-button mr-2'
        onClick={props.onAddChange}>
        {!props.addMode ? props.t('ui:dashboard-addNewWidgets') : props.t('ui:dashboard-hideNewWidgets')}
      </button> : null}
      {!props.editMode ? <button onClick={props.onEditModeOn}>
        {props.t('ui:dashboard-editDashboard')}
      </button> : <React.Fragment>
        <button className='mr-2' onClick={props.onSaveEdit}>
          {props.t('ui:dashboard-saveChanges')}
        </button>
        <button className='mr-2' onClick={props.onCancelEdit}>
          {props.t('ui:dashboard-cancelChanges')}
        </button>
      </React.Fragment>
      }
    </div>
  </div>
}

DashboardControlPanel.defaultProps = DashboardConfig

export default DashboardControlPanel
