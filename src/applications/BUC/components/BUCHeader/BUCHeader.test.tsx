import { Buc, BucsInfo } from 'src/declarations/buc'
import { render, screen, fireEvent } from '@testing-library/react'
import mockBucs from 'src/mocks/buc/bucs'
import mockBucsInfo from 'src/mocks/buc/bucsInfo'
import { stageSelector } from 'src/setupTests'
import BUCHeader, { BUCHeaderProps, BUCHeaderSelector } from './BUCHeader'
import dayjs from "dayjs";

const defaultSelector: BUCHeaderSelector = {
  institutionNames: {},
  locale: 'nb',
  rinaUrl: 'http://rinaurl.mock.com',
}

describe('applications/BUC/components/BUCHeader/BUCHeader', () => {
  const buc: Buc = mockBucs()[0]
  buc.deltakere = buc.institusjon
  const initialMockProps: BUCHeaderProps = {
    buc,
    bucInfo: (mockBucsInfo as BucsInfo).bucs['' + buc.caseId],
    newBuc: true
  } as BUCHeaderProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: has proper HTML structure', () => {
    render(<BUCHeader {...initialMockProps} />)
    expect(screen.getByRole('heading', )).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText(
      (content) => content.startsWith(buc.type!))
    )
    expect(screen.getByText(
      'ui:created: ' + dayjs(new Date(buc.startDate as number)).format('DD.MM.YYYY'))
    )
    expect(screen.getByText('buc:form-caseOwner:'))
    expect(screen.queryAllByText(buc.creator?.institution!))
    expect(screen.getByText(buc.caseId!))
  })

  it('Handling: open Rina link', () => {
    render(<BUCHeader {...initialMockProps} />)
    window.open = jest.fn()
    fireEvent.click(screen.getByTestId('a_buc_c_BUCHeader--label_case_gotorina_link_id'))
    expect(window.open).toHaveBeenCalledWith(defaultSelector.rinaUrl! + initialMockProps.buc.caseId, 'rinaWindow')
  })
})
