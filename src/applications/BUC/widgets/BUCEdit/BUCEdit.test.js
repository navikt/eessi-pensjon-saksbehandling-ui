import React from 'react'
import BUCEdit from './BUCEdit'
import sampleBucs from 'resources/tests/sampleBucs'

const bucReducer = (currentBucs, newBuc) => {
  currentBucs[newBuc.caseId] = newBuc
  return currentBucs
}
const mockBucs = sampleBucs.reduce(bucReducer, {})

describe('applications/BUC/widgets/BUCEdit/BUCEdit', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      setMode: jest.fn()
    },
    aktoerId: '123',
    bucs: mockBucs,
    currentBuc: '195440',
    institutionNames: {},
    loading: {},
    locale: 'nb',
    rinaUrl: 'http://mockUrl/rinaUrl',
    seds: sampleBucs[0].seds,
    t: jest.fn((translationString) => { return translationString }),
    tagList: ['mockTag1', 'mockTag2']
  }

  beforeEach(() => {
    wrapper = mount(<BUCEdit {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-bucedit')).toBeTruthy()
    expect(wrapper.exists('#a-buc-bucedit__new-sed-button-id')).toBeTruthy()
    expect(wrapper.exists('SEDSearch')).toBeTruthy()
    expect(wrapper.exists('BUCDetail')).toBeTruthy()
    expect(wrapper.exists('BUCTools')).toBeTruthy()
  })

  it('moves to mode newsed when button pressed', () => {
    const newSedButton = wrapper.find('#a-buc-bucedit__new-sed-button-id').hostNodes()
    newSedButton.simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('sednew')
  })

  it('SEDSearch status searttriggers the filter functions', () => {
    expect(wrapper.find('.a-buc-c-sedrow').hostNodes().length).toEqual(1)
    const sedSearch = wrapper.find('.a-buc-c-sedsearch').hostNodes()

    const statusSelect = sedSearch.find('#a-buc-c-sedsearch__status-select-id input')
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })

    expect(wrapper.find('#a-buc-c-sedsearch__status-select-id .c-multipleOption').length).toEqual(4)
    expect(wrapper.find('#a-buc-c-sedsearch__status-select-id .c-multipleOption').at(0).render().text()).toEqual('ui:new')

    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(wrapper.find('.a-buc-c-sedrow').hostNodes().length).toEqual(0)
  })
})
