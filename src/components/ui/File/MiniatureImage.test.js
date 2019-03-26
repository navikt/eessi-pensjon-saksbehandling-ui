
import React from 'react'

import {MiniatureImage} from './MiniatureImage'

const mockPNG = { name: 'teapot', size: 418, mimetype: 'image/png', content: {base64: '...'}}
const mockJPG = { name: 'cup of joe', size: 200, mimetype: 'image/jpeg', content: {base64: '...'}}


describe('Render MiniatureImage', ()=>{

    it('Renders without crashing', ()=>{

        let wrapper = shallow(<MiniatureImage size='Large' t={arg=>arg} file={mockPNG} scale={1}/>)

        expect(wrapper.isEmptyRender()).toEqual(false)
        expect(wrapper).toMatchSnapshot()
        expect(wrapper.find('img').props().alt).toEqual('teapot')
    })


    it('Renders download and delete links on mouseEnter', ()=>{
        let wrapper = shallow(
            <MiniatureImage
                size='Large'
                t={arg=>arg}
                file={mockPNG}
                scale={1}
                downloadLink = {true}
                deleteLink = {true}
            />)

        expect(wrapper.exists('div.deleteLink')).toEqual(false)
        expect(wrapper.exists('div.downloadLink')).toEqual(false)

        wrapper.find('div.c-ui-miniatureImage').simulate('mouseEnter')

        expect(wrapper.exists('div.deleteLink')).toEqual(true)
        expect(wrapper.exists('div.downloadLink')).toEqual(true)

        wrapper.find('div.c-ui-miniatureImage').simulate('mouseLeave')

        expect(wrapper.exists('div.deleteLink')).toEqual(false)
        expect(wrapper.exists('div.downloadLink')).toEqual(false)
    })
})

describe('MiniatureImage functions', ()=>{

    it('Delete link calls onDeleteDocument on click', (done)=>{
        let wrapper = shallow(
            <MiniatureImage
                size='Large'
                t={arg=>arg}
                file={mockPNG}
                scale={1}
                deleteLink = {true}
                onDeleteDocument={ ()=>done() }
        />)
        wrapper.find('div.c-ui-miniatureImage').simulate('mouseEnter')
        wrapper.find('div.deleteLink').simulate('click', new Event('click'))
    })

    it('Generates correct downloadlink', ()=>{
        let wrapper = shallow(
            <MiniatureImage
                size='Large'
                t={arg=>arg}
                file={mockPNG}
                scale={1}
                downloadLink = {true}
                onDeleteDocument={ ()=>done() }
        />)
        wrapper.find('div.c-ui-miniatureImage').simulate('mouseEnter')
        let downloadLinkProps = wrapper.find('div.downloadLink > a').props()
        expect(downloadLinkProps.href).toEqual(
            'data:application/octet-stream;base64,'
            + encodeURIComponent(mockPNG.content.base64)
        ) 
        expect(downloadLinkProps.download).toEqual(mockPNG.name)

        wrapper.setProps({file: mockJPG})
        downloadLinkProps = wrapper.find('div.downloadLink > a').props()
        expect(downloadLinkProps.href).toEqual(
            'data:application/octet-stream;base64,'
            + encodeURIComponent(mockJPG.content.base64)
        ) 
        expect(downloadLinkProps.download).toEqual(mockJPG.name)
    })
})
