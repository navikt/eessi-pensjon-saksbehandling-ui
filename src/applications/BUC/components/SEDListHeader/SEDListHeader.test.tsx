import SEDListHeader, { SEDListHeaderProps } from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import { Buc, Sed } from 'applications/BUC/declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/components/SEDListHeader/SEDListHeader', () => {
  const buc: Buc = sampleBucs[0]
  const sed: Sed = buc.seds![0]
  sed.status = 'received'
  const initialMockProps: SEDListHeaderProps = {
    buc: buc,
    institutionNames: {},
    locale: 'nb',
    onSEDNew: jest.fn(),
    sed: sed,
    followUpSeds: [buc.seds![1]],
    t: jest.fn(t => t)
  }
  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<SEDListHeader {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedlistheader')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedlistheader__name').hostNodes().render().text()).toEqual(
      ['X008 - buc:buc-X008', 'buc:status-received', '23.10.2019', 'ui:version: 1'].join('')
    )

    const status = wrapper.find('.a-buc-c-sedlistheader__status').hostNodes()
    expect(status.find('SEDStatus').render().text()).toEqual('buc:status-' + sed.status)
    expect(status.find('Normaltekst.a-buc-c-sedlistheader__lastUpdate').render().text()).toEqual('23.10.2019')

    const institutions = wrapper.find('.a-buc-c-sedlistheader__institutions').hostNodes()
    expect(institutions.find('InstitutionList').first().render().text()).toEqual('NAV ACCEPTANCE TEST 07')
    expect(institutions.find('InstitutionList').last().render().text()).toEqual('NAV ACCEPTANCE TEST 08')

    const actions = wrapper.find('.a-buc-c-sedlistheader__actions').hostNodes()
    expect(actions.exists('Icons')).toBeTruthy()
    expect(actions.exists('Flatknapp.a-buc-c-sedlistheader__actions-answer-button')).toBeTruthy()
  })
})
