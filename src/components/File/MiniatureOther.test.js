import React from 'react'

import { MiniatureOther } from './MiniatureOther'

const mockPNG = { name: 'teapot.oolong', size: 418, mimetype: 'image/png', content: { base64: '...' } }
const mockJPG = { name: 'cup of joe', size: 200, mimetype: 'image/jpeg', content: { base64: '...' } }

describe('Render MiniatureOther', () => {
  it('Renders without crashing', () => {
    let wrapper = shallow(<MiniatureOther size='Large' t={arg => arg} file={mockPNG} scale={1} />)
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('div.content').text()).toEqual('oolong')
  })

  it('Renders download and delete links on mouseEnter', () => {
    let wrapper = shallow(
      <MiniatureOther
        size='Large'
        t={arg => arg}
        file={mockPNG}
        scale={1}
        downloadLink
        deleteLink
      />)

    expect(wrapper.exists('div.deleteLink')).toEqual(false)
    expect(wrapper.exists('div.downloadLink')).toEqual(false)

    wrapper.find('div.c-ui-miniatureOther').simulate('mouseEnter')

    expect(wrapper.exists('div.deleteLink')).toEqual(true)
    expect(wrapper.exists('div.downloadLink')).toEqual(true)

    wrapper.find('div.c-ui-miniatureOther').simulate('mouseLeave')

    expect(wrapper.exists('div.deleteLink')).toEqual(false)
    expect(wrapper.exists('div.downloadLink')).toEqual(false)
  })
})

describe('MiniatureOther functions', () => {
  it('Delete link calls onDeleteDocument on click', () => {
    const onDeleteDocument = jest.fn()

    let wrapper = shallow(
      <MiniatureOther
        size='Large'
        t={arg => arg}
        file={mockPNG}
        scale={1}
        deleteLink
        onDeleteDocument={onDeleteDocument}
      />)
    wrapper.find('div.c-ui-miniatureOther').simulate('mouseEnter')
    wrapper.find('div.deleteLink > Icons').simulate('click', { stopPropagation: jest.fn(), preventDefault: jest.fn() })

    expect(onDeleteDocument).toHaveBeenCalled()
  })

  it('Generates correct downloadlink', () => {
    let wrapper = shallow(
      <MiniatureOther
        size='Large'
        t={arg => arg}
        file={mockPNG}
        scale={1}
        downloadLink
        onDeleteDocument={jest.fn()}
      />)
    wrapper.find('div.c-ui-miniatureOther').simulate('mouseEnter')
    let downloadLinkProps = wrapper.find('div.downloadLink > a').props()
    expect(downloadLinkProps.href).toEqual(
      'data:application/octet-stream;base64,' +
            encodeURIComponent(mockPNG.content.base64)
    )
    expect(downloadLinkProps.download).toEqual(mockPNG.name)

    wrapper.setProps({ file: mockJPG })
    downloadLinkProps = wrapper.find('div.downloadLink > a').props()
    expect(downloadLinkProps.href).toEqual(
      'data:application/octet-stream;base64,' +
            encodeURIComponent(mockJPG.content.base64)
    )
    expect(downloadLinkProps.download).toEqual(mockJPG.name)
  })
})
