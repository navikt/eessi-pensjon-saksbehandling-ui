import React from 'react'
import BucHeader from './BucHeader'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('rendering BucHeader', () => {
  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo['bucs'][buc.type + '-' + buc.caseId]
  const t = jest.fn((translationString) => { return translationString })
  const onBUCEdit = jest.fn(() => {})
  const initialMockProps = {
    t: t,
    locale: 'nb',
    buc: buc,
    bucInfo: bucInfo,
    onBUCEdit: onBUCEdit
  }

  it('Renders without crashing', () => {
    let wrapper = shallow(<BucHeader />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders child components', () => {
    let wrapper = shallow(<BucHeader {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-bucheader')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__label')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__title')).toEqual(true)
    expect(wrapper.find('.a-buc-c-bucdetail__props-type').render().text()).toEqual(
      buc.type + ' - ' + t('buc:buc-' + buc.type)
    )
    expect(wrapper.exists('.a-buc-c-bucheader__description')).toEqual(
      new Date(buc.startDate).toLocaleDateString() + ' - ' + new Date(buc.lastUpdate).toLocaleDateString()
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner')).toEqual(true)
    expect(wrapper.find('.a-buc-c-bucdetail__props-type').render().text()).toEqual(
      t('buc:form-caseOwner') + ': Norge xc'
    )
    expect(wrapper.exists('.a-buc-c-bucheader__flags')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__icons')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-numberofseds')).toEqual(true)
    expect(wrapper.find('.a-buc-c-bucdetail__icon-numberofseds').render().text()).toEqual('1')
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__tag-actions')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__bucedit-button')).toEqual(true)
    expect(wrapper.find('.a-buc-c-bucdetail__bucedit-button').render().text()).toEqual(t('ui:processing'))
  })

  it('Conditionally renders Icons', () => {
    let wrapper = shallow(<BucHeader {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toEqual(true)
    wrapper.setProps({
      bucInfo: {
        tags: [],
        comment: undefined
      },
      buc: {
        ...buc,
        attachments: []
      }
    })

    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toEqual(false)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toEqual(false)
  })
})

describe('BucHeader logic', () => {
  it('Handles onClick and prevent bubbling', () => {
    let mockClickHandler = jest.fn()

    let mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    }

    let wrapper = shallow(<BucHeader behandlingOnClick={mockClickHandler} />)

    expect(mockClickHandler).toHaveBeenCalledTimes(0)
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(0)
    expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(0)

    wrapper.find('LenkepanelBase').simulate('click', mockEvent)

    expect(mockClickHandler).toHaveBeenCalled()
    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.stopPropagation).toHaveBeenCalled()
  })
})
