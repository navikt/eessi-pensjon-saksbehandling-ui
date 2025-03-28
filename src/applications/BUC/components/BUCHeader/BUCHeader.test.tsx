import { sedFilter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import { Buc, BucsInfo } from 'src/declarations/buc'
import { render, screen, fireEvent } from '@testing-library/react'
import mockBucs from 'src/mocks/buc/bucs'
import mockBucsInfo from 'src/mocks/buc/bucsInfo'
import moment from 'moment'
import { stageSelector } from 'src/setupTests'
import BUCHeader, { BUCHeaderProps, BUCHeaderSelector } from './BUCHeader'

const defaultSelector: BUCHeaderSelector = {
  institutionNames: {},
  locale: 'nb',
  rinaUrl: 'http://rinaurl.mock.com',
  size: 'lg'
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

  it('Render: match snapshot', () => {
    const { container } = render(<BUCHeader {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    render(<BUCHeader {...initialMockProps} />)
    expect(screen.getByText(
      'ui:created: ' + moment(new Date(buc.startDate as number)).format('DD.MM.YYYY')
    ))
    expect(screen.getByRole('heading', )).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    expect(screen.getByText('' + buc.seds?.filter(sedFilter).length))

  })

  it('Render: shows icon if we have tags', () => {
    render(<BUCHeader {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_tags_id')).toBeInTheDocument()
    const mockProps = {
      ...initialMockProps,
      bucInfo: {
        tags: []
      },
      buc: {
        ...buc,
        seds: []
      } as Buc
    }
    // @ts-ignore
    render(<BUCHeader {...mockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCHeader--icon_tags_id')).not.toBeInTheDocument()
  })

  it('Handling: open Rina link', () => {
    window.open = jest.fn()
    fireEvent.click(screen.getByTestId('a_buc_c_BUCHeader--label_case_gotorina_link_id'))
    expect(window.open).toHaveBeenCalledWith(defaultSelector.rinaUrl! + initialMockProps.buc.caseId, 'rinaWindow')
  })
})
