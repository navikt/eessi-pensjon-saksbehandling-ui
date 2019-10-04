import React from 'react'
import PT from 'prop-types'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { createDragApiRef } from 'react-grid-layout'
import WidgetAddArea from './Widget/WidgetAddArea'
import DashboardGrid from './DashboardGrid'
import DashboardControlPanel from './DashboardControlPanel'
import { Nav } from 'eessi-pensjon-ui'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './Dashboard.css'

const dragApi = createDragApiRef()

export const DashboardRender = ({
  addMode, availableWidgets, currentBreakpoint, editMode, layouts, mounted, onAddChange,
  onBreakpointChange, onCancelEdit, onEditModeOn, onLayoutChange, onResetEdit, onSaveEdit,
  onWidgetDelete, onWidgetResize, onWidgetUpdate, t, setWidgets, widgets
}) => {
  if (!mounted) {
    return (
      <div className='c-dashboard__loading text-center' style={{ paddingTop: '3rem' }}>
        <Nav.Spinner />
        <Nav.Normaltekst>{t('ui:loading')}</Nav.Normaltekst>
      </div>
    )
  } else {
    return (
      <div className='c-dashboard'>
        <DndProvider backend={HTML5Backend}>
          <DashboardControlPanel
            currentBreakpoint={currentBreakpoint}
            addMode={addMode}
            editMode={editMode}
            onEditModeOn={onEditModeOn}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            onResetEdit={onResetEdit}
            onAddChange={onAddChange}
            t={t}
          />
          {addMode ? (
            <WidgetAddArea
              currentBreakpoint={currentBreakpoint}
              availableWidgets={availableWidgets}
              widgets={widgets}
              setWidgets={setWidgets}
              t={t}
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
            t={t}
            dragApi={dragApi}
          />
        </DndProvider>
      </div>
    )
  }
}

DashboardRender.propTypes = {
  addMode: PT.bool.isRequired,
  availableWidgets: PT.array.isRequired,
  currentBreakpoint: PT.string.isRequired,
  editMode: PT.bool.isRequired,
  layouts: PT.object.isRequired,
  onAddChange: PT.func.isRequired,
  onBreakpointChange: PT.func.isRequired,
  onCancelEdit: PT.func.isRequired,
  onEditModeOn: PT.func.isRequired,
  onLayoutChange: PT.func.isRequired,
  onResetEdit: PT.func.isRequired,
  onSaveEdit: PT.func.isRequired,
  onWidgetDelete: PT.func.isRequired,
  onWidgetResize: PT.func.isRequired,
  onWidgetUpdate: PT.func.isRequired,
  t: PT.func.isRequired,
  widgets: PT.array
}
export default DashboardRender
