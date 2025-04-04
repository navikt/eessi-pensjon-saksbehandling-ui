import { VEDTAKSKONTEKST } from 'src/constants/constants'
import { render, screen } from '@testing-library/react'
import { stageSelector } from 'src/setupTests'
import mockPerson from 'src/mocks/person/personPdl'
import ContextBanner, { ContextBannerSelector } from './ContextBanner'

const mockPesysContext = VEDTAKSKONTEKST
const mockSakType = 'Generell'

const defaultSelector: ContextBannerSelector = {
  gettingSakType: false,
  personPdl: mockPerson,
  pesysContext: mockPesysContext,
  sakType: mockSakType
}

describe('components/ContextBanner/ContextBanner', () => {
  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: has proper HTML structure', () => {
    render(<ContextBanner />)
    expect(screen.getByTestId("contextbanner-context")).toBeInTheDocument()
    expect(screen.getByTestId("tag-pesyscontext")).toBeInTheDocument()
    expect(screen.getByTestId("tag-buc-case-type")).toBeInTheDocument()
    expect(screen.getByTestId("tag-pesyscontext").textContent).toEqual('ui:youComeFrom' + mockPesysContext.toUpperCase())
    expect(screen.getByTestId("tag-buc-case-type").textContent).toEqual('buc:form-caseType' + ': ' + mockSakType)
  })
})
