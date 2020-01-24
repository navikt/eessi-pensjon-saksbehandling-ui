import { sendInvite } from 'actions/pinfo'
import { getStorageFile, listStorageFiles } from 'actions/storage'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VarslerPanel, VarslerPanelProps, VarslerPanelSelector } from './VarslerPanel'

jest.mock('actions/pinfo', () => ({
  sendInvite: jest.fn()
}))

jest.mock('actions/storage', () => ({
  getStorageFile: jest.fn(),
  listStorageFiles: jest.fn()
}))

jest.mock('react-redux');
(useDispatch as jest.Mock).mockImplementation(() => jest.fn())

const defaultSelector: VarslerPanelSelector = {
  aktoerId: '10293847565',
  file: undefined,
  fileList: undefined,
  isInvitingPinfo: false,
  invite: undefined,
  person: {},
  sakId: '123',
  sakType: 'Alderspensjon'
};

(useSelector as jest.Mock).mockImplementation(() => (defaultSelector))

export const setup = (params: any) => {
  (useSelector as jest.Mock).mockImplementation(() => ({
    ...defaultSelector,
    ...params
  }))
}

describe('widgets/Varsler/VarslerPanel', () => {
  let wrapper: ReactWrapper
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
    setup({})
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
    setup({ sakId: undefined })
    wrapper = mount(<VarslerPanel {...initialMockProps} />)
    expect(wrapper.exists('.w-varslerPanel__noParams-title')).toBeTruthy()
    expect(wrapper.exists('Veileder')).toBeTruthy()
  })

  it('UseEffect: There is a file list', () => {
    (getStorageFile as jest.Mock).mockReset()
    setup({ fileList: ['mockFileName'] })
    wrapper = mount(<VarslerPanel {...initialMockProps} />)
    expect(getStorageFile).toHaveBeenCalledWith({
      userId: defaultSelector.aktoerId,
      namespace: 'varsler',
      file: defaultSelector.sakId + '___mockFileName'
    }, {
      notification: false
    })
  })

  it('UseEffect: There is a file', () => {
    (listStorageFiles as jest.Mock).mockReset()
    setup({
      fileList: ['mockFileName'],
      file: { name: 'mockFileName' }
    })
    wrapper = mount(<VarslerPanel {...initialMockProps} />)
    expect(getStorageFile).toHaveBeenCalledWith({
      userId: defaultSelector.aktoerId,
      namespace: 'varsler',
      file: defaultSelector.sakId + '___mockFileName'
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
    wrapper.find('.ekspanderbartPanel > button').hostNodes().simulate('click')
    expect(initialMockProps.onUpdate).toBeCalledWith(expect.objectContaining({
      options: {
        collapsed: !initialMockProps.widget.options.collapsed
      }
    }))
  })
})
