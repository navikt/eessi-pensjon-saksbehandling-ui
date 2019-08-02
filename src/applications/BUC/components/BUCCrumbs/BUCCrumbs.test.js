import React from 'react'
import BUCCrumbs from './BUCCrumbs'

describe('applications/BUC/components/BUCCrumbs/BUCCrumbs', () => {
  const initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    actions: {
      resetSed: jest.fn(),
      resetBuc: jest.fn(),
      setMode: jest.fn()
    },
    showLastLink: true,
    mode: ''
  }

  it('Renders', () => {
    const wrapper = shallow(<BUCCrumbs {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Goes to Home when in New BUC mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucnew' />)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to BUCNew when in BUC new mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucnew' />)
    wrapper.find('a[title="buc:buccrumb-newbuc"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('bucnew')
  })

  it('Goes to Home when in Edit BUC mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucedit' buc={{ type: 'mockBuc' }} />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(2)
    expect(wrapper.find('a')).toHaveLength(2)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to Home when in New SED mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(3)
    expect(wrapper.find('a')).toHaveLength(3)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to BUC Edit when in New SED mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    wrapper.find('a[title="buc:buc-mockBuc"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('bucedit')
  })

  it('Goes to SEDNew when in SED new mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    wrapper.find('a[title="buc:buccrumb-newsed"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('sednew')
  })
})
