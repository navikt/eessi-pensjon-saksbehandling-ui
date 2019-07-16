import React from 'react'
import BucHeader from './BUCHeader'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/components/BUCHeader/BUCHeader', () => {
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

  it('Renders successfully', () => {
    let wrapper = shallow(<BucHeader {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders child components', () => {
    let wrapper = shallow(<BucHeader {...initialMockProps} />)
    expect(wrapper.exists('.a-buc-c-bucheader')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__label')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__title')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__description')).toEqual(true)
    expect(wrapper.find('.a-buc-c-bucheader__description').render().text()).toEqual(
      new Date(buc.startDate).toLocaleDateString() + ' - ' + new Date(buc.lastUpdate).toLocaleDateString()
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner')).toEqual(true)
    expect(wrapper.find('.a-buc-c-bucheader__owner Normaltekst').render().text()).toEqual(
      t('buc:form-caseOwner') + ': '
    )
    expect(wrapper.exists('.a-buc-c-bucheader__owner-institutions')).toEqual(true)

    expect(wrapper.exists('.a-buc-c-bucheader__flags')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__icons')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-numberofseds')).toEqual(true)
    expect(wrapper.find('.a-buc-c-bucheader__icon-numberofseds').render().text()).toEqual('1')
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__actions')).toEqual(true)
    expect(wrapper.exists('.a-buc-c-bucheader__bucedit-link')).toEqual(true)
    expect(wrapper.find('LenkepanelBase.a-buc-c-bucheader__bucedit-link').render().text()).toEqual(t('ui:processing'))
  })

  it('Renders icons if necessary', () => {
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
        seds: []
      }
    })
    expect(wrapper.exists('.a-buc-c-bucheader__icon-tags')).toEqual(false)
    expect(wrapper.exists('.a-buc-c-bucheader__icon-vedlegg')).toEqual(false)
  })

  it('Handles click in LenkepanelBase', () => {
    let onBUCEdit = jest.fn()
    let wrapper = shallow(<BucHeader {...initialMockProps} onBUCEdit={onBUCEdit} />)
    expect(onBUCEdit).toHaveBeenCalledTimes(0)
    wrapper.find('LenkepanelBase').simulate('click', {
      preventDefault: () => {},
      stopPropagation: () => {}
    })
    expect(onBUCEdit).toHaveBeenCalled()
  })
})
