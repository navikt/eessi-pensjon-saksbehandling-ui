import * as types from 'constants/actionTypes'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { Buc, BucsInfo, Participant, Sed } from 'declarations/buc'
import mockBucs from 'mocks/buc/bucs'
import mockJoarkItems from 'mocks/joark/items'
import bucReducer, { initialBucState } from './buc'

const mockBuc: Buc = mockBucs()[0] as Buc

describe('reducers/buc', () => {
  it('APP_CLEAR_DATA', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.APP_CLEAR_DATA
      })
    ).toEqual(initialBucState)
  })

  it('BUC_BUC_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        currentBuc: '1',
        currentSed: {
          id: '1'
        } as Sed,
        replySed: {
          id: '1'
        } as Sed,
        sed: {
          id: '1'
        } as Sed,
        savingAttachmentsJob: {
          total: [],
          remaining: [],
          saved: [],
          saving: undefined
        },
        sedContent: {}
      }, {
        type: types.BUC_BUC_RESET,
        payload: 'mockPayload'
      })
    ).toEqual(initialBucState)
  })

  it('BUC_CREATE_BUC_SUCCESS', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: {}
      }, {
        type: types.BUC_CREATE_BUC_SUCCESS,
        payload: { caseId: '123', mockPayload: 'mockPayload' },
        context: {
          person: {
            aktoer: {
              ident: {
                ident: '456'
              }
            }
          }
        }
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        123: {
          addedParams: {},
          caseId: '123',
          mockPayload: 'mockPayload'
        }
      },
      currentBuc: '123',
      newlyCreatedBuc: {
        addedParams: {},
        caseId: '123',
        mockPayload: 'mockPayload'
      },
      sed: undefined
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

  it('BUC_CREATE_REPLY_SED_SUCCESS', () => {
    jest
      // @ts-ignore
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => new Date('2020-01-01T00:00:00.000Z').getTime())

    const mockBuc = {
      aktoerId: '1',
      caseId: '1',
      creator: {
        country: 'NO',
        institution: 'foo'
      },
      deltakere: [],
      description: '',
      institusjon: [],
      startDate: 0,
      type: 'P_BUC_01',
      lastUpdate: 0,
      status: 'new',
      sakType: 'Generell',
      seds: []
    } as Buc

    const mockParticipant = {
      organisation: {
        address: {
          country: 'NO'
        },
        countryCode: 'NO',
        id: 'foo',
        name: ''
      },
      role: 'Sender',
      selected: true
    } as Participant

    const mockNewSed: Sed = {
      status: 'new',
      participants: [mockParticipant]
    } as Sed

    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          1: mockBuc
        },
        currentBuc: '1'
      }, {
        type: types.BUC_CREATE_REPLY_SED_SUCCESS,
        payload: {},
        context: {
          sed: {}
        }
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        1: {
          ...mockBuc,
          seds: [mockNewSed]
        }
      },
      sed: mockNewSed,
      newlyCreatedSed: mockNewSed,
      currentBuc: '1',
      newlyCreatedSedTime: new Date('2020-01-01T00:00:00.000Z').getTime()
    })
  })

  it('BUC_CREATE_SED_SUCCESS', () => {
    jest
      // @ts-ignore
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => new Date('2020-01-01T00:00:00.000Z').getTime())

    const mockBuc = {
      aktoerId: '1',
      caseId: '1',
      creator: {
        country: 'NO',
        institution: 'foo'
      },
      deltakere: [],
      description: '',
      institusjon: [],
      startDate: 0,
      type: 'P_BUC_01',
      lastUpdate: 0,
      status: 'new',
      sakType: 'Generell',
      seds: []
    } as Buc

    const mockParticipant = {
      organisation: {
        address: {
          country: 'NO'
        },
        countryCode: 'NO',
        id: 'foo',
        name: ''
      },
      role: 'Sender',
      selected: true
    } as Participant

    const mockNewSed: Sed = {
      status: 'new',
      participants: [mockParticipant]
    } as Sed

    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          1: mockBuc
        },
        currentBuc: '1'
      }, {
        type: types.BUC_CREATE_SED_SUCCESS,
        payload: {},
        context: {
          sed: {}
        }
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        1: {
          ...mockBuc,
          seds: [mockNewSed]
        }
      },
      sed: mockNewSed,
      newlyCreatedSed: mockNewSed,
      currentBuc: '1',
      newlyCreatedSedTime: new Date('2020-01-01T00:00:00.000Z').getTime()
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
        payload: {
          sed: 'mockSed',
          replySed: 'mockReplySed'
        }
      })
    ).toEqual({
      ...initialBucState,
      currentSed: 'mockSed',
      replySed: 'mockReplySed'
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
    const mockBuc = {
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
        payload: [mockBuc]
      })
    ).toEqual({
      ...initialBucState,
      bucs: { 123456: mockBuc },
      institutionNames: {
        'NO:NAVAT07': {
          country: 'NO',
          institution: 'NO:NAVAT07',
          name: 'NAV ACCEPTANCE TEST 07'
        }
      }
    })
  })

  it('BUC_GET_BUCS_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          123: mockBuc
        }
      }, {
        type: types.BUC_GET_BUCS_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucs: null
    })
  })

  it('BUC_GET_BUC_LIST_SUCCESS: Feature toggle P_BUC_10 true', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUC_LIST_SUCCESS,
        payload: ['mockPayload', 'P_BUC_10'],
        context: {
          pesysContext: VEDTAKSKONTEKST,
          featureToggles: {
            P_BUC_10_VISIBLE: true
          }
        }
      })
    ).toEqual({
      ...initialBucState,
      bucList: ['mockPayload', 'P_BUC_10']
    })
  })

  it('BUC_GET_BUC_LIST_SUCCESS: Feature toggle P_BUC_10 false', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUC_LIST_SUCCESS,
        payload: ['mockPayload', 'P_BUC_10'],
        context: {
          featureToggles: {
            P_BUC_10_VISIBLE: false
          }
        }
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

  it('BUC_GET_INSTITUTION_LIST_SUCCESS', () => {
    const mockPayload = [
      { institution: '1', name: 'a', country: 'AA' },
      { institution: '2', name: 'aa', country: 'AA' },
      { institution: '3', name: 'b', country: 'BB' }
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
        1: { institution: '1', name: 'a', country: 'AA' },
        2: { institution: '2', name: 'aa', country: 'AA' },
        3: { institution: '3', name: 'b', country: 'BB' }
      },

      institutionList: {
        AA: [
          { institution: '1', name: 'a', country: 'AA', buc: 'mockBucContext' },
          { institution: '2', name: 'aa', country: 'AA', buc: 'mockBucContext' }
        ],
        BB: [
          { institution: '3', name: 'b', country: 'BB', buc: 'mockBucContext' }
        ]
      }
    })
  })

  it('BUC_GET_PARTICIPANTS_SUCCESS', () => {
    const mockCaseId = mockBucs()[0].caseId
    const newState = bucReducer({
      ...initialBucState,
      bucs: {
        [mockCaseId]: mockBuc
      }
    }, {
      type: types.BUC_GET_PARTICIPANTS_SUCCESS,
      context: {
        rinaCaseId: mockCaseId
      },
      payload: [{
        organisation: {
          countryCode: 'AA',
          id: 'ID',
          name: 'NAME'
        }
      }]
    })
    expect(newState.bucs![mockCaseId!].deltakere).toEqual([
      { country: 'AA', institution: 'ID', name: 'NAME', acronym: 'ID' }
    ])
  })

  it('BUC_GET_SINGLE_BUC_SUCCESS', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          123: mockBuc
        }
      }, {
        type: types.BUC_GET_SINGLE_BUC_SUCCESS,
        payload: [{
          caseId: mockBucs()[0].caseId,
          type: mockBucs()[0].type
        }]
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        123: mockBuc
      }
    })
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

  it('BUC_GET_SED_SUCCESS', () => {
    expect(
      bucReducer({
        ...initialBucState,
        sedContent: {
          1: 'somePayload'
        }
      }, {
        type: types.BUC_GET_SED_SUCCESS,
        payload: 'mockPayload',
        context: {
          id: 2
        }
      })
    ).toEqual({
      ...initialBucState,
      sedContent: {
        1: 'somePayload',
        2: 'mockPayload'
      }
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

  it('BUC_NEW_SED_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        newlyCreatedSed: { id: 'something' } as Sed,
        newlyCreatedSedTime: Date.now()
      }, {
        type: types.BUC_NEWSED_RESET
      })
    ).toEqual(initialBucState)
  })

  it('BUC_NEWLYCREATEDBUC_RESET', () => {
    expect(
      bucReducer({
        ...initialBucState,
        newlyCreatedBuc: mockBucs()[0] as Buc
      }, {
        type: types.BUC_NEWLYCREATEDBUC_RESET
      })
    ).toEqual(initialBucState)
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
    ).toEqual({
      ...initialBucState,
      bucsInfo: {
        bucs: {}
      }
    })
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
    ).toEqual({
      ...initialBucState,
      bucsInfo: {
        bucs: {}
      }
    })
  })

  it('BUC_SAVINGATTACHMENTJOB_SET', () => {
    const mockSavingAttachmentJob = {
      total: mockJoarkItems,
      remaining: mockJoarkItems,
      saved: [],
      saving: undefined
    }
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_SAVINGATTACHMENTJOB_SET,
        payload: mockJoarkItems
      })
    ).toEqual({
      ...initialBucState,
      savingAttachmentsJob: mockSavingAttachmentJob
    })
  })

  it('BUC_SAVINGATTACHMENTJOB_RESET', () => {
    const mockSavingAttachmentJob = {
      total: mockJoarkItems,
      remaining: mockJoarkItems,
      saved: [],
      saving: undefined
    }
    expect(
      bucReducer({
        ...initialBucState,
        savingAttachmentsJob: mockSavingAttachmentJob
      }, {
        type: types.BUC_SAVINGATTACHMENTJOB_RESET,
        payload: mockJoarkItems
      })
    ).toEqual(initialBucState)
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
        savingAttachmentsJob: {
          total: [],
          remaining: [],
          saved: [],
          saving: undefined
        }
      }, {
        type: types.BUC_SED_ATTACHMENTS_RESET
      })
    ).toEqual({
      ...initialBucState,
      savingAttachmentsJob: undefined
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

  it('BUC_SEND_ATTACHMENT_REQUEST', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_SEND_ATTACHMENT_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      attachmentsError: false,
      savingAttachmentsJob: {
        saving: {
          foo: 'bar'
        }
      }
    })
  })

  it('BUC_SEND_ATTACHMENT_SUCCESS', () => {
    jest
      // @ts-ignore
      .spyOn(global.Date, 'now')
      .mockImplementation(() => new Date('2020-01-01T00:00:00.000Z').getTime())

    const key: string = mockBuc.caseId!

    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          // @ts-ignore
          [key]: {
            ...mockBuc,
            seds: [{
              id: '1',
              attachments: []
            }]
          } as Buc
        },
        savingAttachmentsJob: {
          total: mockJoarkItems,
          remaining: mockJoarkItems,
          saving: mockJoarkItems[0],
          saved: []
        }
      }, {
        type: types.BUC_SEND_ATTACHMENT_SUCCESS,
        context: {
          joarkBrowserItem: mockJoarkItems[0],
          params: {
            rinaId: mockBuc.caseId,
            rinaDokumentId: '1'
          }
        }
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        [key]: {
          ...mockBuc,
          seds: [{
            id: '1',
            attachments: [{
              documentId: '8ec00b4affe418be4a6b937a7ce70f2b',
              id: '105ddbacc1259bd9d2baf1a0462df5a1',
              name: '4_mockVariant.pdf',
              fileName: '4_mockVariant.pdf',
              mimeType: 'application/pdf',
              lastUpdate: {
                dayOfMonth: 1,
                monthValue: 2,
                year: 1970
              },
              medical: false
            }]
          }]
        }
      },
      savingAttachmentsJob: {
        total: mockJoarkItems,
        remaining: [],
        saving: undefined,
        saved: mockJoarkItems
      }
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
