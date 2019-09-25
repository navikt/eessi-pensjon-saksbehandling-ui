import React from 'react'
import { VarslerPanel } from './VarslerPanel'

describe('widgets/Varsler/VarslerPanel', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      sendInvite: jest.fn(),
      listStorageFiles: jest.fn(),
      getStorageFile: jest.fn()
    },
    aktoerId: '10293847565',
    file: undefined,
    fileList: undefined,
    isInvitingPinfo: false,
    invite: undefined,
    sakId: '123',
    sakType: 'Alderspensjon',
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<VarslerPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.w-varslerPanel')).toBeTruthy()
  })
})
