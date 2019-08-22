import React from 'react'
import BucHeader from './BUCHeader'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCHeader/BUCHeader', () => {
  const buc = sampleBucs[0]
  const bucInfo = sampleBucsInfo.bucs[buc.type + '-' + buc.caseId]
  const t = jest.fn((translationString) => { return translationString })
  const onBUCEdit = jest.fn(() => {})
  const initialMockProps = {
    t: t,
    locale: 'nb',
    buc: buc,
    bucInfo: bucInfo,
    onBUCEdit: onBUCEdit
  }

  it('Renders', () => {
    const wrapper = shallow(<BucHeader {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = shallow(<BucHeader {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-bucheader')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__label')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__title')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__description')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__description').render().text()).toEqual(
      new Date(buc.startDate).toLocaleDateString() + ' - ' + new Date(buc.lastUpdate).toLocaleDateString()
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__owner Normaltekst').render().text()).toEqual(
      t('buc:form-caseOwner') + ': '
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner-institutions')).toBeTruthy()

    expect(wrapper.exists('.a-buc-c-bucheader__flags')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icons')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icon-numberofseds')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-bucheader__icon-numberofseds').render().text()).toEqual('1')
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__actions')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__bucedit-link')).toBeTruthy()
    expect(wrapper.find('LenkepanelBase.a-buc-c-bucheader__bucedit-link').render().text()).toEqual(t('ui:processing'))
  })

  it('Shows icons if necessary', () => {
    const wrapper = shallow(<BucHeader {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toBeTruthy()
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
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toBeFalsy()
  })

  it('Handles click in LenkepanelBase', () => {
    const onBUCEdit = jest.fn()
    const wrapper = shallow(<BucHeader {...initialMockProps} onBUCEdit={onBUCEdit} />)
    expect(onBUCEdit).toHaveBeenCalledTimes(0)
    wrapper.find('LenkepanelBase').simulate('click', {
      preventDefault: () => {},
      stopPropagation: () => {}
    })
    expect(onBUCEdit).toHaveBeenCalled()
  })
})
