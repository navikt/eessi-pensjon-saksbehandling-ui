import SEDHeader, {
  SEDHeaderProps,
  SEDListSelector
} from 'src/applications/BUC/components/SEDHeader/SEDHeader'
import { Buc, Bucs, Sed } from 'src/declarations/buc'
import {screen, render, fireEvent} from '@testing-library/react'
import mockBucs from 'src/mocks/buc/bucs'
import _ from 'lodash'
import { stageSelector } from 'src/setupTests'
import mockFeatureToggles from 'src/mocks/app/featureToggles'

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_DEVELOPMENT: 'development',
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

const defaultSelector: SEDListSelector = {
  locale: 'nb',
  featureToggles: mockFeatureToggles,
  storageEntries: undefined,
  gettingPreviewPDF: false,
  previewPDF: undefined
}

describe('applications/BUC/components/SEDHeader/SEDHeader', () => {
  const bucs: Bucs = _.keyBy(mockBucs(), 'caseId')
  const currentBuc: string = '195440'
  const buc: Buc = bucs[currentBuc]
  const mockFollowUpSeds: Array<Sed> = _.filter(bucs[currentBuc].seds, sed => sed.parentDocumentId !== undefined)
  const mockCurrentSed: Sed | undefined = _.find(bucs[currentBuc].seds, sed => sed.id === mockFollowUpSeds[0]!.parentDocumentId)

  const sed: Sed | undefined = _.find(buc.seds, sed => sed.parentDocumentId !== undefined)
  sed!.status = 'received'
  const initialMockProps: SEDHeaderProps = {
    buc,
    onFollowUpSed: jest.fn(),
    sed: mockCurrentSed!,
    setMode: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    render(<SEDHeader {...initialMockProps} />)
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId("a_buc_c_sedheader--name-id")).toHaveTextContent('P2000 - buc:buc-P2000')
    expect(screen.getByTestId("a_buc_c_sedheader--version-date-id")).toHaveTextContent('29.05.2019')
    expect(screen.getByTestId("a_buc_c_sedheader--version-id")).toHaveTextContent('ui:version: 5')
    expect(screen.getByRole("button", {name: "buc:form-answerSED"})).toBeInTheDocument()
    expect(screen.getByText('buc:status-' + sed!.status)).toBeInTheDocument()
    expect(screen.getByTestId("sedstatus")).toHaveTextContent('buc:status-' + sed!.status)
    expect(screen.getByTestId("a_buc_c_sedheader--actions-attachments")).toBeInTheDocument()

    const institutions = screen.getAllByTestId("a_buc_c_institutionlist--div-id")
    expect(institutions[0]).toHaveTextContent(/NO:DEMONO02/i)
    expect(institutions[institutions.length-1]).toHaveTextContent(/NO:DEMONO01/i)
  })

  it('Handling: handling answer button click', () => {
    (initialMockProps.onFollowUpSed as jest.Mock).mockReset()
    const replySedButton = screen.getByTestId("a_buc_c_sedheader--answer-button-id")
    fireEvent.click(replySedButton)
    expect(initialMockProps.onFollowUpSed).toHaveBeenCalledWith(buc, mockCurrentSed, mockFollowUpSeds)
  })
})
