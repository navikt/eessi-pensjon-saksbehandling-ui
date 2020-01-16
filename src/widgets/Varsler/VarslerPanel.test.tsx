import React from 'react'
import { VarslerPanel, VarslerPanelProps } from './VarslerPanel'
import { mount, ReactWrapper } from 'enzyme'

describe('widgets/Varsler/VarslerPanel', () => {
  let wrapper: ReactWrapper
  const initialMockProps: VarslerPanelProps = {
    actions: {
      sendInvite: jest.fn(),
      listStorageFiles: jest.fn(),
      getStorageFile: jest.fn(),
      onUpdate: jest.fn()
    },
    aktoerId: '10293847565',
    file: undefined,
    fileList: undefined,
    isInvitingPinfo: false,
    invite: undefined,
    onUpdate: jest.fn(),
    person: {},
    sakId: '123',
    sakType: 'Alderspensjon',
    t: jest.fn(t => t),
    widget: {
      i: 'i',
      type: 'varsler',
      title: 'Varsler',
      visible: true,
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

  it('With no params', () => {
    wrapper = mount(<VarslerPanel {...initialMockProps} sakId={undefined} />)
    expect(wrapper.exists('.w-varslerPanel__noParams-title')).toBeTruthy()
    expect(wrapper.exists('Veileder')).toBeTruthy()
  })

  it('UseEffect: There is a file list', () => {
    (initialMockProps.actions.getStorageFile as jest.Mock).mockReset()
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
    (initialMockProps.actions.listStorageFiles as jest.Mock).mockReset()
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
    (initialMockProps.actions.listStorageFiles as jest.Mock).mockReset()
    wrapper.find('.w-varslerPanel__refresh-button a').hostNodes().simulate('click')
    expect(initialMockProps.actions.listStorageFiles).toHaveBeenCalledWith({
      userId: initialMockProps.aktoerId,
      namespace: 'varsler___' + initialMockProps.sakId
    })
  })

  it('Invite button triggers a invite action', () => {
    (initialMockProps.actions.sendInvite as jest.Mock).mockReset()
    wrapper.find('.w-varslerPanel__invite-button').hostNodes().simulate('click')
    expect(initialMockProps.actions.sendInvite).toBeCalledWith({
      aktoerId: initialMockProps.aktoerId,
      sakId: initialMockProps.sakId
    })
  })

  it('Expandable panel triggers widget update', () => {
    (initialMockProps.actions.onUpdate as jest.Mock).mockReset()
    wrapper.find('.ekspanderbartPanel > button').hostNodes().simulate('click')
    expect(initialMockProps.onUpdate).toBeCalledWith(expect.objectContaining({
      options: {
        collapsed: !initialMockProps.widget.options.collapsed
      }
    }))
  })
})
