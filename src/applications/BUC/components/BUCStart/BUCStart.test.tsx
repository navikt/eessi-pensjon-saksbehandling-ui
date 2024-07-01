import { createBuc, getBucOptions, getTagList, saveBucsInfo } from 'src/actions/buc'
import * as constants from 'src/constants/constants'
import { AllowedLocaleString } from 'src/declarations/app.d'
import { BucsInfo } from 'src/declarations/buc'
import { render, screen, fireEvent } from '@testing-library/react'
import { within } from '@testing-library/dom'
import _ from 'lodash'
import mockFeatureToggles from 'src/mocks/app/featureToggles'
import mockPerson from 'src/mocks/person/personPdl'
import mockPersonAvdods from 'src/mocks/person/personAvdod'
import mockBucOptions from 'src/mocks/buc/bucOptions'
import mockBucs from 'src/mocks/buc/bucs'
import mockBucsInfo from 'src/mocks/buc/bucsInfo'
import mockTagsList from 'src/mocks/buc/tagsList'
import { stageSelector } from 'src/setupTests'
import BUCStart, { BUCStartProps } from './BUCStart'
import React from 'react'

jest.mock('src/actions/buc', () => ({
  cleanNewlyCreatedBuc: jest.fn(),
  createBuc: jest.fn(),
  getBucOptions: jest.fn(),
  getTagList: jest.fn(),
  resetBuc: jest.fn(),
  saveBucsInfo: jest.fn()
}))

const bucs = _.keyBy(mockBucs(), 'caseId')
const currentBuc = _.values(bucs)[0].caseId
const mockPersonAvdod = mockPersonAvdods(1)

const defaultSelector = {
  bucOptions: mockBucOptions,
  bucParam: undefined,
  bucs,
  bucsInfo: {},
  currentBuc: undefined,
  featureToggles: mockFeatureToggles,
  loading: {},
  locale: 'nb' as AllowedLocaleString,
  newlyCreatedBuc: undefined,
  person: mockPerson,
  personAvdods: mockPersonAvdod,
  pesysContext: constants.VEDTAKSKONTEKST,
  sakId: '123',
  subjectAreaList: ['Pensjon'],
  tagList: mockTagsList
}

describe('applications/BUC/components/BUCStart/BUCStart', () => {
  let wrapper: any
  const initialMockProps: BUCStartProps = {
    aktoerId: '456',
    onBucCreated: jest.fn(),
    onBucCancelled: jest.fn()
  } as BUCStartProps

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: match snapshot', () => {
    const { container } = render(<BUCStart {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    render(<BUCStart {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCStart')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--subjectarea-select-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--buc-select-id')).toBeInTheDocument()
    expect(screen.queryByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--tags-select-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--buttons-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--forward-button-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--cancel-button-id')).toBeInTheDocument()
  })

  it('Render: render Avdod when BUC is P_BUC_02', () => {
    render(<BUCStart {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).not.toBeInTheDocument()
    const select = within(screen.getByTestId('a_buc_c_BUCStart--buc-select-id')).getByRole('input')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })
    expect(screen.getByTestId('a_buc_c_BUCStart--avdod-select-id')).toBeInTheDocument()
  })

  it('UseEffect: Fetch buc list', () => {
    (getBucOptions as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucOptions: undefined
    })
    render(<BUCStart {...initialMockProps} />)
    expect(getBucOptions).toHaveBeenCalled()
  })

  it('UseEffect: Fetch tag list', () => {
    (getTagList as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      tagList: undefined
    })
    render(<BUCStart {...initialMockProps} />)
    expect(getTagList).toHaveBeenCalled()
  })

  it('UseEffect: set avdod if we have one, and _buc selected on P_BUC_02', () => {
    jest.useFakeTimers({ legacyFakeTimers: true })
    const mockUseState = jest.fn()
    const useStateSpy = jest.spyOn(React, 'useState').mockImplementation(() => {
      return [undefined, mockUseState]
    })
    stageSelector(defaultSelector, {
      bucParam: 'P_BUC_02',
      personAvdods: mockPersonAvdods(1)
    })
    render(<BUCStart {...initialMockProps} />)
    jest.runAllImmediates()

    // TODO
    // expect(mockUseState).toHaveBeenCalled()
    useStateSpy.mockRestore()
  })

  it('UseEffect: saves bucsInfo after when buc was saved', () => {
    (saveBucsInfo as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      bucsInfo: mockBucsInfo as BucsInfo,
      bucs,
      currentBuc,
      newlyCreatedBuc: bucs[currentBuc]
    })
    render(<BUCStart {...initialMockProps} initialIsCreatingBuc />)
    expect(saveBucsInfo).toHaveBeenCalledWith({
      bucsInfo: mockBucsInfo,
      aktoerId: '456',
      tags: [],
      buc: _.values(bucs)[0]
    })
  })

  it('UseEffect: call bucCreated after bucInfo is saved', () => {
    (initialMockProps.onBucCreated as jest.Mock).mockReset()
    stageSelector(defaultSelector, {
      newlyCreatedBuc: bucs[currentBuc]
    })
    render(<BUCStart {...initialMockProps} initialCreatingBucInfo />)
    expect(initialMockProps.onBucCreated).toHaveBeenCalled()
  })

  it('Handling: invalid onForwardButtonClick(): nothing selected', () => {
    const { container } = render(<BUCStart {...initialMockProps} />)
    expect(container.querySelector('div.feiloppsummering')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('a_buc_c_BUCStart--forward-button-id'))
    expect(wrapper.exists('div.feiloppsummering')).toBeInTheDocument()
    expect(wrapper.find('div.feiloppsummering').render().text()).toEqual('buc:form-feiloppsummering' + 'message:validation-chooseBuc')
  })

  it('Handling: invalid onForwardButtonClick(): set warning for P_BUC_02 and no avdod', () => {
    stageSelector(defaultSelector, {
      personAvdods: []
    })
    render(<BUCStart {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_BUCStart--warning-id')).not.toBeInTheDocument()
    const select = within(screen.getByTestId('a_buc_c_BUCStart--buc-select-id')).getByRole('input')
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'ArrowDown' })
    fireEvent.keyDown(select, { key: 'Enter' })
    fireEvent.click(screen.getByTestId('a_buc_c_BUCStart--forward-button-id'))
    expect(screen.getByTestId('a_buc_c_BUCStart--warning-id')).toBeInTheDocument()
    expect(screen.getByTestId('a_buc_c_BUCStart--warning-id')).toHaveTextContent(
      'advarsel' + 'message:alert-noDeceased'
    )
  })

  it('Handling: valid onForwardButtonClick()', () => {
    // select P_BUC_02
    const select = wrapper.find('[data-testid=\'a_buc_c_BUCStart--buc-select-id\'] input').hostNodes()
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'ArrowDown' })
    select.simulate('keyDown', { key: 'Enter' })
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--forward-button-id').hostNodes().simulate('click')
    expect(createBuc).toHaveBeenCalledWith({
      buc: 'P_BUC_02',
      person: mockPerson,
      avdod: mockPersonAvdod![0]
    })
  })

  it('Handling: onCancelButtonClick()', () => {
    (initialMockProps.onBucCancelled as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'a_buc_c_BUCStart--cancel-button-id').hostNodes().simulate('click')
    expect(initialMockProps.onBucCancelled).toHaveBeenCalled()
  })
})
