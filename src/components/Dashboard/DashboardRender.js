import React from 'react'
import PT from 'prop-types'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { createDragApiRef } from 'react-grid-layout'
import WidgetAddArea from './Widget/WidgetAddArea'
import DashboardGrid from './DashboardGrid'
import DashboardControlPanel from './DashboardControlPanel'
import { Normaltekst, NavFrontendSpinner } from 'components/Nav'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './Dashboard.css'

const dragApi = createDragApiRef()

export const DashboardRender = (props) => {
  const { t, addMode, editMode, onEditModeOn, onCancelEdit, onResetEdit, onSaveEdit, onAddChange, mounted } = props
  const { layouts, onLayoutChange, onBreakpointChange, currentBreakpoint } = props
  const { widgets, availableWidgets, setWidgets, onWidgetUpdate, onWidgetResize, onWidgetDelete } = props

  if (!mounted) {
    return (
      <div className='c-dashboard__loading text-center' style={{ paddingTop: '3rem' }}>
        <NavFrontendSpinner />
        <Normaltekst>{t('ui:loading')}</Normaltekst>
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
  t: PT.func.isRequired
}
export default DashboardRender
