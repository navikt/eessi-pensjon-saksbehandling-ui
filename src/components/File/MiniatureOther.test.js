import React from 'react'
import MiniatureOther from './MiniatureOther'

describe('components/File/MiniatureOther', () => {

  const t = jest.fn((translationString) => { return translationString })
  const mockFile = { name: 'teapot.oolong', size: 418, mimetype: 'some/thing', content: { base64: '...' } }
  const initialMockProps = {
    size: '2 kB',
    t: t,
    file: mockFile,
    scale: 1,
    onClick: jest.fn(),
    onDeleteDocument: jest.fn(),
    downloadLink: true,
    deleteLink: true
  }

  it('Renders', () => {
    let wrapper = mount(<MiniatureOther {...initialMockProps} />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders the extension', () => {
    let wrapper = mount(<MiniatureOther {...initialMockProps}/>)
    expect(wrapper.find('.extension').text()).toEqual('oolong')
  })

  it('Renders download and delete links on mouseEnter', () => {
    let wrapper = mount(<MiniatureOther {...initialMockProps}/>)
    expect(wrapper.exists('.deleteLink')).toBeFalsy()
    expect(wrapper.exists('.downloadLink')).toBeFalsy()

    wrapper.setProps({isHovering: true})
    expect(wrapper.exists('.deleteLink')).toBeTruthy()
    expect(wrapper.exists('.downloadLink')).toBeTruthy()

    wrapper.setProps({isHovering: false})
    expect(wrapper.exists('.deleteLink')).toBeFalsy()
    expect(wrapper.exists('.downloadLink')).toBeFalsy()
  })

  it('Delete link calls onDeleteDocument on click', () => {
    let wrapper = mount(<MiniatureOther {...initialMockProps} isHovering={true}/>)
    wrapper.find('.deleteLink Icons').simulate('click')
    expect(initialMockProps.onDeleteDocument).toHaveBeenCalled()
  })

  it('Generates correct downloadlink', () => {
    let wrapper = mount(<MiniatureOther {...initialMockProps} isHovering={true}/>)
    let downloadLinkProps = wrapper.find('.downloadLink > a').props()
    expect(downloadLinkProps.href).toEqual(
      'data:application/octet-stream;base64,' + encodeURIComponent(mockFile.content.base64)
    )
    expect(downloadLinkProps.download).toEqual(mockFile.name)
  })

  it('Handles onClick in content', () => {
    let wrapper = mount(<MiniatureOther {...initialMockProps}/>)
    wrapper.find('.c-file-miniatureOther .content').simulate('click')
    expect(initialMockProps.onClick).toHaveBeenCalled()
  })
})
