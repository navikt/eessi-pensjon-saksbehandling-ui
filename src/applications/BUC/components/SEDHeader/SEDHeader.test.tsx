import { Buc, Sed } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import { stageSelector } from 'setupTests'
import SEDHeader, { SEDHeaderProps, SEDHeaderSelector } from './SEDHeader'

const defaultSelector: SEDHeaderSelector = {
  locale: 'nb'
}

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
  const buc: Buc = mockBucs()[0]
  const sed: Sed = buc.seds![0]
  sed.status = 'received'
  const initialMockProps: SEDHeaderProps = {
    onSEDNew: jest.fn(),
    buc: buc,
    sed: sed,
    followUpSeds: [buc.seds![1]]
  }
  let wrapper: ReactWrapper

  beforeAll(() => {
    console.log('SEDHeader')
    stageSelector(defaultSelector, {})
  })

  beforeEach(() => {
    wrapper = mount(<SEDHeader {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
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
    expect(institutions.find('InstitutionList').render().text()).toEqual('NAV ACCEPTANCE TEST 07')

    const actions = wrapper.find('.a-buc-c-sedheader__actions').hostNodes()
    expect(actions.exists('Icons')).toBeTruthy()
    expect(actions.exists('Flatknapp.a-buc-c-sedheader__actions-answer-button')).toBeTruthy()
    const replySedButton = wrapper.find('.a-buc-c-sedheader__actions-answer-button').hostNodes().first()
    replySedButton.simulate('click')
    expect(initialMockProps.onSEDNew).toBeCalledWith(buc, sed)
  })
})
