import React from 'react'
import BucHeader from './BUCHeader'
import moment from 'moment'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCHeader/BUCHeader', () => {
  let wrapper
  const buc = sampleBucs[0]
  const initialMockProps = {
    buc: buc,
    bucInfo: sampleBucsInfo.bucs[buc.caseId],
    locale: 'nb',
    onBUCEdit: jest.fn(),
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<BucHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-bucheader')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__label')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__title')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__description')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__description').hostNodes().render().text()).toEqual(
      'ui:created: ' + moment(buc.startDate).format('DD.MM.YYYY')
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__owner').hostNodes().render().text()).toEqual(
      'buc:form-caseOwner: Norge - Z990638'
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner-institutions')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icons')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icon-numberofseds')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__icon-numberofseds').render().text()).toEqual('1')
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__actions')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__bucedit-link')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__bucedit-link').hostNodes().render().text()).toEqual('ui:processing')
  })

  it('Shows icons if necessary', () => {
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeTruthy()
    wrapper.setProps({
      bucInfo: {
        tags: [],
        comment: undefined
      },
      buc: {
        ...buc,
        seds: []
      }
    })
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeFalsy()
  })

  it('Handles click in Knapp', () => {
    expect(initialMockProps.onBUCEdit).toHaveBeenCalledTimes(0)
    wrapper.find('Knapp').simulate('click', {
      preventDefault: () => {},
      stopPropagation: () => {}
    })
    expect(initialMockProps.onBUCEdit).toHaveBeenCalled()
  })
})
