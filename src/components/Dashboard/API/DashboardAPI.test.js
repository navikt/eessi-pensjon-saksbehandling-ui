/* global localStorage */

import defaultWidgets from 'components/Dashboard/Config/DefaultWidgets'
import defaultLayouts from 'components/Dashboard/Config/DefaultLayout'
import availableWidgets from 'components/Dashboard/Config/AvailableWidgets'
import * as DashboardAPI from './DashboardAPI'

describe('components/Dashboard/API/DashboardAPI', () => {
  it('loadDashboard() - no localStorage', async (done) => {
    const [widgets, layouts] = await DashboardAPI.loadDashboard()
    expect(widgets).toEqual(defaultWidgets)
    expect(layouts).toEqual(defaultLayouts)
    done()
  })

  it('loadDashboard() - with localStorage', async (done) => {
    localStorage.setItem('c-d-layouts', '{"foo": "bar"}')
    localStorage.setItem('c-d-widgets', '{"foo": "bar"}')
    const mockContent = { foo: 'bar' }

    const [widgets, layouts] = await DashboardAPI.loadDashboard()
    expect(widgets).toEqual(mockContent)
    expect(layouts).toEqual(mockContent)
    done()
  })

  it('saveDashboard()', async (done) => {
    const mockWidgets = { value: 'mockWidgets' }
    const mockLayouts = { value: 'mockLayouts' }
    await DashboardAPI.saveDashboard(mockWidgets, mockLayouts)

    const savedLayouts = localStorage.getItem('c-d-layouts')
    const savedWidgets = localStorage.getItem('c-d-widgets')
    expect(savedLayouts).toEqual(JSON.stringify(mockLayouts))
    expect(savedWidgets).toEqual(JSON.stringify(mockWidgets))
    done()
  })

  it('loadAvailableWidgets()', async (done) => {
    const loadedAvailableWidgets = await DashboardAPI.loadAvailableWidgets()
    expect(loadedAvailableWidgets).toEqual(availableWidgets)
    done()
  })
})
