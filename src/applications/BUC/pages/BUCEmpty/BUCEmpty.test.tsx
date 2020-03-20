import { setStatusParam } from 'actions/app'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import BUCEmpty, { BUCEmptyProps } from './BUCEmpty'

const defaultSelector = {
  rinaUrl: 'http://mock.url'
}

jest.mock('actions/app', () => ({
  setStatusParam: jest.fn()
}))

describe('applications/BUC/widgets/BUCEmpty/BUCEmpty', () => {
  let wrapper: ReactWrapper
  const initialMockProps: BUCEmptyProps = {
    onBUCNew: jest.fn()
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure with forms when no aktoerId and sakId', () => {
    expect(wrapper.exists('.a-buc-p-bucempty')).toBeTruthy()
    expect(wrapper.exists('.a-buc-p-bucempty__artwork')).toBeTruthy()
    expect(wrapper.exists('.a-buc-p-bucempty__title')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-bucempty__newbuc-link-id')).toBeTruthy()
    expect(wrapper.exists('.a-buc-p-bucempty__form')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-bucempty__aktoerid-input-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-bucempty__aktoerid-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-bucempty__sakid-input-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-p-bucempty__sakid-button-id')).toBeTruthy()
  })

  it('Has proper HTML structure without forms when aktoerId and sakId', () => {
    const mockProps = {
      ...initialMockProps,
      aktoerId: '123',
      sakId: '456'
    }
    wrapper = mount(<BUCEmpty {...mockProps} />)
    expect(wrapper.exists('#a-buc-p-bucempty__aktoerid-input-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-p-bucempty__aktoerid-button-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-p-bucempty__sakid-input-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-p-bucempty__sakid-button-id')).toBeFalsy()
  })

  it('Goes to bucnew when button pressed', () => {
    wrapper.find('#a-buc-p-bucempty__newbuc-link-id').hostNodes().simulate('click')
    expect(initialMockProps.onBUCNew).toHaveBeenCalled()
  })

  it('Handles added aktoerId and sakId', () => {
    wrapper.find('#a-buc-p-bucempty__aktoerid-input-id').hostNodes().simulate('change', { target: { value: 'notvalid' } })
    wrapper.find('#a-buc-p-bucempty__aktoerid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.find('#a-buc-p-bucempty__aktoerid-input-id .skjemaelement__feilmelding').render().text()).toEqual('buc:validation-noAktoerId')

    wrapper.find('#a-buc-p-bucempty__aktoerid-input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('#a-buc-p-bucempty__aktoerid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(setStatusParam).toBeCalledWith('aktoerId', '123')

    wrapper.find('#a-buc-p-bucempty__sakid-input-id').hostNodes().simulate('change', { target: { value: 'notvalid' } })
    wrapper.find('#a-buc-p-bucempty__sakid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(wrapper.find('#a-buc-p-bucempty__sakid-input-id .skjemaelement__feilmelding').render().text()).toEqual('buc:validation-noSakId')

    wrapper.find('#a-buc-p-bucempty__sakid-input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.find('#a-buc-p-bucempty__sakid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(setStatusParam).toBeCalledWith('sakId', '123')
  })
})
