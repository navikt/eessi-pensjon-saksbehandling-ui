import React from 'react'
import PT from 'prop-types'
import { DragLayer } from 'react-dnd'
import Widget from './Widget'
import DashboardConfig from 'components/Dashboard/Config/DashboardConfig'

export const WidgetAddPreview = ({ currentBreakpoint, currentOffset, initialOffset, isDragging, item, t }) => {
  if (!isDragging) {
    return null
  }

  const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  }

  const gridSizeToPixelSize = (w, h, breakpoint) => {
    const gridWidth = document.getElementById('dashboardGrid').offsetWidth
    const gridUnitWidth = Math.ceil(gridWidth / DashboardConfig.cols[breakpoint])
    const dimension = {
      height: (h * (DashboardConfig.rowHeight + 10) - 10) + 'px',
      width: (w * gridUnitWidth - 10) + 'px'
    }
    return dimension
  }

  const widget = item.widget
  const dimensions = gridSizeToPixelSize(
    widget.layout[currentBreakpoint].defaultW,
    widget.layout[currentBreakpoint].defaultH,
    currentBreakpoint
  )

  const getItemStyles = (initialOffset, currentOffset, dimensions) => {
    if (!initialOffset || !currentOffset) {
      return {
        display: 'none'
      }
    }
    const { x, y } = currentOffset
    return {
      transform: `translate(${x}px, ${y}px)`,
      backgroundColor: 'white',
      width: dimensions.width,
      height: dimensions.height,
      padding: '10px',
      border: '1px solid lightgrey',
      boxShadow: '3px 3px 3px lightgrey'
    }
  }

  return (
    <div className='c-d-widgetAddPreview' style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, dimensions)}>
        <Widget widget={widget} t={t} />
      </div>
    </div>
  )
}

WidgetAddPreview.propTypes = {
  currentBreakpoint: PT.string.isRequired,
  currentOffset: PT.object,
  initialOffset: PT.object,
  isDragging: PT.bool,
  item: PT.object,
  t: PT.func.isRequired
}

const WidgetAddPreviewDragLayer = DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))(WidgetAddPreview)

export default WidgetAddPreviewDragLayer
