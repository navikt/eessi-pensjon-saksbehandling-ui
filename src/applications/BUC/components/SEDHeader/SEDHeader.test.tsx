import { Buc, Sed } from 'applications/BUC/declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import sampleBucs from 'resources/tests/sampleBucs'
import SEDHeader, { SEDHeaderProps } from './SEDHeader'

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
  const buc: Buc = sampleBucs[0]
  const sed: Sed = buc.seds![0]
  sed.status = 'received'
  const initialMockProps: SEDHeaderProps = {
    institutionNames: {},
    locale: 'nb',
    onSEDNew: jest.fn(),
    buc: buc,
    sed: sed,
    followUpSeds: [buc.seds![1]],
    t: jest.fn(t => t)
  }
  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<SEDHeader {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedheader')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedheader__name').hostNodes().render().text()).toEqual('X008 - buc:buc-X008')

    const status = wrapper.find('.a-buc-c-sedheader__status').hostNodes()
    expect(status.find('SEDStatus').render().text()).toEqual('buc:status-' + sed.status)
    expect(status.find('Normaltekst.a-buc-c-sedheader__lastUpdate').render().text()).toEqual('23.10.2019')

    const institutions = wrapper.find('.a-buc-c-sedheader__institutions').hostNodes()
    expect(institutions.find('InstitutionList').render().text()).toEqual(['NAV ACCEPTANCE TEST 07', 'NAV ACCEPTANCE TEST 08'].join(''))

    const actions = wrapper.find('.a-buc-c-sedheader__actions').hostNodes()
    expect(actions.exists('Icons')).toBeFalsy()
    expect(actions.exists('Flatknapp.a-buc-c-sedheader__actions-answer-button')).toBeTruthy()
  })
})
