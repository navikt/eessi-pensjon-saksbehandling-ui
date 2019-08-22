import React from 'react'
import BUCEmpty from './BUCEmpty'

describe('applications/BUC/widgets/BUCEmpty/BUCEmpty', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    actions: {
      setStatusParam: jest.fn()
    },
    onBUCNew: jest.fn(),
    t: t
  }

  it('Renders', () => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure with forms when no aktoerId and sakId', () => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-bucempty')).toBeTruthy()
    expect(wrapper.exists('.a-buc-bucempty__artwork')).toBeTruthy()
    expect(wrapper.exists('.a-buc-bucempty__title')).toBeTruthy()
    expect(wrapper.exists('#a-buc-bucempty__newbuc-link-id')).toBeTruthy()
    expect(wrapper.exists('.a-buc-bucempty__form')).toBeTruthy()
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-input-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-bucempty__sakid-input-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-bucempty__sakid-button-id')).toBeTruthy()
  })

  it('Has proper HTML structure without forms when aktoerId and sakId', () => {
    const mockProps = {
      ...initialMockProps,
      aktoerId: '123',
      sakId: '456'
    }
    wrapper = mount(<BUCEmpty {...mockProps} />)
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-input-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-button-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-bucempty__sakid-input-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-bucempty__sakid-button-id')).toBeFalsy()
  })

  it('Goes to bucnew when button pressed', () => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
    wrapper.find('#a-buc-bucempty__newbuc-link-id').hostNodes().simulate('click')
    expect(initialMockProps.onBUCNew).toHaveBeenCalled()
  })

  it('Handles added aktoerId and sakId', () => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
    wrapper.find('#a-buc-bucempty__aktoerid-input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.update()
    wrapper.find('#a-buc-bucempty__aktoerid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(initialMockProps.actions.setStatusParam).toBeCalledWith('aktoerId', '123')

    wrapper.find('#a-buc-bucempty__sakid-input-id').hostNodes().simulate('change', { target: { value: '123' } })
    wrapper.update()
    wrapper.find('#a-buc-bucempty__sakid-button-id').hostNodes().simulate('click')
    wrapper.update()
    expect(initialMockProps.actions.setStatusParam).toBeCalledWith('sakId', '123')
  })
})
