import { BUCMode } from 'applications/BUC/index'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import BUCCrumbs, { BUCCrumbsProps } from './BUCCrumbs'

describe('applications/BUC/components/BUCCrumbs/BUCCrumbs', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCCrumbsProps = {
    bucs: _.keyBy(mockBucs(), 'caseId'),
    currentBuc: '195440',
    mode: 'buclist' as BUCMode,
    showLastLink: true,
    setMode: jest.fn()
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} />)
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
    expect(initialMockProps.setMode).toBeCalledWith('buclist')
  })

  it('Goes to BUCNew when in BUC new mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucnew' />)
    wrapper.find('a[title="buc:buccrumb-newbuc"]').simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('bucnew')
  })

  it('Goes to Home when in Edit BUC mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucedit' />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(2)
    expect(wrapper.find('a')).toHaveLength(2)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('buclist')
  })

  it('Goes to Home when in New SED mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(3)
    expect(wrapper.find('a')).toHaveLength(3)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('buclist')
  })

  it('Goes to BUC Edit when in New SED mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' currentBuc={mockBucs()[0].caseId} />)
    wrapper.find('a[title="buc:buc-P_BUC_01"]').simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('bucedit')
  })

  it('Goes to SEDNew when in SED new mode', () => {
    wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' />)
    wrapper.find('a[title="buc:buccrumb-newsed"]').simulate('click')
    expect(initialMockProps.setMode).toBeCalledWith('sednew')
  })
})
