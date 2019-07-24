import React from 'react'
import BUCCrumbs from './BUCCrumbs'

describe('applications/BUC/components/BUCCrumbs/BUCCrumbs', () => {
  let initialMockProps = {
    t: jest.fn((translationString) => { return translationString }),
    actions: {
      resetSed: jest.fn(),
      resetBuc: jest.fn(),
      setMode: jest.fn()
    },
    mode: ''
  }

  it('renders successfully', () => {
    const wrapper = shallow(<BUCCrumbs {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Goes to Home when in New BUC mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucnew' />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(2)
    expect(wrapper.find('a')).toHaveLength(1)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to Home when in Edit BUC mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='bucedit' buc={{ type: 'mockBuc' }} />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(2)
    expect(wrapper.find('a')).toHaveLength(1)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to Home when in New SED mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    expect(wrapper.find('div.a-buc-c-buccrumb')).toHaveLength(3)
    expect(wrapper.find('a')).toHaveLength(2)
    wrapper.find('a[title="buc:buccrumb-home"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('buclist')
  })

  it('Goes to BUC Edit when in New SED mode', () => {
    const wrapper = mount(<BUCCrumbs {...initialMockProps} mode='sednew' buc={{ type: 'mockBuc' }} />)
    wrapper.find('a[title="buc:buc-mockBuc"]').simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('bucedit')
  })
})
