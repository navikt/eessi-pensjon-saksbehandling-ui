import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'
import DashboardConfig from './Config/DashboardConfig'
import * as DashboardAPI from './API/DashboardAPI'

import DashboardRender from 'components/Dashboard/DashboardRender'

export const Dashboard = (props) => {
  const { t } = props
  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [widgets, setWidgets] = useState([])
  const [layouts, setLayouts] = useState({})
  const [config, setConfig] = useState({})
  const [backupLayouts, setBackupLayouts] = useState({})
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
  const [availableWidgets, setAvailableWidgets] = useState([])

  const initDashboard = async () => {
    const _availableWidgets = await DashboardAPI.loadAvailableWidgets()
    setAvailableWidgets(_availableWidgets)
    const [_widgets, _layouts, _config] = await DashboardAPI.loadDashboard()
    setWidgets(_widgets)
    setLayouts(_layouts)
    setConfig(_config)
  }

  useEffect(() => {
    initDashboard()
    setMounted(true)
  }, [])

  const onWidgetUpdate = (update, layout) => {
    setWidgets(widgets.map((widget) => {
      return (widget.i === layout.i) ? update : widget
    }))
  }

  const onWidgetResize = layout => {
    const newLayout = _.cloneDeep(layouts)
    const index = _.findIndex(newLayout[currentBreakpoint], { i: layout.i })
    newLayout[currentBreakpoint][index] = layout
    setLayouts(newLayout)
  }

  const onWidgetDelete = layout => {
    setWidgets(_.reject(widgets, { i: layout.i }))
    const newLayout = _.cloneDeep(layouts)
    Object.keys(newLayout).forEach(breakpoint => {
      newLayout[breakpoint] = _.reject(newLayout[breakpoint], { i: layout.i })
    })
    setLayouts(newLayout)
  }

  const onLayoutChange = (layout, layouts) => {
    setLayouts(layouts)
  }

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint)
  }

  const onEditModeOn = () => {
    setEditMode(true)
    setAddMode(false)
    setBackupLayouts(layouts)
  }

  const onAddChange = () => {
    setAddMode(!addMode)
  }

  const onCancelEdit = () => {
    setEditMode(false)
    setLayouts(backupLayouts)
  }

  const onResetEdit = async () => {
    await DashboardAPI.resetDashboard()
    initDashboard()
    setAddMode(false)
    setEditMode(false)
  }

  const onSaveEdit = async () => {
    await DashboardAPI.saveDashboard(widgets, layouts, config)
    setAddMode(false)
    setEditMode(false)
  }

  return (
    <DashboardRender
      t={t} addMode={addMode} editMode={editMode} onEditModeOn={onEditModeOn} onCancelEdit={onCancelEdit}
      onSaveEdit={onSaveEdit} onResetEdit={onResetEdit} onAddChange={onAddChange} mounted={mounted}
      layouts={layouts} onLayoutChange={onLayoutChange} onBreakpointChange={onBreakpointChange} currentBreakpoint={currentBreakpoint}
      widgets={widgets} availableWidgets={availableWidgets} setWidgets={setWidgets} onWidgetUpdate={onWidgetUpdate}
      onWidgetResize={onWidgetResize} onWidgetDelete={onWidgetDelete}
    />
  )
}

Dashboard.propTypes = {
  t: PT.func.isRequired
}

Dashboard.defaultProps = DashboardConfig
const DashboardDragAndDropContext = withTranslation()(Dashboard)
export default DashboardDragAndDropContext
