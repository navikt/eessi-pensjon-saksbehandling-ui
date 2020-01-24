import { getPersonInfo } from 'actions/app'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Overview, OverviewProps, OverviewSelector } from './Overview'

jest.mock('actions/app', () => ({
  getPersonInfo: jest.fn()
}))

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector: OverviewSelector = {
  aktoerId: '123',
  gettingPersonInfo: false,
  highContrast: false,
  locale: 'nb',
  person: undefined
};

(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

export const setup = (params: any) => {
  (useSelector as jest.Mock).mockImplementation(() => ({
    ...defaultSelector,
    ...params
  }))
}

describe('widgets/Overview/Overview', () => {
  let wrapper: ReactWrapper
  const initialMockProps: OverviewProps = {
    onUpdate: jest.fn(),
    skipMount: false,
    widget: {
      i: 'i',
      type: 'foo',
      visible: true,
      title: 'foo',
      options: {
        collapsed: false
      }
    }
  }

  beforeEach(() => {
    wrapper = mount(<Overview {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('UseEffect: fetches person info when mounting', () => {
    expect(getPersonInfo).toHaveBeenCalled()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-overview')).toBeTruthy()
    expect(wrapper.exists('EkspanderbartpanelBase')).toBeTruthy()
    expect(wrapper.exists('PersonTitle')).toBeTruthy()
    expect(wrapper.exists('PersonPanel')).toBeTruthy()
  })

  it('With no aktoerId', () => {
    setup({ aktoerId: undefined })
    wrapper = mount(<Overview {...initialMockProps} />)
    expect(wrapper.exists('.w-overview__alert')).toBeTruthy()
    expect(wrapper.find('.w-overview__alert').hostNodes().render().text()).toEqual('buc:validation-noAktoerId')
  })

  it('Expandable ', () => {
    setup({ aktoerId: '123' })
    wrapper = mount(<Overview {...initialMockProps} skipMount />)
    wrapper.find('EkspanderbartpanelBase button').simulate('click')
    expect(initialMockProps.onUpdate).toHaveBeenCalledWith(expect.objectContaining({
      options: {
        collapsed: true
      }
    }))
  })
})
