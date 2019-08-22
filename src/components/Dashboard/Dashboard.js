import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { withTranslation } from 'react-i18next'
import { createDragApiRef } from 'react-grid-layout'
import WidgetAddArea from './Widget/WidgetAddArea'
import DashboardGrid from './DashboardGrid'
import DashboardControlPanel from './DashboardControlPanel'
import DashboardConfig from './Config/DashboardConfig'
import * as DashboardAPI from './API/DashboardAPI'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './Dashboard.css'

const dragApi = createDragApiRef()

const Dashboard = (props) => {
  const [editMode, setEditMode] = useState(false)
  const [addMode, setAddMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [widgets, setWidgets] = useState([])
  const [layouts, setLayouts] = useState({})
  const [backupLayouts, setBackupLayouts] = useState({})
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
  const [availableWidgets, setAvailableWidgets] = useState([])

  useEffect(() => {
    const loadData = async () => {
      const _availableWidgets = await DashboardAPI.loadAvailableWidgets()
      setAvailableWidgets(_availableWidgets)
      const [_widgets, _layouts] = await DashboardAPI.loadDashboard()
      setWidgets(_widgets)
      setLayouts(_layouts)
      setMounted(true)
    }
    loadData()
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

  const onSaveEdit = async () => {
    await DashboardAPI.saveDashboard(widgets, layouts)
    setAddMode(false)
    setEditMode(false)
  }

  if (!mounted) {
    return <div>Wait</div>
  }

  return (
    <div className='c-d-dashboard'>
      <DndProvider backend={HTML5Backend}>
        <DashboardControlPanel
          currentBreakpoint={currentBreakpoint}
          addMode={addMode}
          editMode={editMode}
          onEditModeOn={onEditModeOn}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onAddChange={onAddChange}
          t={props.t}
        />
        {addMode ? (
          <WidgetAddArea
            currentBreakpoint={currentBreakpoint}
            availableWidgets={availableWidgets}
            widgets={widgets}
            setWidgets={setWidgets}
            t={props.t}
            dragApi={dragApi}
          />
        )
          : null}
        <DashboardGrid
          editMode={editMode}
          layouts={layouts}
          widgets={widgets}
          mounted={mounted}
          currentBreakpoint={currentBreakpoint}
          onBreakpointChange={onBreakpointChange}
          onLayoutChange={onLayoutChange}
          onWidgetUpdate={onWidgetUpdate}
          onWidgetResize={onWidgetResize}
          onWidgetDelete={onWidgetDelete}
          availableWidgets={availableWidgets}
          t={props.t}
          dragApi={dragApi}
        />
      </DndProvider>
    </div>
  )
}

Dashboard.defaultProps = DashboardConfig
const DashboardDragAndDropContext = withTranslation()(Dashboard)
export default DashboardDragAndDropContext
