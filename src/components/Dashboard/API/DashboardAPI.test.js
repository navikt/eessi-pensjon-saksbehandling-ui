/* global localStorage */

import defaultWidgets from 'components/Dashboard/Config/DefaultWidgets'
import defaultLayouts from 'components/Dashboard/Config/DefaultLayout'
import defaultConfig from 'components/Dashboard/Config/DefaultConfig'
import availableWidgets from 'components/Dashboard/Config/AvailableWidgets'
import * as DashboardAPI from './DashboardAPI'

describe('components/Dashboard/API/DashboardAPI', () => {
  it('loadDashboard() - no localStorage', async (done) => {
    const [widgets, layouts, config] = await DashboardAPI.loadDashboard()
    expect(widgets).toEqual(defaultWidgets)
    expect(layouts).toEqual(defaultLayouts)
    expect(config).toEqual(defaultConfig)
    done()
  })

  it('loadDashboard() - with localStorage', async (done) => {
    const mockContent = { foo: 'bar' }
    localStorage.setItem('c-d-layouts', JSON.stringify(mockContent))
    localStorage.setItem('c-d-widgets', JSON.stringify(mockContent))
    localStorage.setItem('c-d-config', JSON.stringify(mockContent))

    const [widgets, layouts, config] = await DashboardAPI.loadDashboard()
    expect(widgets).toEqual(mockContent)
    expect(layouts).toEqual(mockContent)
    expect(config).toEqual(mockContent)
    done()
  })

  it('saveDashboard()', async (done) => {
    const mockWidgets = { value: 'mockWidgets' }
    const mockLayouts = { value: 'mockLayouts' }
    const mockConfig = { value: 'mockConfig' }
    await DashboardAPI.saveDashboard(mockWidgets, mockLayouts, mockConfig)

    const savedLayouts = localStorage.getItem('c-d-layouts')
    const savedWidgets = localStorage.getItem('c-d-widgets')
    const savedConfig = localStorage.getItem('c-d-config')
    expect(savedLayouts).toEqual(JSON.stringify(mockLayouts))
    expect(savedWidgets).toEqual(JSON.stringify(mockWidgets))
    expect(savedConfig).toEqual(JSON.stringify(mockConfig))
    done()
  })

  it('loadAvailableWidgets()', async (done) => {
    const loadedAvailableWidgets = await DashboardAPI.loadAvailableWidgets()
    expect(loadedAvailableWidgets).toEqual(availableWidgets)
    done()
  })
})
