import bucReducer, { initialBucState } from './buc.js'
import * as types from 'constants/actionTypes'

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

  it('BUC_BUC_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_BUC_SET,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      buc: 'mockPayload'
    })
  })

  it('BUC_SEDS_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_SEDS_SET,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      seds: 'mockPayload'
    })
  })

  it('BUC_SED_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sed: 'mockSed'
      }, {
        type: types.BUC_SED_RESET
      })
    ).toEqual(initialBucState)
  })

  it('BUC_BUC_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        buc: 'mockBuc',
        seds: 'mockSeds',
        sed: 'mockSed',
        attachments: 'mockAttachments'
      }, {
        type: types.BUC_BUC_RESET,
        payload: 'mockPayload'
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_BUCS_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUCS_SUCCESS,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      bucs: 'mockPayload'
    })
  })

  it('BUC_GET_BUCS_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: 'mockBucs'
      }, {
        type: types.BUC_GET_BUCS_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      bucs: undefined
    })
  })

  it('BUC_GET_BUCS_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: 'mockBucs'
      }, {
        type: types.BUC_GET_BUCS_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucs: null
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
        bucsInfoList: 'mockBucsInfoList'
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
        bucsInfoList: 'mockBucsInfoList'
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
        bucsInfo: 'mockBucsInfo'
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
        bucsInfo: 'mockBucsInfo'
      }, {
        type: types.BUC_GET_BUCSINFO_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucsInfo: undefined
    })
  })

  it('BUC_VERIFY_CASE_NUMBER_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_VERIFY_CASE_NUMBER_SUCCESS,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      currentBUC: 'mockPayload'
    })
  })

  it('BUC_VERIFY_CASE_NUMBER_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        currentBUC: 'mockCurrentBUC'
      }, {
        type: types.BUC_VERIFY_CASE_NUMBER_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      currentBUC: undefined
    })
  })

  it('BUC_VERIFY_CASE_NUMBER_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        currentBUC: 'mockCurrentBUC'
      }, {
        type: types.BUC_VERIFY_CASE_NUMBER_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      currentBUC: undefined
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
        subjectAreaList: 'mockSubjectAreaList'
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
        subjectAreaList: 'mockSubjectAreaList'
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
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      bucList: 'mockPayload'
    })
  })

  it('BUC_GET_BUC_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucList: 'mockBucList'
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
        bucList: 'mockBucList'
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
        tagList: 'mockTagList'
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
        tagList: 'mockTagList'
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
      bucReducer(initialBucState, {
        type: types.BUC_CREATE_BUC_SUCCESS,
        payload: 'mockPayload'
      })
    ).toEqual({
      ...initialBucState,
      buc: 'mockPayload',
      seds: [],
      sed: undefined,
      attachments: undefined
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
        originalPayload: '{"foo":"bar"}'
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
        bucsInfo: 'something'
      }, {
        type: types.BUC_SAVE_BUCSINFO_REQUEST
      })
    ).toEqual(initialBucState)
  })

  it('BUC_SAVE_BUCSINFO_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucsInfo: 'something'
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
        countryList: 'something'
      }, {
        type: types.BUC_GET_COUNTRY_LIST_REQUEST
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_COUNTRY_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        countryList: 'something'
      }, {
        type: types.BUC_GET_COUNTRY_LIST_FAILURE
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_SED_LIST_SUCCESS', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_SED_LIST_SUCCESS,
        payload: 'something'
      })
    ).toEqual({
      ...initialBucState,
      sedList: 'something'
    })
  })

  it('BUC_GET_SED_LIST_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sedList: 'something'
      }, {
        type: types.BUC_GET_SED_LIST_REQUEST
      })
    ).toEqual(initialBucState)
  })

  it('BUC_GET_SED_LIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sedList: 'something'
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

  it('BUC_SED_ATTACHMENT_SUCCESS: existing attachment', () => {
    expect(
      bucReducer({
        ...initialBucState,
        attachments: [{ dokumentInfoId: 1 }]
      }, {
        type: types.BUC_SED_ATTACHMENT_SUCCESS,
        payload: { dokumentInfoId: 1 }
      })
    ).toEqual({
      ...initialBucState,
      attachments: [{ dokumentInfoId: 1 }]
    })
  })

  it('BUC_SED_ATTACHMENT_SUCCESS: non-existing attachment', () => {
    expect(
      bucReducer({
        ...initialBucState,
        attachments: [{ dokumentInfoId: 1 }]
      }, {
        type: types.BUC_SED_ATTACHMENT_SUCCESS,
        payload: { dokumentInfoId: 2 }
      })
    ).toEqual({
      ...initialBucState,
      attachments: [{ dokumentInfoId: 1 }, { dokumentInfoId: 2 }]
    })
  })

  it('BUC_SED_UPDATE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: [{
          id: 'buc1',
          type: 'bucType1',
          seds: [{
            id: 'sed1',
            status: 'mockStatus'
          }]
        }],
        buc: {
          id: 'buc1',
          type: 'bucType1',
          seds: [{
            id: 'sed1',
            status: 'mockStatus'
          }]
        },
        seds: [{
          id: 'sed1',
          status: 'mockStatus'
        }]
      }, {
        type: types.BUC_SED_UPDATE,
        payload: {
          action: 'RECEIVED',
          payload: {
            sedId: 'sed1'
          }
        }
      })
    ).toEqual({
      ...initialBucState,
      bucs: [{
        id: 'buc1',
        type: 'bucType1',
        seds: [{
          id: 'sed1',
          status: 'received'
        }]
      }],
      buc: {
        id: 'buc1',
        type: 'bucType1',
        seds: [{
          id: 'sed1',
          status: 'received'
        }]
      },
      seds: [{
        id: 'sed1',
        status: 'received'
      }],
      update: {
        action: 'RECEIVED',
        payload: {
          sedId: 'sed1'
        }
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
        p4000list: 'something'
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

  it('BUC_GET_P4000_INFO_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        p4000info: 'something'
      }, {
        type: types.BUC_GET_P4000_INFO_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      p4000info: null
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
})
