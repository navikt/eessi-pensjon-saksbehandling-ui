import React from 'react'
import { DocumentStatus } from './DocumentStatus'

// Mock objects used in multiple tests
const t = arg => arg
const mockHistory = { push: () => { } }
const mockActions = { getPossibleActions: () => { } }
const mockDocuments = [
  {
    dokumentType: 'P2000',
    dokumentId: '1234567890',
    navn: 'MockDocument',
    kategori: 'Pensjon',
    id: '1'
  },
  {
    dokumentType: 'P2100',
    dokumentId: '1234567890',
    navn: 'MockDocument',
    kategori: 'Pensjon',
    id: '2'
  },
  {
    dokumentType: 'P2200',
    dokumentId: '1234567890',
    navn: 'MockDocument',
    kategori: 'Pensjon',
    id: '3'
  },
  {
    dokumentType: 'P4000',
    dokumentId: '1234567890',
    navn: 'MockDocument',
    kategori: 'Pensjon',
    id: '4'
  },
  {
    dokumentType: 'P6000',
    dokumentId: '1234567890',
    navn: 'MockDocument',
    kategori: 'Pensjon',
    id: '5'
  }
]

const mockSentDocuments = mockDocuments.map((document) => {
  return Object.assign({}, document, { navn: 'Send' })
})

describe('DocumentStatus Rendering', () => {
  it('Renders without crashing', () => {
    let wrapper = shallow(
      <DocumentStatus
        actions={mockActions}
        t={t}
        history={mockHistory}
        documents={mockDocuments}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('Renders spinner when loading', () => {
    let wrapper = shallow(
      <DocumentStatus
        actions={mockActions}
        t={t}
        history={mockHistory}
        documents={undefined}
        gettingStatus
      />
    )
    expect(wrapper.exists('NavFrontendSpinner')).toEqual(true)

    wrapper.setProps({ gettingStatus: undefined })

    expect(wrapper.exists('NavFrontendSpinner')).toEqual(false)
  })

  it('Render buttons', () => {
    let wrapper = shallow(
      <DocumentStatus
        actions={mockActions}
        t={t}
        history={mockHistory}
        documents={mockDocuments}
      />
    )
    let documentButtons = wrapper.find('.documentButtons')
    expect(documentButtons.children().length).toEqual(5)

    mockDocuments.forEach((document, index) => {
      expect(documentButtons.childAt(index).is({ title: `${document.dokumentType} - buc:case-${document.dokumentType}` }))
    })
  })

  it('Sets correct filter when filter labels are clicked', () => {
    let wrapper = shallow(<DocumentStatus actions={mockActions} t={t} history={mockHistory}
      documents={[]}
    />
    )

    expect(wrapper.state().filter).toEqual('all')

    wrapper.find('#documentStatusEtikettBaseSent').simulate('click')

    expect(wrapper.state().filter).toEqual('sent')

    wrapper.find('#documentStatusEtikettBaseNotSent').simulate('click')

    expect(wrapper.state().filter).toEqual('notsent')

    wrapper.find('#documentStatusEtikettBaseAll').simulate('click')

    expect(wrapper.state().filter).toEqual('all')
  })

  it('Filters documents correctly', () => {
    let wrapper = shallow(
      <DocumentStatus
        actions={mockActions}
        t={t}
        history={mockHistory}
        documents={mockDocuments}
      />
    )

    expect(wrapper.find('.documentButtons').children().length).toEqual(5)

    wrapper.instance().setFilter('sent')

    expect(wrapper.find('.documentButtons').children().length).toEqual(0)

    wrapper.instance().setFilter('notsent')

    expect(wrapper.find('.documentButtons').children().length).toEqual(5)

    wrapper.setProps({ documents: mockSentDocuments })

    wrapper.instance().setFilter('all')

    expect(wrapper.find('.documentButtons').children().length).toEqual(5)

    wrapper.instance().setFilter('sent')

    expect(wrapper.find('.documentButtons').children().length).toEqual(5)

    wrapper.instance().setFilter('notsent')

    expect(wrapper.find('.documentButtons').children().length).toEqual(0)
  })

  it('Toggles active document on click', () => {
    let wrapper = shallow(
      <DocumentStatus
        actions={mockActions}
        t={t}
        history={mockHistory}
        documents={mockDocuments}
      />
    )

    wrapper.find('.documentButtonContent').forEach((node, index) => {
      expect(node.hasClass('active')).toEqual(false)

      node.simulate('click')

      let updatedNode = wrapper.find('.documentButtonContent').at(index)

      expect(updatedNode.hasClass('active')).toEqual(true)

      expect(node.children().hostNodes().html())
        .toEqual(updatedNode.children().hostNodes().html())

      node.simulate('click')

      updatedNode = wrapper.find('.documentButtonContent').at(index)

      expect(node.html()).toEqual(updatedNode.html())
    })
  })

  it('Renders spinner when gettingSED', () => {
    let wrapper = shallow(
      <DocumentStatus
        actions={mockActions}
        t={t}
        history={mockHistory}
        documents={mockDocuments}
        gettingSED={false}
      />
    )
    wrapper.find('.documentButtonContent').at(0).simulate('click')
    expect(wrapper.exists('.documentButtonContent > NavFrontendSpinner')).toEqual(false)
    wrapper.setProps({ gettingSED: true })
    expect(wrapper.exists('.documentButtonContent > NavFrontendSpinner')).toEqual(true)
  })
})

describe('DocumentStatus logic', () => {
  it('Calls getPossibleActions on mount', () => {
    const getPossibleActions = jest.fn()

    shallow(
      <DocumentStatus
        actions={{ getPossibleActions }}
        t={t}
        rinaId='123'
        history={mockHistory}
        documents={mockDocuments}
      />
    )

    expect(getPossibleActions).toHaveBeenCalledWith('123')
  })

  it('Calls getPossibleActions when receiving new props', () => {
    const getPossibleActions = jest.fn()

    let wrapper = mount(
      <DocumentStatus
        actions={{ getPossibleActions }}
        t={t}
        rinaId='not 123'
        history={mockHistory}
        documents={mockDocuments}
      />
    )

    expect(getPossibleActions).toHaveBeenLastCalledWith('not 123')

    wrapper.setProps({ rinaId: '123' })
    wrapper.unmount()

    expect(getPossibleActions).toHaveBeenLastCalledWith('123')
  })

  it('calls getPossibleActions when refresh button is clicked', (done) => {
    let count = 0
    let wrapper = shallow(
      <DocumentStatus
        actions={{ getPossibleActions: () => {
          count++
          if (count === 2) {
            done()
          }
        } }}
        t={t}
        rinaId='123'
        history={mockHistory}
        documents={mockDocuments}
      />
    )
    wrapper.find('div.refresh > a').simulate('click')
  })

  it('Calls document actions when clicked', () => {
    const docType = 'P2000'
    const docID = 'DOCID'
    const bucID = 'BUCID'
    const rinaID = 'RINAID'

    const mockDocumentTemplate = {
      dokumentType: docType,
      dokumentId: docID,
      kategori: 'Pensjon',
      id: bucID
    }

    let mockActionDocuments =
    ['Create', 'Read', 'Update', 'Delete'].map((action) => {
      return Object.assign({}, mockDocumentTemplate, { navn: action })
    })

    const getSed = (_rinaID, _docID) => { expect(_rinaID === rinaID && _docID === docID).toEqual(true) }
    const openModal = (modal) => { expect(modal.modalTitle === 'deleteSed').toEqual(true) }
    const push = (path) => { expect(path.includes('sed=' + docType) && path.includes('buc=' + bucID)).toEqual(true) }

    let wrapper = shallow(<DocumentStatus
      actions={Object.assign({}, mockActions, { getSed, openModal })}
      history={{ push }}
      t={t}
      documents={mockActionDocuments}
      rinaId={rinaID}
    />)

    wrapper.find('.documentButtonContent').first().simulate('click')
    wrapper.find('div.documentActions Hovedknapp').forEach(knapp => {
      knapp.simulate('click')
    })
  })
})
