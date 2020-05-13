import _ from 'lodash'

const mockBuc = [
  {
    type: 'P_BUC_01',
    caseId: '000001',
    creator: {
      country: 'NO',
      institution: 'NO:NAVAT07',
      name: 'NAV ACCEPTANCE TEST 07'
    },
    sakType: null,
    status: 'open',
    startDate: 1571818162145,
    lastUpdate: 1571818216000,
    institusjon: [{
      country: 'NO',
      institution: 'NO:NAVAT07',
      name: 'NAV ACCEPTANCE TEST 07'
    }, {
      country: 'SE',
      institution: 'SE:DEMO001',
      name: 'Sweden Demo 01'
    }, {
      country: 'FI',
      institution: 'FI:DEMO001',
      name: 'Finland Demo 01'
    }, {
      country: 'DK',
      institution: 'DK:DEMO001',
      name: 'Danmark Demo 01'
    }, {
      country: 'IS',
      institution: 'IS:DEMO001',
      name: 'Island Demo 01'
    }],
    seds: [
      {
        id: '00002',
        parentDocumentId: '00001',
        type: 'P2000',
        status: 'sent',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
          lastUpdate: {
            year: 2019,
            month: 'MAY',
            chronology: {
              id: 'ISO',
              calendarType: 'iso8601'
            },
            dayOfMonth: 20,
            dayOfWeek: 'MONDAY',
            era: 'CE',
            dayOfYear: 140,
            leapYear: false,
            monthValue: 5
          },
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
        }
      },
      {
        id: '00003',
        parentDocumentId: '00001',
        type: 'P2000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00004',
        parentDocumentId: '00001',
        type: 'P2000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00005',
        parentDocumentId: '00001',
        type: 'P2000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00006',
        parentDocumentId: '00001',
        type: 'P2000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },

      {
        id: '00007',
        parentDocumentId: '00001',
        type: 'P3000',
        status: 'sent',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
          lastUpdate: {
            year: 2019,
            month: 'MAY',
            chronology: {
              id: 'ISO',
              calendarType: 'iso8601'
            },
            dayOfMonth: 20,
            dayOfWeek: 'MONDAY',
            era: 'CE',
            dayOfYear: 140,
            leapYear: false,
            monthValue: 5
          },
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
        }
      },
      {
        id: '00008',
        parentDocumentId: '00001',
        type: 'P3000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00009',
        parentDocumentId: '00001',
        type: 'P3000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00010',
        parentDocumentId: '00001',
        type: 'P3000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00011',
        parentDocumentId: '00001',
        type: 'P3000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },

      {
        id: '00012',
        parentDocumentId: '00001',
        type: 'P4000',
        status: 'sent',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
          lastUpdate: {
            year: 2019,
            month: 'MAY',
            chronology: {
              id: 'ISO',
              calendarType: 'iso8601'
            },
            dayOfMonth: 20,
            dayOfWeek: 'MONDAY',
            era: 'CE',
            dayOfYear: 140,
            leapYear: false,
            monthValue: 5
          },
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
        }
      },
      {
        id: '00013',
        parentDocumentId: '00001',
        type: 'P4000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00014',
        parentDocumentId: '00001',
        type: 'P4000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00015',
        parentDocumentId: '00001',
        type: 'P4000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00016',
        parentDocumentId: '00001',
        type: 'P4000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },

      {
        id: '00017',
        parentDocumentId: '00001',
        type: 'P5000',
        status: 'sent',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      },
      {
        id: '00016',
        parentDocumentId: '00001',
        type: 'P4000',
        status: 'received',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        displayName: 'Demo SED',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'NO',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'NAV ACCT 07',
              countryCode: 'NO',
              contactMethods: null,
              name: 'NAV ACCEPTANCE TEST 07',
              location: null,
              assignedBUCs: null,
              id: 'NO:NAVAT07',
              accessPoint: null
            },
            selected: true
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'SE',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'SE',
              contactMethods: null,
              name: 'Sweden Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'SE:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'FI',
              contactMethods: null,
              name: 'Finland Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'FI:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Receiver',
            organisation: {
              address: {
                country: 'FI',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'DK',
              contactMethods: null,
              name: 'Denmark Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'DK:DEMO001',
              accessPoint: null
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              address: {
                country: 'IS',
                town: null,
                street: null,
                postalCode: null,
                region: null
              },
              activeSince: '2018-08-26T22:00:00.000+0000',
              registryNumber: null,
              acronym: 'DEMO001',
              countryCode: 'IS',
              contactMethods: null,
              name: 'Island Demo 01',
              location: null,
              assignedBUCs: null,
              id: 'IS:DEMO001',
              accessPoint: null
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
        }
      }
    ]
  }
]

const bucs = () => _.cloneDeep(mockBuc)

export default bucs
