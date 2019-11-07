import React from 'react'
import SEDListHeader from './SEDListHeader'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDListHeader/SEDListHeader', () => {
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
    t: jest.fn(t => t)
  }
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SEDListHeader {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedlistheader')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedlistheader__name').hostNodes().render().text()).toEqual('P2000 - buc:buc-P2000buc:status-received29.05.2019')

    const status = wrapper.find('.a-buc-c-sedlistheader__status').hostNodes()
    expect(status.find('SEDStatus').render().text()).toEqual('buc:status-' + sed.status)
    expect(status.find('Normaltekst').render().text()).toEqual('29.05.2019')

    const institutions = wrapper.find('.a-buc-c-sedlistheader__institutions').hostNodes()
    expect(institutions.find('InstitutionList').first().render().text()).toEqual('DEMO002')
    expect(institutions.find('InstitutionList').last().render().text()).toEqual('DEMO001')

    const actions = wrapper.find('.a-buc-c-sedlistheader__actions').hostNodes()
    expect(actions.exists('Icons')).toBeTruthy()
    expect(actions.exists('Flatknapp.a-buc-c-sedlistheader__actions-answer-button')).toBeTruthy()
  })
})
