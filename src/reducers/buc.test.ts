import * as types from 'src/constants/actionTypes'
import { Buc, BucsInfo, Participant, Sed } from 'src/declarations/buc'
import mockBucs from 'src/mocks/buc/bucs'
import mockJoarkItems from 'src/mocks/joark/items'
import bucReducer, { initialBucState } from './buc'

const mockBuc: Buc = mockBucs()[0] as Buc

describe('reducers/buc', () => {
  it('APP_DATA_CLEAR', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.APP_DATA_CLEAR
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
        followUpSeds: [{
          id: '1'
        }] as Array<Sed>,
        sed: {
          id: '1'
        } as Sed,
        savingAttachmentsJob: {
          total: [],
          remaining: [],
          saved: [],
          saving: undefined
        },
        p5000sFromRinaMap: {}
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
      cdm: "4.2",
      caseId: '1',
      creator: {
        country: 'NO',
        institution: 'foo',
        name: '',
        acronym: 'foo'
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
      cdm: "4.2",
      aktoerId: '1',
      caseId: '1',
      creator: {
        country: 'NO',
        institution: 'foo',
        name: '',
        acronym: 'foo'
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

  it('BUC_FOLLOWUPSEDS_SET', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_FOLLOWUPSEDS_SET,
        payload: {
          sed: 'mockSed',
          followUpSeds: [{ id: 'mockReplySed' }]
        }
      })
    ).toEqual({
      ...initialBucState,
      currentSed: 'mockSed',
      followUpSeds: [{ id: 'mockReplySed' }]
    })
  })

  it('BUC_GET_BUCSLIST_SUCCESS with bad payload', () => {
    expect(
      bucReducer(initialBucState, {
        type: types.BUC_GET_BUCSLIST_SUCCESS,
        payload: null
      })
    ).toEqual({
      ...initialBucState,
      bucsList: [],
      howManyBucLists: -1
    })
  })

  it('BUC_GET_BUCSLIST_SUCCESS', () => {
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
        type: types.BUC_GET_BUCSLIST_SUCCESS,
        payload: [mockBuc]
      })
    ).toEqual({
      ...initialBucState,
      bucs: {},
      institutionNames: {},
      howManyBucLists: -1,
      bucsList: [mockBuc]
    })
  })

  it('BUC_GET_BUCSLIST_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucs: {
          123: mockBuc
        }
      }, {
        type: types.BUC_GET_BUCSLIST_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucs: {
        123: mockBuc
      },
      howManyBucLists: -1,
      bucsList: null,
    })
  })

  it('BUC_GET_BUC_OPTIONS_REQUEST', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucOptions: ['mockBucOption']
      }, {
        type: types.BUC_GET_BUC_OPTIONS_REQUEST
      })
    ).toEqual({
      ...initialBucState,
      bucOptions: []
    })
  })

  it('BUC_GET_BUC_OPTIONS_FAILURE', () => {
    expect(
      bucReducer({
        ...initialBucState,
        bucOptions: ['mockBucOption']
      }, {
        type: types.BUC_GET_BUC_OPTIONS_FAILURE
      })
    ).toEqual({
      ...initialBucState,
      bucOptions: []
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
    ).toEqual({
      ...initialBucState,
      countryList: null
    })
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
              lastUpdate: 2674800000,
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
