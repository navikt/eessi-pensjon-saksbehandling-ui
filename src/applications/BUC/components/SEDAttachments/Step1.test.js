import React, { Suspense } from 'react'
import Step1 from './Step1'
import _ from 'lodash'
import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'
import sampleJoark from 'resources/tests/sampleJoark'

describe('applications/BUC/components/Step1/Step1', () => {
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    t: t,
    files: {},
    setFiles: jest.fn()
  }

  const changedInitialState = _.cloneDeep(initialState)

  // set up initial state
  changedInitialState.joark.list = []
  sampleJoark.mockdata.data.dokumentoversiktBruker.journalposter.forEach(post => {
    post.dokumenter.forEach(doc => {
      changedInitialState.joark.list.push({
        tilleggsopplysninger: post.tilleggsopplysninger,
        journalpostId: post.journalpostId,
        tittel: doc.tittel,
        tema: post.tema,
        dokumentInfoId: doc.dokumentInfoId,
        datoOpprettet: new Date(Date.parse(post.datoOpprettet)),
        varianter: doc.dokumentvarianter.map(variant => {
          return {
            variantformat: variant.variantformat,
            filnavn: variant.filnavn
          }
        })
      })
    })
  })
  let wrapper

  beforeEach(() => {
    wrapper = mount(
      <StoreProvider initialState={changedInitialState} reducer={reducer}>
        <Suspense fallback={<div />}>
          <Step1 {...initialMockProps} />
        </Suspense>
      </StoreProvider>)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedattachments-step1')).toBeTruthy()
    expect(wrapper.exists('JoarkBrowser')).toBeTruthy()
  })

  it('Calls setFiles when selecting a file', () => {
    wrapper.find('#c-tablesorter__checkbox-1-ARKIV__23534345_pdf_').hostNodes().simulate('change', { target: { checked: true } })
    const expectedFile = changedInitialState.joark.list[0]
    expectedFile.variant = {
      variantformat: 'ARKIV',
      filnavn: '23534345.pdf'
    }
    expect(initialMockProps.setFiles).toHaveBeenCalledWith({ joark: [expectedFile] })
  })
})
