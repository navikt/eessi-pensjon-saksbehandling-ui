/* global localStorage */

const defaultWidgets = require('../Config/DefaultWidgets').default
const defaultLayouts = require('../Config/DefaultLayout').default

export async function loadDashboard () {
  let layouts = await localStorage.getItem('c-d-layouts')
  layouts = layouts ? JSON.parse(layouts) : defaultLayouts
  let widgets = await localStorage.getItem('c-d-widgets')
  widgets = widgets ? JSON.parse(widgets) : defaultWidgets
  return [widgets, layouts]
}

export async function saveDashboard (widgets, layouts) {
  await localStorage.setItem('c-d-widgets', JSON.stringify(widgets))
  await localStorage.setItem('c-d-layouts', JSON.stringify(layouts))
}

export async function loadAvailableWidgets () {
  return require('../Config/AvailableWidgets').default
}
