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
      setCurrentSed: jest.fn()
    },
    aktoerId: '123',
    bucs: mockBucs,
    currentBuc: '195440',
    institutionNames: {},
    loading: {},
    locale: 'nb',
    rinaUrl: 'http://mockUrl/rinaUrl',
    seds: sampleBucs[0].seds,
    setMode: jest.fn(),
    t: jest.fn(t => t),
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

  it('Renders null without bucs', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} bucs={{}} />)
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('Renders null without currentBuc', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} currentBuc={undefined} />)
    expect(wrapper.isEmptyRender()).toBeTruthy()
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
    expect(initialMockProps.setMode).toBeCalledWith('sednew')
  })

  it('SEDSearch status start triggers the filter functions', () => {
    expect(wrapper.find('.a-buc-c-sedheader').hostNodes().length).toEqual(1)
    const sedSearch = wrapper.find('.a-buc-c-sedsearch').hostNodes()

    const statusSelect = sedSearch.find('#a-buc-c-sedsearch__status-select-id input')
    statusSelect.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 })

    expect(wrapper.find('#a-buc-c-sedsearch__status-select-id .c-multipleOption').length).toEqual(4)
    expect(wrapper.find('#a-buc-c-sedsearch__status-select-id .c-multipleOption').at(0).render().text()).toEqual('ui:cancelled')

    statusSelect.simulate('keyDown', { key: 'Enter', keyCode: 13 })
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(0)
  })

  it('SEDSearch query search triggers the filter functions', () => {
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(1)
    const sedSearch = wrapper.find('.a-buc-c-sedsearch').hostNodes()

    const queryInput = sedSearch.find('input#a-buc-c-sedsearch__query-input-id').hostNodes()
    queryInput.simulate('change', { target: { value: 'XXX' } })

    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(0)
  })

  it('Performs a query search that will not find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialSearch='XXX' />)
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(0)
  })

  it('Performs a query search that will find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialSearch='P2000' />)
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(1)
  })

  it('Performs a status search that will not find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialStatusSearch='XXX' />)
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(0)
  })

  it('Performs a status search that will find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialStatusSearch='cancelled' />)
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(1)
  })
})
