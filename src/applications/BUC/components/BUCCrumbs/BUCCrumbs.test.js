import React from 'react'
import BUCCrumbs from './BUCCrumbs'
import sampleBucs from 'resources/tests/sampleBucs'

const bucReducer = (currentBucs, newBuc) => {
  currentBucs[newBuc.caseId] = newBuc
  return currentBucs
}
const mockBucs = sampleBucs.reduce(bucReducer, {})

describe('applications/BUC/components/BUCCrumbs/BUCCrumbs', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      resetSed: jest.fn(),
      resetBuc: jest.fn(),
      setMode: jest.fn()
    },
    bucs: mockBucs,
    currentBuc: '195440',
    mode: '',
    showLastLink: true,
    t: jest.fn((translationString) => { return translationString })
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    wrapper = shallow(<BUCCrumbs {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucnew' />)
    expect(wrapper.exists('.a-buc-c-buccrumbs')).toBeTruthy()
  })

  it('Goes to Home when in New BUC mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucnew' />)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to BUCNew when in BUC new mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucnew' />)
    wrapper.find('a[title="buc:buccrumb-newbuc"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('bucnew')
  })

  it('Goes to Home when in Edit BUC mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucedit' buc={{ type: 'mockBuc' }} />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(2)
    expect(wrapper.find('a')).toHaveLength(2)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to Home when in New SED mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(3)
    expect(wrapper.find('a')).toHaveLength(3)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to BUC Edit when in New SED mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    wrapper.find('a[title="buc:buc-P_BUC_01"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('bucedit')
  })

  it('Goes to SEDNew when in SED new mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    wrapper.find('a[title="buc:buccrumb-newsed"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('sednew')
  })
})
