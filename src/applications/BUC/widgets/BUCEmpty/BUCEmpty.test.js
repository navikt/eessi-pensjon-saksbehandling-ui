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

  it('renders successfully', () => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders, with forms when no aktoerId and sakId', () => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-bucempty')).toEqual(true)
    expect(wrapper.exists('.a-buc-bucempty__artwork')).toEqual(true)
    expect(wrapper.exists('.a-buc-bucempty__title')).toEqual(true)
    expect(wrapper.exists('#a-buc-bucempty__newbuc-link-id')).toEqual(true)
    expect(wrapper.exists('.a-buc-bucempty__form')).toEqual(true)
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-input-id')).toEqual(true)
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-button-id')).toEqual(true)
    expect(wrapper.exists('#a-buc-bucempty__sakid-input-id')).toEqual(true)
    expect(wrapper.exists('#a-buc-bucempty__sakid-button-id')).toEqual(true)
  })

  it('renders, without forms when aktoerId and sakId', () => {
    let mockProps = { ...initialMockProps,
      aktoerId: '123',
      sakId: '456'
    }
    wrapper = mount(<BUCEmpty {...mockProps} />)
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-input-id')).toEqual(false)
    expect(wrapper.exists('#a-buc-bucempty__aktoerid-button-id')).toEqual(false)
    expect(wrapper.exists('#a-buc-bucempty__sakid-input-id')).toEqual(false)
    expect(wrapper.exists('#a-buc-bucempty__sakid-button-id')).toEqual(false)
  })

  it('goes to bucnew when button pressed', () => {
    wrapper = mount(<BUCEmpty {...initialMockProps} />)
    wrapper.find('#a-buc-bucempty__newbuc-link-id').hostNodes().simulate('click')
    expect(initialMockProps.onBUCNew).toHaveBeenCalled()
  })

  it('can add aktoerId and sakId', () => {
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
