import React from 'react'
import SEDRow from './SEDRow'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDRow/SEDRow', () => {
  const t = jest.fn((translationString) => { return translationString })
  const buc = sampleBucs[0]
  const sed = buc.seds[0]
  sed.status = 'received'
  const initialMockProps = {
    border: 'none',
    institutionNames: {},
    locale: 'nb',
    onSEDNew: jest.fn(),
    sed: sed,
    childSeds: [buc.seds[1]],
    t: t
  }
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SEDRow {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedrow')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedrow__name').hostNodes().render().text()).toEqual(sed.type)

    const status = wrapper.find('.a-buc-c-sedrow__status').hostNodes()
    expect(status.find('SEDStatus').render().text()).toEqual('ui:' + sed.status)
    expect(status.find('Normaltekst').render().text()).toEqual('2019-5-29')

    const institutions = wrapper.find('.a-buc-c-sedrow__institutions').hostNodes()
    expect(institutions.find('InstitutionList').render().text()).toEqual('Norge: NAVT003Norge: NAVT002')

    const actions = wrapper.find('.a-buc-c-sedrow__actions').hostNodes()
    expect(actions.find('.a-buc-c-sedrow__actions-attachments').hostNodes().props().title).toEqual('buc:form-youHaveXAttachmentsInSed')
    expect(actions.exists('Icons')).toBeTruthy()
    expect(actions.exists('Flatknapp.a-buc-c-sedrow__actions-answer-button')).toBeTruthy()
  })
})
