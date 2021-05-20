import _ from 'lodash'

const mockBuc = [
  {
    type: 'P_BUC_01',
    readOnly: false,
    caseId: '600891',
    creator: {
      country: 'NO',
      institution: 'NO:NAVAT07',
      name: 'NAV ACCEPTANCE TEST 07',
      acronym: 'NAVAT07'
    },
    sakType: null,
    status: 'open',
    startDate: 1571818162145,
    lastUpdate: 1571818216000,
    institusjon: [{
      country: 'NO',
      acronym: 'NAVAT07',
      institution: 'NO:NAVAT07',
      name: 'NAV ACCEPTANCE TEST 07'
    }, {
      country: 'GB',
      acronym: 'DEMOGB01',
      institution: 'GB:DEMOGB01',
      name: 'GB Demo 01'
    }, {
      country: 'UK',
      acronym: 'DEMOUK01',
      institution: 'UK:DEMOUK01',
      name: 'UK Demo 01'
    }, {
      country: 'FR',
      acronym: 'DEMOFR01',
      institution: 'FR:DEMOFR01',
      name: 'France Demo 01'
    }],
    seds: [
      {
        id: '98492223b35240138503f58ec09454fa',
        parentDocumentId: '5d549c96e0ce40788a2eea2992c1f65f',
        type: 'X008',
        status: 'empty',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Invalidate Sed',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [{
          id: '58828e7ff57943779ab7b24c522b1a3f',
          name: 'balrog.png',
          fileName: 'balrog.png',
          mimeType: 'image/png',
          documentId: 'cac9db2726d54f2c9b51d1562b7b0a79',
          lastUpdate: 1571818175000,
          medical: false
        }],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818175000
        },
        lastVersion: {
          id: '1',
          date: 1571818175000
        },
        allowsAttachments: true
      },
      {
        id: '10678159cd4142f890d56264bfdefd13',
        parentDocumentId: null,
        type: 'P6000',
        status: 'active',
        creationDate: 1571818194896,
        lastUpdate: 1571818294896,
        displayName: 'Pension decision',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }, {
            role: 'Receiver',
            organisation: {
              acronym: 'DEMOIT01',
              countryCode: 'IT',
              name: 'Italian institution 001',
              id: 'IT:DEMOIT01'
            },
            selected: false
          }, {
            role: 'Receiver',
            organisation: {
              acronym: 'DEMOES01',
              countryCode: 'ES',
              name: 'Spanish institution 01',
              id: 'ES:DEMOES01'
            },
            selected: false
          }, {
            role: 'Receiver',
            organisation: {
              acronym: 'DEMOFR01',
              countryCode: 'FR',
              name: 'French insstitution 01',
              id: 'FR:DEMOFR01'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '3',
        firstVersion: {
          id: '1',
          date: 1571818194896
        },
        lastVersion: {
          id: '3',
          date: 1571818294896
        },
        allowsAttachments: true
      },
      {
        id: '4bff8e2fdbeb4f8fa5ba76e0d9f66f6d',
        parentDocumentId: null,
        type: 'X007',
        status: 'empty',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Forward Case',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818175000
        },
        lastVersion: {
          id: '1',
          date: 1571818175000
        },
        allowsAttachments: true
      },
      {
        id: 'ef2905700e6f410b9edd04023856d49b',
        parentDocumentId: null,
        type: 'P10000',
        status: 'cancelled',
        creationDate: 1571818201591,
        lastUpdate: 1571818201591,
        displayName: 'Transfer of additional information',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818201591
        },
        lastVersion: {
          id: '1',
          date: 1571818201591
        },
        allowsAttachments: true
      },
      {
        id: '8c582ae21c8744aa8e697c8a5c84d84f',
        parentDocumentId: null,
        type: 'P3000_NO',
        status: 'new',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Country specific information',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818175000
        },
        lastVersion: {
          id: '1',
          date: 1571818175000
        },
        allowsAttachments: true
      },
      {
        id: '7c52d3b4006b489d89ee1af37caef6f6',
        parentDocumentId: null,
        type: 'H120',
        status: 'empty',
        creationDate: 1571818176000,
        lastUpdate: 1571818176000,
        displayName: 'Request for Medical Information',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818176000
        },
        lastVersion: {
          id: '1',
          date: 1571818176000
        },
        allowsAttachments: true
      },
      {
        id: 'dc4670bbd59d4c8ab3b41974a72bf11d',
        parentDocumentId: null,
        type: 'P4000',
        status: 'new',
        creationDate: 1571818181793,
        lastUpdate: 1571818181793,
        displayName: 'Report on insurance history',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [{
          id: '58828e7ff57943779ab7b24c522b1a3f',
          name: 'balrog.png',
          fileName: 'balrog.png',
          mimeType: 'image/png',
          documentId: 'cac9db2726d54f2c9b51d1562b7b0a79',
          lastUpdate: 1571818175000,
          medical: false
        }, {
          id: '58828e7ff57943779ab7b24c522b1a3d',
          name: '491399765_ARKIV.pdf',
          fileName: '491399765_ARKIV.pdf',
          mimeType: 'application/pdf',
          documentId: 'cac9db2726d54f2c9b51d1562b7b0a7a',
          lastUpdate: 1571818175000,
          medical: false
        }],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818181793
        },
        lastVersion: {
          id: '1',
          date: 1571818181793
        },
        allowsAttachments: true
      },
      {
        id: '34b286dc45ff4f6fa8c91a8aa698345d',
        parentDocumentId: null,
        type: 'H020',
        status: 'empty',
        creationDate: 1571818176000,
        lastUpdate: 1571818176000,
        displayName: 'Claim for - Reimbursement - Administrative Check /Medical information',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818176000
        },
        lastVersion: {
          id: '1',
          date: 1571818176000
        },
        allowsAttachments: true
      },
      {
        id: '6b626b56303e4bca9fd8e40d758a4044',
        parentDocumentId: null,
        type: 'H070',
        status: 'empty',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Notification of death',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818175000
        },
        lastVersion: {
          id: '1',
          date: 1571818175000
        },
        allowsAttachments: true
      },
      {
        id: '619f742acee74769bcd449b13eb9cf54',
        parentDocumentId: null,
        type: 'P7000',
        status: 'sent',
        creationDate: 1571818216066,
        lastUpdate: 1571818216066,
        displayName: 'Notification of Summary note',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818216066
        },
        lastVersion: {
          id: '1',
          date: 1571818216066
        },
        allowsAttachments: true
      },
      {
        id: '5d549c96e0ce40788a2eea2992c1f65f',
        parentDocumentId: null,
        type: 'P2000',
        status: 'sent',
        creationDate: 1571818170586,
        lastUpdate: 1571818170586,
        displayName: 'Old age pension claim',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818170586
        },
        lastVersion: {
          id: '1',
          date: 1571818170586
        },
        allowsAttachments: true
      },
      {
        id: 'd1f436ac1402462e827ad70b616d9594',
        parentDocumentId: null,
        type: 'X005',
        status: 'empty',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Add New Participant',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818175000
        },
        lastVersion: {
          id: '1',
          date: 1571818175000
        },
        allowsAttachments: true
      },
      {
        id: '60578cf8bf9f45a7819a39987c6c8fd4',
        parentDocumentId: null,
        type: 'P5000',
        status: 'received',
        creationDate: 1571818188033,
        lastUpdate: 1571818188033,
        displayName: 'Insurance/residence periods',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818188033
        },
        lastVersion: {
          id: '1',
          date: 1571818188033
        },
        allowsAttachments: false
      },
      {
        id: '50578cf8bf9f45a7819a39987c6c8fd4',
        parentDocumentId: null,
        type: 'P5000',
        status: 'received',
        creationDate: 1571234189234,
        lastUpdate: 1571547188033,
        displayName: 'Insurance/residence periods',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571547188033
        },
        lastVersion: {
          id: '1',
          date: 1571547188033
        },
        allowsAttachments: false
      },
      {
        id: '40578cf8bf9f45a7819a39987c6c8fd4',
        parentDocumentId: null,
        type: 'P5000',
        status: 'received',
        creationDate: 1571234189234,
        lastUpdate: 1571547188033,
        displayName: 'Insurance/residence periods',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571547188033
        },
        lastVersion: {
          id: '1',
          date: 1571547188033
        },
        allowsAttachments: false
      },
      {
        id: '51d9d9277ab847008bc88c1b31b34865',
        parentDocumentId: null,
        type: 'P8000',
        status: 'received',
        creationDate: 1571818208620,
        lastUpdate: 1571818208620,
        displayName: 'Request for additional information',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818208620
        },
        lastVersion: {
          id: '1',
          date: 1571818208620
        },
        allowsAttachments: true
      },
      {
        id: '00d9d9277ab847008bc88c1b31b34865',
        parentDocumentId: '51d9d9277ab847008bc88c1b31b34865',
        type: 'P9000',
        status: 'empty',
        creationDate: 1571818208620,
        lastUpdate: 1571818208620,
        displayName: 'P9000',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818208620
        },
        lastVersion: {
          id: '1',
          date: 1571818208620
        },
        allowsAttachments: true
      },
      {
        id: 'fd55d46e6ab741838d3a8e1735d33f1b',
        parentDocumentId: null,
        type: 'X009',
        status: 'empty',
        creationDate: 1571818174000,
        lastUpdate: 1571818174000,
        displayName: 'Reminder',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT08',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 08',
              id: 'NO:NAVAT08'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818174000
        },
        lastVersion: {
          id: '1',
          date: 1571818174000
        },
        allowsAttachments: true
      },
      {
        id: 'fd55d46e6ab741838d3a8e1735d33f1c',
        parentDocumentId: null,
        type: 'X100',
        status: 'received',
        creationDate: 1571818174000,
        lastUpdate: 1571818174000,
        displayName: 'Reminder',
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'DEDEMO01',
              countryCode: 'DE',
              name: 'DE DEMO 01',
              id: 'DE:DEDEMO01'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '1',
        firstVersion: {
          id: '1',
          date: 1571818174000
        },
        lastVersion: {
          id: '1',
          date: 1571818174000
        },
        allowsAttachments: true
      }
    ],
    error: null
  },
  {
    type: 'P_BUC_02',
    readOnly: false,
    creator: {
      country: 'NO',
      institution: 'NO:NAVAT07',
      name: 'NAV ACCEPTANCE TEST 07',
      acronym: 'NAVAT07'
    },
    caseId: '195440',
    sakType: 'Generell',
    aktoerId: '1000070418092',
    status: 'open',
    startDate: 1571731760978,
    lastUpdate: 1571731814000,
    addedParams: {
      subject: {
        gjenlevende: {
          fnr: 'personFnr'
        },
        avdod: {
          fnr: 'personFarFnr'
        }
      }
    },
    institusjon: [
      {
        country: 'NO',
        institution: 'NO:NAVAT07',
        acronym: 'NAVAT07',
        name: 'NAV acceptance Test 07'
      },
      {
        country: 'SE',
        institution: 'SE:DEMOSE01',
        acronym: 'DEMOSE01',
        name: 'Swedish institution 01'
      },
      {
        country: 'FI',
        institution: 'FI:DEMOFI02',
        acronym: 'DEMOFI02',
        name: 'Finnish institution 02'
      },
      {
        country: 'GB',
        institution: 'GB:DEMOGB03',
        acronym: 'DEMOGB02',
        name: 'GB institution 03'
      },
      {
        country: 'PT',
        institution: 'PT:DEMOPT04',
        acronym: 'DEMOPT04',
        name: 'PT institution 04'
      },
      {
        country: 'FR',
        institution: 'FR:DEMO005',
        acronym: 'DEMOFR05',
        name: 'French institution 05'
      }
    ],
    seds: [
      {
        id: '90149c52a98044b599c3bf5d48537782',
        type: 'P2000',
        status: 'received',
        creationDate: 1559117379454,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'DEMONO02',
              countryCode: 'NO',
              name: 'Norwegian institution 02',
              id: 'NO:DEMONO02'
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'DEMONO01',
              countryCode: 'NO',
              name: 'Norwegian institution 01',
              id: 'NO:DEMONO01'
            },
            selected: false
          }
        ],
        attachments: [{
          id: '58828e7ff57943779ab7b24c522b1a3f',
          name: 'balrog.png',
          fileName: 'balrog.png',
          mimeType: 'image/png',
          documentId: 'cac9db2726d54f2c9b51d1562b7b0a79',
          lastUpdate: 1571818175000,
          medical: false
        }],
        version: '5',
        firstVersion: {
          id: '1',
          date: 1559117379454
        },
        lastVersion: {
          id: 'r',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: 'ff98ea9256244b908e19d4439db5bad3',
        parentDocumentId: '90149c52a98044b599c3bf5d48537782',
        type: 'P6000',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: 'DEMONO02',
              countryCode: 'NO',
              name: 'Norwegin institution 02',
              id: 'NO:DEMONO02'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: 'DEMONO01',
              countryCode: 'NO',
              name: 'Norwegian institution 01',
              id: 'NO:DEMONO01'
            },
            selected: false
          }
        ],
        attachments: [{
          id: '58828e7ff57943779ab7b24c522b1a3e',
          name: 'balrog.png',
          fileName: 'balrog.png',
          mimeType: 'image/png',
          documentId: 'cac9db2726d54f2c9b51d1562b7b0a79',
          lastUpdate: 1571818175000,
          medical: false
        }],
        version: '4',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '4',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '549bab7141c54cfcb14902e7e3b107b4',
        type: 'P3000_NO',
        status: 'empty',
        creationDate: 1559117443000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '4',
        firstVersion: {
          id: '1',
          date: 1559117443000
        },
        lastVersion: {
          id: '4',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '1911923c542746ada10f7c922b46a271',
        type: 'P5000',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '3',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '3',
          date: 1559080800000
        },
        allowsAttachments: false
      },
      {
        id: '9ebb27b848c644ba8a8ba95772403618',
        type: 'X009',
        status: 'empty',
        creationDate: 1559117443000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '4',
        firstVersion: {
          id: '1',
          date: 1559117443000
        },
        lastVersion: {
          id: '4',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '4ae14845e31d4d0db52acb692d9abe8e',
        type: 'P8000',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '5ef5fdea78e94911a873322d98589664',
        type: 'P7000',
        status: 'empty',
        creationDate: 1559117443000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117443000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '2cfa8cc7af2647c4ad89315a6d1b0ad7',
        type: 'P4000',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117443000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: 'af7f8476e55f4c53b501c41fd03a25be',
        type: 'X007',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117443000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '4c10c2288a23442f85b511ecfaecb0f7',
        type: 'X005',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '147065531dca429a90d47b5aa3b7cf2c',
        type: 'P10000',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '07cce7d3b2514676ba342caab580c573',
        type: 'H020',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '7e2b28e4bc3b47e992fc06e5024bec3a',
        type: 'H120',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: '7c60826b53cc431f9059d8b30e4a1f7d',
        type: 'X008',
        status: 'empty',
        creationDate: 1559117443000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117443000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      },
      {
        id: 'c1069862321c419e8e3ca418f7372d64',
        type: 'H070',
        status: 'empty',
        creationDate: 1559117444000,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'NO',
              name: 'DEMO002',
              id: 'NO:DEMO002'
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'DEMO001',
              id: 'NO:DEMO001'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '2',
        firstVersion: {
          id: '1',
          date: 1559117444000
        },
        lastVersion: {
          id: '2',
          date: 1559080800000
        },
        allowsAttachments: true
      }
    ]
  },
  {
    type: 'P_BUC_02',
    readOnly: false,
    creator: {
      country: 'SE',
      institution: 'SE:DEMOSE01',
      name: 'Swedish Demo Institution 001',
      acronym: 'DEMOSE01'
    },
    caseId: '195441',
    sakType: 'Generell',
    aktoerId: '1000070418092',
    status: 'open',
    startDate: 1571731760978,
    lastUpdate: 1571731814000,
    addedParams: {
      subject: {
        gjenlevende: {
          fnr: 'personFnr'
        },
        avdod: {
          fnr: 'personMorFnr'
        }
      }
    },
    institusjon: [
      {
        country: 'IE',
        institution: 'IE:DEMOIE01',
        name: 'Irish Institution 001',
        acronym: 'DEMOIE01'
      },
      {
        country: 'US',
        institution: 'US:DEMOUS01',
        name: 'North American Institution 001',
        acronym: 'DEMOUS01'
      },
      {
        country: 'IT',
        institution: 'IT:DEMOIT01',
        name: 'Italian Institution 001',
        acronym: 'DEMOIT01'
      },
      {
        country: 'DE',
        institution: 'DE:DEMODE01',
        name: 'German Institution 001',
        acronym: 'DEMODE01'
      },
      {
        country: 'SE',
        institution: 'SE:DEMOSE01',
        name: 'Swedish Institution 001',
        acronym: 'DEMOSE01'
      },
      {
        country: 'ZA',
        institution: 'ZA:DEMOZA01',
        name: 'South African Institution 001',
        acronym: 'DEMOZA01'
      }
    ],
    seds: [
      {
        id: '90149c52a98044b599c3bf5d48537783',
        type: 'P2100',
        status: 'received',
        creationDate: 1559117379454,
        lastUpdate: 1559080800000,
        participants: [
          {
            role: 'Sender',
            organisation: {
              acronym: '12348',
              countryCode: 'SE',
              name: 'Swedish institution demo 01',
              id: 'SE:DEMO001'
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              acronym: '12347',
              countryCode: 'NO',
              name: 'NAV07',
              id: 'NO:NAV07'
            },
            selected: false
          }
        ],
        attachments: [],
        version: '5',
        firstVersion: {
          id: '1',
          date: 1559117379454
        },
        lastVersion: {
          id: 'r',
          date: 1559080800000
        },
        allowsAttachments: true
      }
    ]
  },
  {
    type: 'P_BUC_03',
    readOnly: true,
    creator: {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    },
    caseId: '158123',
    sakType: 'Generell',
    aktoerId: '001122334455',
    status: 'open',
    startDate: 1557392989122,
    lastUpdate: 1558362934000,
    institusjon: [{
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    }, {
      country: 'NO',
      institution: 'NO:DEMONO01',
      name: 'Norwegian institution 01',
      acronym: 'DEMONO01'
    }],
    seds: [{
      id: 'f2123ebf16dc4ddaaaf2420d0adb39c7',
      parentDocumentId: null,
      type: 'H020',
      status: 'empty',
      creationDate: 1557393035000,
      lastUpdate: 1557393035000,
      displayName: 'Claim for - Reimbursement - Administrative Check /Medical information',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393035000
      },
      lastVersion: {
        id: '1',
        date: 1557393035000
      },
      allowsAttachments: true
    }, {
      id: '0bb1ad15987741f1bbf45eba4f955e80',
      parentDocumentId: null,
      type: 'P10000',
      status: 'empty',
      creationDate: 1557393035000,
      lastUpdate: 1557393035000,
      displayName: 'Transfer of additional information',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393035000
      },
      lastVersion: {
        id: '1',
        date: 1557393035000
      },
      allowsAttachments: true
    }, {
      id: '06f698fa890b4046b736e2efe3b25074',
      parentDocumentId: null,
      type: 'P4000',
      status: 'sent',
      creationDate: 1557393062757,
      lastUpdate: 1557393062757,
      displayName: 'Report on insurance history',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393062757
      },
      lastVersion: {
        id: '1',
        date: 1557393062757
      },
      allowsAttachments: true
    }, {
      id: '3b82e3d56f304ca0ac05c1ce626d9472',
      parentDocumentId: null,
      type: 'P6000',
      status: 'empty',
      creationDate: 1557393101000,
      lastUpdate: 1557393101000,
      displayName: 'Pension decision',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393101000
      },
      lastVersion: {
        id: '1',
        date: 1557393101000
      },
      allowsAttachments: true
    }, {
      id: '52c08e4129da4120b9b982142c272a61',
      parentDocumentId: null,
      type: 'P5000',
      status: 'new',
      creationDate: 1557393081308,
      lastUpdate: 1558360875571,
      displayName: 'Insurance/residence periods',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '2',
      firstVersion: {
        id: '1',
        date: 1557393081308
      },
      lastVersion: {
        id: '2',
        date: 1558360875571
      },
      allowsAttachments: false
    }, {
      id: 'cac9db2726d54f2c9b51d1562b7b0a79',
      parentDocumentId: null,
      type: 'P8000',
      status: 'new',
      creationDate: 1557825747269,
      lastUpdate: 1558362934400,
      displayName: 'Request for additional information',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [{
        id: '58828e7ff57943779ab7b24c522b1a3f',
        name: 'balrog.png',
        fileName: 'balrog.png',
        mimeType: 'image/png',
        documentId: 'cac9db2726d54f2c9b51d1562b7b0a79',
        lastUpdate: 1558361547000,
        medical: false
      }, {
        id: '1e5b8c0cf3c94b2f9a4192abb4818cc1',
        name: 'balrog.png',
        fileName: 'balrog.png',
        mimeType: 'image/png',
        documentId: 'cac9db2726d54f2c9b51d1562b7b0a79',
        lastUpdate: 1558361557000,
        medical: false
      }],
      version: '2',
      firstVersion: {
        id: '1',
        date: 1557825747269
      },
      lastVersion: {
        id: '2',
        date: 1558362934400
      },
      allowsAttachments: true
    }, {
      id: '3fe845d1142742a5a7a28f339e5d5b30',
      parentDocumentId: null,
      type: 'P2000',
      status: 'sent',
      creationDate: 1557392992767,
      lastUpdate: 1557392992767,
      displayName: 'Old age pension claim',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: true
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557392992767
      },
      lastVersion: {
        id: '1',
        date: 1557392992767
      },
      allowsAttachments: true
    }, {
      id: '268b8ed450bf4e8a99e6c0057d5ed857',
      parentDocumentId: null,
      type: 'P3000_NO',
      status: 'empty',
      creationDate: 1557393034000,
      lastUpdate: 1557393034000,
      displayName: 'Country specific information',
      participants: [{
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }, {
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393034000
      },
      lastVersion: {
        id: '1',
        date: 1557393034000
      },
      allowsAttachments: true
    }, {
      id: 'a8160dcb66c840a88ef331eed4b193be',
      parentDocumentId: '3fe845d1142742a5a7a28f339e5d5b30',
      type: 'X008',
      status: 'empty',
      creationDate: 1557393034000,
      lastUpdate: 1557393034000,
      displayName: 'Invalidate Sed',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: true
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393034000
      },
      lastVersion: {
        id: '1',
        date: 1557393034000
      },
      allowsAttachments: true
    }, {
      id: '5d4e5b878a60433a919c833c146401cb',
      parentDocumentId: null,
      type: 'P7000',
      status: 'empty',
      creationDate: 1557393034000,
      lastUpdate: 1557393034000,
      displayName: 'Notification of Summary note',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393034000
      },
      lastVersion: {
        id: '1',
        date: 1557393034000
      },
      allowsAttachments: true
    }, {
      id: '836de1a761514b1eab50c88e507e9a1c',
      parentDocumentId: null,
      type: 'H070',
      status: 'empty',
      creationDate: 1557393035000,
      lastUpdate: 1557393035000,
      displayName: 'Notification of death',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393035000
      },
      lastVersion: {
        id: '1',
        date: 1557393035000
      },
      allowsAttachments: true
    }, {
      id: '2d305e9ac51f43cf9a4012679ea3036e',
      parentDocumentId: null,
      type: 'X005',
      status: 'empty',
      creationDate: 1557393034000,
      lastUpdate: 1557393034000,
      displayName: 'Add New Participant',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393034000
      },
      lastVersion: {
        id: '1',
        date: 1557393034000
      },
      allowsAttachments: true
    }, {
      id: 'ef5811b43d564539997c9e1e8539a0a5',
      parentDocumentId: '891a8c61651049d6b2e0c0bd32215203',
      type: 'X008',
      status: 'empty',
      creationDate: 1557393101000,
      lastUpdate: 1557393101000,
      displayName: 'Invalidate Sed',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393031000
      },
      lastVersion: {
        id: '1',
        date: 1557393031000
      },
      allowsAttachments: true
    }, {
      id: '74cfcccbdb764b768365090152c84892',
      parentDocumentId: '06f698fa890b4046b736e2efe3b25074',
      type: 'X008',
      status: 'empty',
      creationDate: 1557393078000,
      lastUpdate: 1557393078000,
      displayName: 'Invalidate Sed',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393078000
      },
      lastVersion: {
        id: '1',
        date: 1557393078000
      },
      allowsAttachments: true
    }, {
      id: '3e29fb69d44f440a81e01aa2199d4b2f',
      parentDocumentId: null,
      type: 'H120',
      status: 'empty',
      creationDate: 1557393035000,
      lastUpdate: 1557393035000,
      displayName: 'Request for Medical Information',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393035000
      },
      lastVersion: {
        id: '1',
        date: 1557393035000
      },
      allowsAttachments: true
    }, {
      id: '4ef97838c25c46fba04dcd57a511338d',
      parentDocumentId: null,
      type: 'X009',
      status: 'empty',
      creationDate: 1557393033000,
      lastUpdate: 1557393033000,
      displayName: 'Reminder',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393033000
      },
      lastVersion: {
        id: '1',
        date: 1557393033000
      },
      allowsAttachments: true
    }, {
      id: '6808b56f66b64a24ae94ddad3aeb9290',
      parentDocumentId: null,
      type: 'X007',
      status: 'empty',
      creationDate: 1557393034000,
      lastUpdate: 1557393034000,
      displayName: 'Forward Case',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393034000
      },
      lastVersion: {
        id: '1',
        date: 1557393034000
      },
      allowsAttachments: true
    }, {
      id: '891a8c61651049d6b2e0c0bd32215203',
      parentDocumentId: null,
      type: 'P6000',
      status: 'sent',
      creationDate: 1557393087051,
      lastUpdate: 1557393087051,
      displayName: 'Pension decision',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: '12348',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: '12347',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393087051
      },
      lastVersion: {
        id: '1',
        date: 1557393087051
      },
      allowsAttachments: true
    }]
  },
  {
    type: 'P_BUC_05',
    readOnly: false,
    creator: {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    },
    caseId: '158125',
    sakType: 'Generell',
    aktoerId: '001122334455',
    status: 'open',
    startDate: 1557392989122,
    lastUpdate: 1558362934000,
    institusjon: [{
      country: 'NO',
      institution: 'NO:DEMONO01',
      name: 'Norwegian institution 01',
      acronym: 'DEMONO01'
    }, {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    }],
    seds: []
  },
  {
    type: 'P_BUC_06',
    readOnly: false,
    creator: {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    },
    caseId: '158124',
    sakType: 'Generell',
    aktoerId: '001122334455',
    status: 'open',
    startDate: 1557392989122,
    lastUpdate: 1558362934000,
    institusjon: [{
      country: 'NO',
      institution: 'NO:DEMONO01',
      name: 'Norwegian institution 01',
      acronym: 'DEMONO01'
    }, {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    }],
    seds: [{
      id: 'f2123ebf16dc4ddaaaf2420d0adb39c8',
      parentDocumentId: null,
      type: 'P10000',
      status: 'sent',
      creationDate: 1557393035000,
      lastUpdate: 1557393035000,
      displayName: 'Claim for - Reimbursement - Administrative Check /Medical information',
      participants: [{
        role: 'Sender',
        organisation: {
          acronym: 'DEMO002',
          countryCode: 'NO',
          name: 'DEMO002',
          id: 'NO:DEMO002'
        },
        selected: false
      }, {
        role: 'Receiver',
        organisation: {
          acronym: 'DEMO001',
          countryCode: 'NO',
          name: 'DEMO001',
          id: 'NO:DEMO001'
        },
        selected: false
      }],
      attachments: [],
      version: '1',
      firstVersion: {
        id: '1',
        date: 1557393035000
      },
      lastVersion: {
        id: '1',
        date: 1557393035000
      },
      allowsAttachments: true
    }]
  },
  {
    type: 'X_BUC_XX',
    readOnly: false,
    caseId: '362453',
    description: 'This BUC should not be shown as it is not in the list of allowed bucs',
    creator: {
      country: 'NO',
      institution: 'NO:NAVAT07',
      name: 'NAV ACCEPTANCE TEST 07',
      acronym: 'NAVAT07'
    },
    sakType: null,
    status: 'open',
    startDate: 1571818162145,
    lastUpdate: 1571818216000,
    institusjon: [],
    seds: []
  },
  {
    type: '',
    readOnly: true,
    caseId: '',
    creator: null,
    sakType: null,
    status: null,
    startDate: null,
    lastUpdate: null,
    institusjon: null,
    seds: null,
    error: 'Rina serverfeil, kan også skyldes ugyldig input, {"status":"INTERNAL_SERVER_ERROR","timestamp":"23-10-2019 15:48:30","messages":["500 null","{\\"stack\\":\\"\\",\\"error_description\\":\\"The user with userName:[Z990638] is not authorised\\",\\"error\\":\\"Cannot get case\\"}"]}'
  }
]

const bucs = () => _.cloneDeep(mockBuc)

export default bucs
