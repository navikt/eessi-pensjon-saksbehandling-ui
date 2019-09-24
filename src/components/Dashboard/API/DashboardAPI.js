/* global localStorage */

import defaultWidgets from 'components/Dashboard/Config/DefaultWidgets'
import defaultLayouts from 'components/Dashboard/Config/DefaultLayout'
import defaultConfig from 'components/Dashboard/Config/DefaultConfig'
import DashboardConfig from 'components/Dashboard/Config/DashboardConfig'

const dashboardNeedsUpgrade = (instanceVersion, dashboardVersion) => {
  return dashboardVersion > instanceVersion
}

export const loadDashboard = async () => {
  let layouts, widgets
  let config = await localStorage.getItem('c-d-config')
  config = config ? JSON.parse(config) : defaultConfig
  if (dashboardNeedsUpgrade(config.version, DashboardConfig.version)) {
    layouts = defaultLayouts
    widgets = defaultWidgets
  } else {
    layouts = await localStorage.getItem('c-d-layouts')
    layouts = layouts ? JSON.parse(layouts) : defaultLayouts
    widgets = await localStorage.getItem('c-d-widgets')
    widgets = widgets ? JSON.parse(widgets) : defaultWidgets
  }
  return [widgets, layouts, config]
}

export const saveDashboard = async (widgets, layouts, config) => {
  await localStorage.setItem('c-d-config', JSON.stringify(config))
  await localStorage.setItem('c-d-widgets', JSON.stringify(widgets))
  await localStorage.setItem('c-d-layouts', JSON.stringify(layouts))
}

export const loadAvailableWidgets = async () => {
  return require('components/Dashboard/Config/AvailableWidgets').default
}
