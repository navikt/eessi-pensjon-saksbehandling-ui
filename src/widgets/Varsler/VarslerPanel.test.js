import React from 'react'
import { VarslerPanel } from './VarslerPanel'
jest.mock('eessi-pensjon-ui', () => {
  const Ui = jest.requireActual('eessi-pensjon-ui')
  return {
    ...Ui,
    Nav: {
      ...Ui.Nav,
      EkspanderbartpanelBase: ({ children }) => <div className='mock-EkspanderbartpanelBase'>{children}</div>
    }
  }
})

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
    t: jest.fn((translationString) => { return translationString }),
    widget: {
      options: {
        collapsed: false
      }
    }
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

  it('UseEffect: There is a file list', () => {
    wrapper.setProps({
      fileList: ['mockFileName']
    })
    expect(initialMockProps.actions.getStorageFile).toHaveBeenCalledWith({
      userId: initialMockProps.aktoerId,
      namespace: 'varsler',
      file: initialMockProps.sakId + '___mockFileName'
    }, {
      notification: false
    })
  })

  it('UseEffect: There is a file', () => {
    wrapper.setProps({
      fileList: ['mockFileName'],
      file: { name: 'mockFileName' }
    })
    expect(initialMockProps.actions.getStorageFile).toHaveBeenCalledWith({
      userId: initialMockProps.aktoerId,
      namespace: 'varsler',
      file: initialMockProps.sakId + '___mockFileName'
    }, {
      notification: false
    })
  })

  it('Refresh button triggers refresh action', () => {
    wrapper.find('.w-varslerPanel__refresh-button').hostNodes().simulate('click')
    expect(initialMockProps.actions.listStorageFiles).toHaveBeenCalledWith({
      userId: initialMockProps.aktoerId,
      namespace: 'varsler___' + initialMockProps.sakId
    })
  })

  it('Invite button triggers a invite action', () => {
    wrapper.find('.w-varslerPanel__invite-button').hostNodes().simulate('click')
    expect(initialMockProps.actions.sendInvite).toBeCalledWith({
      aktoerId: initialMockProps.aktoerId,
      sakId: initialMockProps.sakId
    })
  })
})
