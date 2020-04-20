import { BucsInfo, Tags } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import mockBucs from 'mocks/buc/bucs'
import React from 'react'
import { stageSelector } from 'setupTests'
import BUCEdit, { BUCEditProps } from './BUCEdit'

const defaultSelector = {
  loading: {},
  locale: 'nb',
  bucsInfo: {} as BucsInfo
}

describe('applications/BUC/widgets/BUCEdit/BUCEdit', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCEditProps = {
    aktoerId: '123',
    bucs: _.keyBy(mockBucs(), 'caseId'),
    currentBuc: '195440',
    setMode: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
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
    expect(wrapper.exists('.a-buc-p-bucedit')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-bucedit__new-sed-button-id')).toBeTruthy()
    expect(wrapper.exists('SEDSearch')).toBeTruthy()
    expect(wrapper.exists('BUCDetail')).toBeTruthy()
    expect(wrapper.exists('BUCTools')).toBeTruthy()
  })

  it('moves to mode newsed when button pressed', () => {
    const newSedButton = wrapper.find('#a-buc-p-bucedit__new-sed-button-id').hostNodes()
    newSedButton.simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('sednew')
  })

  it('SEDSearch status start triggers the filter functions', () => {
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(1)
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
    wrapper = mount(<BUCEdit {...initialMockProps} initialStatusSearch={[{ value: 'XXX' }] as Tags} />)
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(0)
  })

  it('Performs a status search that will find elements', () => {
    wrapper = mount(<BUCEdit {...initialMockProps} initialStatusSearch={[{ label: 'ui:received', value: 'received' }]} />)
    expect(wrapper.find('.a-buc-c-sedlistheader').hostNodes().length).toEqual(1)
  })
})
