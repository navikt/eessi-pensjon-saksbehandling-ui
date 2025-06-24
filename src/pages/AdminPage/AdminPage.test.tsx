import {render,screen} from "@testing-library/react";
import AdminPage, {AdminPageProps, AdminPageSelector} from "src/pages/AdminPage/AdminPage";
import {stageSelector} from "src/setupTests";

jest.mock('src/components/TopContainer/TopContainer', () => {
  return ({ children }: { children: JSX.Element }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})

const defaultSelector: AdminPageSelector = {
  resendingDocument: false,
  resendingDocumentList: false,
  resendingDocumentSuccess: false,
  resendingDocumentListSuccess: false,
}

describe('pages/AdminPage', () => {
  const initialMockProps: AdminPageProps = {
    username: 'Petter'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: has proper HTML structure', () => {
    render(<AdminPage {...initialMockProps} />)
    expect(screen.getByText('Resend dokument')).toBeInTheDocument()
    expect(screen.getByText('Resending av SED for å journalføre.')).toBeInTheDocument()
    expect(screen.getByText('Sak ID (Rina)')).toBeInTheDocument()
    expect(screen.getByText('Dokument ID')).toBeInTheDocument()
    expect(screen.getByText('Resend dokumentliste')).toBeInTheDocument()
    expect(screen.getByText('Resending av liste med SED\'er for å journalføre.')).toBeInTheDocument()
    expect(screen.getByText('Dokumentliste')).toBeInTheDocument()
    expect(screen.getAllByText('Resend')).toBeTruthy()
  })
})
