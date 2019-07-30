import React from 'react'
import _ from 'lodash'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { DropTarget } from 'react-dnd'
import classNames from 'classnames'
import WidgetContainer from './Widget/WidgetContainer'
import DashboardConfig from './Config/DashboardConfig'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const DashboardGrid = (props) => {
  return props.connectDropTarget(<div
    id='dashboardGrid'
    className={classNames('c-d-dashboardGrid', {
      canDrop: props.canDrop
    })}>
    <ResponsiveReactGridLayout
      {...props}
      breakpoints={DashboardConfig.breakpoints}
      autoSize
      margin={DashboardConfig.margin}
      containerPadding={DashboardConfig.containerPadding}
      isDraggable={props.editMode}
      isResizable={props.editMode}
      layouts={props.layouts}
      onBreakpointChange={props.onBreakpointChange}
      onLayoutChange={props.onLayoutChange}
      measureBeforeMount={false}
      useCSSTransforms={false}
      preventCollision={false}
      draggableHandle={'.draggableHandle'}
      dragApiRef={props.dragApi}
    >
      {_.map(props.layouts[props.currentBreakpoint], (layout) => {
        return <div id={'widget-' + layout.i} key={layout.i}>
          <WidgetContainer
            layout={layout}
            widget={_.find(props.widgets, { i: layout.i })}
            editMode={props.editMode}
            currentBreakpoint={props.currentBreakpoint}
            onWidgetResize={props.onWidgetResize}
            onWidgetUpdate={props.onWidgetUpdate}
            onWidgetDelete={props.onWidgetDelete}
            rowHeight={props.rowHeight}
            availableWidgets={props.availableWidgets}
            t={props.t}
          /></div>
      })}
    </ResponsiveReactGridLayout>
  </div>)
}

DashboardGrid.defaultProps = DashboardConfig

const WidgetDropTarget = DropTarget(
  ['newWidget'],
  {
    canDrop: props => {
      // console.log('DashboardGrid, canDrop')
      return true
    },
    drop: (props, monitor, component) => {
      // console.log('DashboardGrid: drop')
      const position = monitor.getSourceClientOffset()
      // this removes placeholder, dragApi will add widget to layout
      props.dragApi.value.stop({
        position: {
          left: position.x,
          top: position.y
        }
      })
    },
    hover: (props, monitor, component) => {
      // console.log('DashboardGrid: hover')
      const hoverItem = monitor.getItem()
      const position = monitor.getSourceClientOffset()
      const dashboardPosition = {
        x: document.getElementById('dashboardGrid').offsetLeft,
        y: document.getElementById('dashboardGrid').offsetTop
      }

      if (props.dragApi.value) {
        if (dashboardPosition.x < position.x && dashboardPosition.y < position.y) {
          props.dragApi.value.dragIn({
            i: hoverItem.newId,
            w: hoverItem.widget.layout[props.currentBreakpoint].defaultW,
            h: hoverItem.widget.layout[props.currentBreakpoint].defaultH,
            minH: hoverItem.widget.layout[props.currentBreakpoint].minH,
            maxH: hoverItem.widget.layout[props.currentBreakpoint].maxH,
            minW: hoverItem.widget.layout[props.currentBreakpoint].minW,
            maxW: hoverItem.widget.layout[props.currentBreakpoint].maxW,
            position: {
              left: position.x,
              top: position.y
            }
          })
        } else {
          props.dragApi.value.dragOut({
            position: {
              left: position.x,
              top: position.y
            }
          })
        }
      }
    }
  },
  (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }
  }
)(DashboardGrid)

export default WidgetDropTarget
