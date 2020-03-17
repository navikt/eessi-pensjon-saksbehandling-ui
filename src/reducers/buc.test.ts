import * as types from 'constants/actionTypes'
import { Buc, BucsInfo, Sed } from 'declarations/buc'
import sampleBucs from 'resources/tests/sampleBucs'
import bucReducer, { initialBucState } from './buc'

describe('reducers/buc', () => {
  it('APP_CLEAR_DATA', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.APP_CLEAR_DATA
      })
    ).toEqual(initialBucState)
  })

  it('BUC_MODE_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_MODE_SET,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      mode: 'mockPayload'
    })
  })

  it('BUC_CURRENTBUC_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_CURRENTBUC_SET,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      currentBuc: 'mockPayload'
    })
  })

  it('BUC_CURRENTSED_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_CURRENTSED_SET,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      currentSed: 'mockPayload'
    })
  })

  it('BUC_SEDLIST_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_SEDLIST_SET,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      sedList: 'mockPayload'
    })
  })

  it('BUC_SED_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sed: {
          id: '1'
        } as Sed
      }, {
        type: types.BUC_SED_RESET
      })
    ).toEqual(initialBucState)
  })

  it('BUC_SED_ATTACHMENTS_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        attachments: {
          joark: [{
            journalpostId: '1',
            tittel: 'tittel',
            tema: 'tema',
            datoOpprettet: new Date(2020, 1, 1),
            dokumentInfoId: '1',
            variant: { variantformat: 'variant', filnavn: 'filnavn' }
          }]
        }
      }, {
        type: types.BUC_SED_ATTACHMENTS_RESET
      })
    ).toEqual(initialBucState)
  })

  it('BUC_BUC_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sed: {
          id: '1'
        } as Sed,
        attachments: {
          joark: [{
            journalpostId: '1',
            tittel: 'tittel',
            tema: 'tema',
            datoOpprettet: new Date(2020, 1, 1),
            dokumentInfoId: '1',
            variant: { variantformat: 'variant', filnavn: 'filnavn' }
          }]
        }
      }, {
        type: types.BUC_BUC_RESET,
        payload: 'mockPayload'
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_SINGLE_BUC_SUCCESS', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          123: sampleBucs[0] as Buc
        }
      }, {
        type: types.BUC_GET_SINGLE_BUC_SUCCESS,
        payload: [{
          caseId: sampleBucs[0].caseId,
          type: sampleBucs[0].type
        }]
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        123: sampleBucs[0]
      }
    })
  })

  it('BUC_GET_SINGLE_BUC_SUCCESS: P_BUC_02', () => {
    expect(
      bucReducer({
        ...initialBucState,
        avdodBucs: {}
      }, {
        type: types.BUC_GET_SINGLE_BUC_SUCCESS,
        payload: {
          caseId: '123',
          type: 'P_BUC_02'
        }
      })
    ).toEqual({
      ...initialBucState,
      avdodBucs: {
        123: {
          caseId: '123',
          type: 'P_BUC_02'
        }
      }
    })
  })

  it('BUC_GET_BUCS_SUCCESS with bad payload', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUCS_SUCCESS,
        payload: null
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_BUCS_SUCCESS', () => {
    const sampleBuc = {
      caseId: '123456',
      institusjon: [{
        country: 'NO',
        institution: 'NO:NAVAT07',
        name: 'NAV ACCEPTANCE TEST 07'
      }]
    }
    expect(
      bucReducer({
        ...initialBucState,
        institutionNames: {}
      }, {
        type: types.BUC_GET_BUCS_SUCCESS,
        payload: [sampleBuc]
      })
    ).toEqual({
      ...initialBucState,
      bucs: { 123456: sampleBuc },
      institutionNames: {
        'NO:NAVAT07': 'NAV ACCEPTANCE TEST 07'
      }
    })
  })

  it('BUC_GET_BUCS_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          123: sampleBucs[0] as Buc
        }
      }, {
        type: types.BUC_GET_BUCS_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucs: null
    })
  })

  it('BUC_GET_AVDOD_BUCS_SUCCESS with bad payload', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_AVDOD_BUCS_SUCCESS,
        payload: null
      })
    ).toEqual({
      ...initialBucState
    })
  })

  it('BUC_GET_AVDOD_BUCS_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_AVDOD_BUCS_SUCCESS,
        payload: [{ caseId: 'mockPayload' }]
      })
    ).toEqual({
      ...initialBucState,
      avdodBucs: { mockPayload: { caseId: 'mockPayload' } }
    })
  })

  it('BUC_GET_AVDOD_BUCS_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        avdodBucs: {
          123: sampleBucs[0] as Buc
        }
      }, {
        type: types.BUC_GET_AVDOD_BUCS_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      avdodBucs: null
    })
  })

  it('BUC_GET_BUCSINFO_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUCSINFO_LIST_SUCCESS
      })
    ).toEqual({
      ...initialBucState,
      bucsInfoList: undefined
    })
  })

  it('BUC_GET_BUCSINFO_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucsInfoList: ['mockBucsInfoList']
      }, {
        type: types.BUC_GET_BUCSINFO_LIST_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      bucsInfoList: undefined
    })
  })

  it('BUC_GET_BUCSINFO_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucsInfoList: ['mockBucsInfoList']
      }, {
        type: types.BUC_GET_BUCSINFO_LIST_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucsInfoList: undefined
    })
  })

  it('BUC_GET_BUCSINFO_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUCSINFO_SUCCESS,
        payload: '{"foo": "bar"}'
      })
    ).toEqual({
      ...initialBucState,
      bucsInfo: { foo: 'bar' }
    })
  })

  it('BUC_GET_BUCSINFO_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucsInfo: {
          bucs: {}
        } as BucsInfo
      }, {
        type: types.BUC_GET_BUCSINFO_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      bucsInfo: undefined
    })
  })

  it('BUC_GET_BUCSINFO_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucsInfo: {
          bucs: {}
        } as BucsInfo
      }, {
        type: types.BUC_GET_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucsInfo: undefined
    })
  })

  it('BUC_GET_SUBJECT_AREA_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_SUBJECT_AREA_LIST_SUCCESS,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      subjectAreaList: 'mockPayload'
    })
  })

  it('BUC_GET_SUBJECT_AREA_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        subjectAreaList: ['mockSubjectAreaList']
      }, {
        type: types.BUC_GET_SUBJECT_AREA_LIST_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      subjectAreaList: []
    })
  })
  it('BUC_GET_SUBJECT_AREA_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        subjectAreaList: ['mockSubjectAreaList']
      }, {
        type: types.BUC_GET_SUBJECT_AREA_LIST_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      subjectAreaList: []
    })
  })

  it('BUC_GET_BUC_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUC_LIST_SUCCESS,
        payload: ['mockPayload']
      })
    ).toEqual({
      ...initialBucState,
      bucList: ['mockPayload']
    })
  })

  it('BUC_GET_BUC_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucList: ['mockBucList']
      }, {
        type: types.BUC_GET_BUC_LIST_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      bucList: []
    })
  })
  it('BUC_GET_BUC_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucList: ['mockBucList']
      }, {
        type: types.BUC_GET_BUC_LIST_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucList: []
    })
  })

  it('BUC_GET_TAG_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_TAG_LIST_SUCCESS,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      tagList: 'mockPayload'
    })
  })

  it('BUC_GET_TAG_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        tagList: ['mockTagList']
      }, {
        type: types.BUC_GET_TAG_LIST_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      tagList: []
    })
  })

  it('BUC_GET_TAG_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        tagList: ['mockTagList']
      }, {
        type: types.BUC_GET_TAG_LIST_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      tagList: []
    })
  })

  it('BUC_CREATE_BUC_SUCCESS', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: {}
      }, {
        type: types.BUC_CREATE_BUC_SUCCESS,
        payload: { caseId: 'mockCaseId', mockPayload: 'mockPayload' }
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        mockCaseId: {
          caseId: 'mockCaseId',
          mockPayload: 'mockPayload'
        }
      },
      currentBuc: 'mockCaseId',
      mode: 'bucedit',
      sed: undefined,
      attachments: {}
    })
  })

  it('BUC_CREATE_BUC_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        rinaId: 'mockRinaId'
      }, {
        type: types.BUC_CREATE_BUC_REQUEST
      })
    ).toEqual(initialBucState)
  })

  it('BUC_CREATE_BUC_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        rinaId: 'mockRinaId'
      }, {
        type: types.BUC_CREATE_BUC_FAILURE
      })
    ).toEqual(initialBucState)
  })

  it('BUC_SAVE_BUCSINFO_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_SAVE_BUCSINFO_SUCCESS,
        context: { foo: 'bar' },
        payload: 'Something else'
      })
    ).toEqual({
      ...initialBucState,
      bucsInfo: { foo: 'bar' }
    })
  })

  it('BUC_SAVE_BUCSINFO_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucsInfo: {
          bucs: {}
        }
      }, {
        type: types.BUC_SAVE_BUCSINFO_REQUEST
      })
    ).toEqual(initialBucState)
  })

  it('BUC_SAVE_BUCSINFO_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucsInfo: {
          bucs: {}
        }
      }, {
        type: types.BUC_SAVE_BUCSINFO_FAILURE
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_COUNTRY_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_COUNTRY_LIST_SUCCESS,
        payload: 'something'
      })
    ).toEqual({
      ...initialBucState,
      countryList: 'something'
    })
  })

  it('BUC_GET_COUNTRY_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        countryList: ['something']
      }, {
        type: types.BUC_GET_COUNTRY_LIST_REQUEST
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_COUNTRY_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        countryList: ['something']
      }, {
        type: types.BUC_GET_COUNTRY_LIST_FAILURE
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_SED_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_SED_LIST_SUCCESS,
        payload: ['P4000', 'A3012', 'B1000', 'P10000', 'X800', 'H208', 'H207', 'P2000']
      })
    ).toEqual({
      ...initialBucState,
      sedList: ['P2000', 'P4000', 'P10000', 'H207', 'H208', 'X800', 'B1000', 'A3012']
    })
  })

  it('BUC_GET_SED_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sedList: ['something']
      }, {
        type: types.BUC_GET_SED_LIST_REQUEST
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_SED_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sedList: ['something']
      }, {
        type: types.BUC_GET_SED_LIST_FAILURE
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_INSTITUTION_LIST_SUCCESS', () => {
    const mockPayload = [
      { id: '1', navn: 'a', akronym: 'A', landkode: 'AA' },
      { id: '2', navn: 'aa', akronym: 'AA', landkode: 'AA' },
      { id: '3', navn: 'b', akronym: 'B', landkode: 'BB' }
    ]
    expect(
      bucReducer({
        ...initialBucState,
        institutionList: {},
        institutionNames: {}
      }, {
        type: types.BUC_GET_INSTITUTION_LIST_SUCCESS,
        payload: mockPayload,
        context: {
          buc: 'mockBucContext'
        }
      })
    ).toEqual({
      ...initialBucState,
      institutionNames: {
        1: 'a',
        2: 'aa',
        3: 'b'
      },

      institutionList: {
        AA: [
          { id: '1', navn: 'a', akronym: 'A', landkode: 'AA', buc: 'mockBucContext' },
          { id: '2', navn: 'aa', akronym: 'AA', landkode: 'AA', buc: 'mockBucContext' }
        ],
        BB: [
          { id: '3', navn: 'b', akronym: 'B', landkode: 'BB', buc: 'mockBucContext' }
        ]
      }
    })
  })

  it('BUC_RINA_GET_URL_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_RINA_GET_URL_SUCCESS,
        payload: {
          rinaUrl: 'mockRinaUrl'
        }
      })
    ).toEqual({
      ...initialBucState,
      rinaUrl: 'mockRinaUrl'
    })
  })

  it('BUC_CREATE_SED_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_CREATE_SED_SUCCESS,
        payload: 'something'
      })
    ).toEqual({
      ...initialBucState,
      sed: 'something'
    })
  })

  it('BUC_CREATE_REPLY_SED_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_CREATE_REPLY_SED_SUCCESS,
        payload: 'something'
      })
    ).toEqual({
      ...initialBucState,
      sed: 'something'
    })
  })

  it('BUC_SEND_ATTACHMENT_REQUEST', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_SEND_ATTACHMENT_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      attachmentsError: false
    })
  })

  it('BUC_SEND_ATTACHMENT_FAILURE', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_SEND_ATTACHMENT_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      attachmentsError: true
    })
  })

  it('BUC_SEND_ATTACHMENT_SUCCESS: existing attachment', () => {
    expect(
      bucReducer({
        ...initialBucState,
        attachments: {
          joark: [{
            dokumentInfoId: '1',
            journalpostId: '1',
            variant: { variantformat: 'variantformat', filnavn: 'filnavn' },
            tittel: 'tittel',
            tema: 'tema',
            datoOpprettet: new Date(2020, 1, 1)
          }]
        }
      }, {
        type: types.BUC_SEND_ATTACHMENT_SUCCESS,
        context: {
          dokumentInfoId: '1',
          journalpostId: '1',
          variant: { variantformat: 'variantformat', filnavn: 'filnavn' }
        }
      })
    ).toEqual({
      ...initialBucState,
      attachments: {
        joark: [{
          dokumentInfoId: '1',
          journalpostId: '1',
          variant: { variantformat: 'variantformat', filnavn: 'filnavn' },
          tittel: 'tittel',
          tema: 'tema',
          datoOpprettet: new Date(2020, 1, 1)
        }]
      }
    })
  })

  it('BUC_SEND_ATTACHMENT_SUCCESS: non-existing attachment', () => {
    expect(
      bucReducer({
        ...initialBucState,
        attachments: {}
      }, {
        type: types.BUC_SEND_ATTACHMENT_SUCCESS,
        context: {
          dokumentInfoId: '1',
          journalpostId: '1',
          variant: { variantformat: 'variantformat', filnavn: 'filnavn' },
          tittel: 'tittel',
          tema: 'tema',
          datoOpprettet: new Date(2020, 1, 1)
        }
      })
    ).toEqual({
      ...initialBucState,
      attachments: {
        joark: [{
          dokumentInfoId: '1',
          journalpostId: '1',
          variant: { variantformat: 'variantformat', filnavn: 'filnavn' },
          tittel: 'tittel',
          tema: 'tema',
          datoOpprettet: new Date(2020, 1, 1)
        }]
      }
    })
  })

  it('BUC_GET_P4000_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_P4000_LIST_SUCCESS,
        payload: 'something'
      })
    ).toEqual({
      ...initialBucState,
      p4000list: 'something'
    })
  })

  it('BUC_GET_P4000_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        p4000list: ['something']
      }, {
        type: types.BUC_GET_P4000_LIST_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      p4000list: null
    })
  })

  it('BUC_GET_P4000_INFO_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_P4000_INFO_SUCCESS,
        payload: 'something'
      })
    ).toEqual({
      ...initialBucState,
      p4000info: 'something'
    })
  })

  it('BUC_P4000_INFO_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_P4000_INFO_SET,
        payload: 'something'
      })
    ).toEqual({
      ...initialBucState,
      p4000info: 'something'
    })
  })

  it('BUC_GET_P4000_INFO_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        p4000info: {
          person: {},
          bank: {},
          stayAbroad: []
        }
      }, {
        type: types.BUC_GET_P4000_INFO_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      p4000info: null
    })
  })

  it('UNKNOWN_ACTION', () => {
    expect(
      bucReducer(initialBucState, {
        type: 'UNKNOWN_ACTION',
        payload: undefined
      })
    ).toEqual(initialBucState)
  })
})
