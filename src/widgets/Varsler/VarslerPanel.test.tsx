import { sendInvite } from 'actions/pinfo'
import { getStorageFile, listStorageFiles } from 'actions/storage'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import { VarslerPanel, VarslerPanelProps, VarslerPanelSelector } from './VarslerPanel'

jest.mock('actions/pinfo', () => ({
  sendInvite: jest.fn()
}))

jest.mock('actions/storage', () => ({
  getStorageFile: jest.fn(),
  listStorageFiles: jest.fn()
}))

describe('widgets/Varsler/VarslerPanel', () => {
  let wrapper: ReactWrapper
  const defaultSelector: VarslerPanelSelector = {
    aktoerId: '10293847565',
    file: undefined,
    fileList: undefined,
    isInvitingPinfo: false,
    invite: undefined,
    person: {},
    sakId: '123',
    sakType: 'Alderspensjon'
  }

  const initialMockProps: VarslerPanelProps = {
    onUpdate: jest.fn(),
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
    stageSelector(defaultSelector, {})
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
    stageSelector(defaultSelector, { sakId: undefined })
    wrapper = mount(<VarslerPanel {...initialMockProps} />)
    expect(wrapper.exists('.w-varslerPanel__noParams-title')).toBeTruthy()
    expect(wrapper.exists('Veileder')).toBeTruthy()
  })

  it('UseEffect: There is a file list', () => {
    (getStorageFile as jest.Mock).mockReset()
    stageSelector(defaultSelector, ({ fileList: ['2020-01-01T11:11:11.json'] }))
    wrapper = mount(<VarslerPanel {...initialMockProps} />)
    expect(getStorageFile).toHaveBeenCalledWith({
      userId: defaultSelector.aktoerId,
      namespace: 'varsler',
      file: defaultSelector.sakId + '___2020-01-01T11:11:11.json'
    }, {
      notification: false
    })
  })

  it('UseEffect: There is a file list and a file to add', () => {
    (listStorageFiles as jest.Mock).mockReset();
    (getStorageFile as jest.Mock).mockReset()
    stageSelector(defaultSelector, ({
      fileList: ['2020-02-02T12:22:22.json', '2020-01-01T11:11:11.json', '2020-03-03T13:33:33.json'],
      file: {
        tittel: 'Mock File Name 3',
        fulltnavn: 'Sender 3',
        timestamp: '2020-01-03T13:33:33'
      }
    }))
    const mockInitialFiles = {
      '2020-02-02T12:22:22.json': {
        tittel: 'Mock File Name 1',
        fulltnavn: 'Sender 1',
        timestamp: '2020-01-02T12:22:22'
      },
      '2020-01-01T11:11:11.json': {
        tittel: 'Mock File Name 2',
        fulltnavn: 'Sender 2',
        timestamp: '2020-01-01T11:11:11'
      }
    }
    wrapper = mount(<VarslerPanel {...initialMockProps} initialFiles={mockInitialFiles} />)
    expect(getStorageFile).toHaveBeenCalledWith({
      userId: defaultSelector.aktoerId,
      namespace: 'varsler',
      file: defaultSelector.sakId + '___2020-03-03T13:33:33.json'
    }, {
      notification: false
    })
  })

  it('Refresh button triggers refresh action', () => {
    (listStorageFiles as jest.Mock).mockReset()
    wrapper.find('.w-varslerPanel__refresh-button a').hostNodes().simulate('click')
    expect(listStorageFiles).toHaveBeenCalledWith({
      userId: defaultSelector.aktoerId,
      namespace: 'varsler___' + defaultSelector.sakId
    })
  })

  it('Invite button triggers a invite action', () => {
    (sendInvite as jest.Mock).mockReset()
    wrapper.find('.w-varslerPanel__invite-button').hostNodes().simulate('click')
    expect(sendInvite).toBeCalledWith({
      aktoerId: defaultSelector.aktoerId,
      sakId: defaultSelector.sakId
    })
  })

  it('Expandable panel triggers widget update', () => {
    (initialMockProps.onUpdate as jest.Mock).mockReset()
    wrapper.find('.ekspanderbartPanel .ekspanderbartPanel__knapp').hostNodes().simulate('click')
    expect(initialMockProps.onUpdate).toBeCalledWith(expect.objectContaining({
      options: {
        collapsed: !initialMockProps.widget.options.collapsed
      }
    }))
  })
})
