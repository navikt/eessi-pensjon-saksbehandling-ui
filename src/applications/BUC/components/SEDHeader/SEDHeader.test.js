import React from 'react'
import SEDHeader from './SEDHeader'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
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
    followUpSeds: [buc.seds[1]],
    t: t
  }
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SEDHeader {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedheader')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedheader__name').hostNodes().render().text()).toEqual(sed.type)

    const status = wrapper.find('.a-buc-c-sedheader__status').hostNodes()
    expect(status.find('SEDStatus').render().text()).toEqual('ui:' + sed.status)
    expect(status.find('Normaltekst').render().text()).toEqual('29.05.2019')

    const institutions = wrapper.find('.a-buc-c-sedheader__institutions').hostNodes()
    expect(institutions.find('InstitutionList').render().text()).toEqual('DEMO002DEMO001')

    const actions = wrapper.find('.a-buc-c-sedheader__actions').hostNodes()
    expect(actions.exists('Icons')).toBeTruthy()
    expect(actions.exists('Flatknapp.a-buc-c-sedheader__actions-answer-button')).toBeTruthy()
  })
})
