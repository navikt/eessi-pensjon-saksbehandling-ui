import joarkReducer, { initialJoarkState } from './joark.js'
import * as types from 'constants/actionTypes'

describe('reducers/joark', () => {
  const mockPayload = {
    data: {
      dokumentoversiktBruker: {
        journalposter: [{
          tilleggsopplysninger: 'mocktilleggsopplysninger',
          journalpostId: 'mockjournalpostId',
          datoOpprettet: '2020-12-17T03:24:00',
          tema: 'mocktema',
          dokumenter: [{
            tittel: 'mocktittel',
            dokumentInfoId: 'mockdokumentInfoId',
            dokumentvarianter: [{
              variantformat: 'mockVariantFormat1'
            }, {
              variantformat: 'mockVariantFormat2'
            }]
          }]
        }, {
          tilleggsopplysninger: 'mocktilleggsopplysninger2',
          journalpostId: 'mockjournalpostId2',
          datoOpprettet: '2020-12-17T03:24:00',
          tema: 'mocktema2',
          dokumenter: [{
            tittel: 'mocktittel2',
            dokumentInfoId: 'mockdokumentInfoId2',
            dokumentvarianter: [{
              variantformat: 'mockVariantFormat1'
            }, {
              variantformat: 'mockVariantFormat2'
            }]
          }]
        }]
      }
    }
  }

  const mockList = [{
    tilleggsopplysninger: 'mocktilleggsopplysninger',
    journalpostId: 'mockjournalpostId',
    tittel: 'mocktittel',
    tema: 'mocktema',
    dokumentInfoId: 'mockdokumentInfoId',
    datoOpprettet: new Date(Date.parse('2020-12-17T03:24:00')),
    varianter: ['mockVariantFormat1', 'mockVariantFormat2']
  }, {
    tilleggsopplysninger: 'mocktilleggsopplysninger2',
    journalpostId: 'mockjournalpostId2',
    tittel: 'mocktittel2',
    tema: 'mocktema2',
    dokumentInfoId: 'mockdokumentInfoId2',
    datoOpprettet: new Date(Date.parse('2020-12-17T03:24:00')),
    varianter: ['mockVariantFormat1', 'mockVariantFormat2']
  }]

  it('JOARK_LIST_SUCCESS', () => {
    expect(
      joarkReducer(initialJoarkState, {
        type: types.JOARK_LIST_SUCCESS,
        payload: mockPayload
      })
    ).toEqual({
      ...initialJoarkState,
      list: mockList
    })
  })

  it('JOARK_GET_SUCCESS', () => {
    expect(
      joarkReducer(initialJoarkState, {
        type: types.JOARK_GET_SUCCESS,
        context: {
          journalpostId: 'mockjournalpostId',
          tilleggsopplysninger: 'mocktilleggsopplysninger',
          tittel: 'mocktittel2',
          tema: 'mocktema2',
          dokumentInfoId: 'mockdokumentInfoId2',
          datoOpprettet: '2020-12-17T03:24:00',
          variant: 'mockVariant'
        },
        payload: {
          fileName: 'mockName',
          base64: 'mockContent',
          contentType: 'mockContentType'
        }
      })
    ).toEqual({
      ...initialJoarkState,
      file: {
        journalpostId: 'mockjournalpostId',
        tilleggsopplysninger: 'mocktilleggsopplysninger',
        tittel: 'mocktittel2',
        tema: 'mocktema2',
        dokumentInfoId: 'mockdokumentInfoId2',
        datoOpprettet: '2020-12-17T03:24:00',
        variant: 'mockVariant',
        name: 'mockName',
        size: 11,
        mimetype: 'mockContentType',
        content: {
          base64: 'mockContent'
        }
      }
    })
  })

  it('JOARK_PREVIEW_SUCCESS', () => {
    expect(
      joarkReducer(initialJoarkState, {
        type: types.JOARK_PREVIEW_SUCCESS,
        context: {
          journalpostId: 'mockjournalpostId',
          tilleggsopplysninger: 'mocktilleggsopplysninger',
          tittel: 'mocktittel2',
          tema: 'mocktema2',
          dokumentInfoId: 'mockdokumentInfoId2',
          datoOpprettet: '2020-12-17T03:24:00',
          variant: 'mockVariant'
        },
        payload: {
          fileName: 'mockName',
          base64: 'mockContent',
          contentType: 'mockContentType'
        }
      })
    ).toEqual({
      ...initialJoarkState,
      previewFile: {
        journalpostId: 'mockjournalpostId',
        tilleggsopplysninger: 'mocktilleggsopplysninger',
        tittel: 'mocktittel2',
        tema: 'mocktema2',
        dokumentInfoId: 'mockdokumentInfoId2',
        datoOpprettet: '2020-12-17T03:24:00',
        variant: 'mockVariant',
        name: 'mockName',
        size: 11,
        mimetype: 'mockContentType',
        content: {
          base64: 'mockContent'
        }
      }
    })
  })
})
