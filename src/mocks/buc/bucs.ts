import { Direction, SakTypeValue } from 'src/declarations/buc'
import _ from 'lodash'

const later = new Date(1970, 0, 1).getTime()

const mockBuc = [
  {
    "type": "P_BUC_03",
    "caseId": "1451925",
    "internationalId": "49898ddf0128475f8b8561f4d0f1c450",
    "creator": {
      "country": "NO",
      "institution": "NO:NAVAT07",
      "name": "NAV ACC 07",
      "acronym": "NAVAT07"
    },
    "sakType": null,
    "status": "open",
    "startDate": 1571818170586,
    "lastUpdate": 1571818170586,
    "institusjon": [
      {
        "country": "DK",
        "institution": "NO:NAVAT07",
        "name": "NAV ACC 07",
        "acronym": "NAVAT07"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT01",
        "name": "NAV ACC 01",
        "acronym": "NAVAT01"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT02",
        "name": "NAV ACC 02",
        "acronym": "NAVAT02"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT03",
        "name": "NAV ACC 03",
        "acronym": "NAVAT03"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT04",
        "name": "NAV ACC 04",
        "acronym": "NAVAT04"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT05",
        "name": "NAV ACC 05",
        "acronym": "NAVAT05"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT06",
        "name": "NAV ACC 06",
        "acronym": "NAVAT06"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT08",
        "name": "NAV ACC 08",
        "acronym": "NAVAT08"
      }
    ],
    "seds": [
      {
        id: 'cac9db2726d54f2c9b51d1562b7b0a79',
        parentDocumentId: null,
        type: 'P8000',
        status: 'new',
        direction: 'IN' as Direction,
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
      },
      {
        "attachments": [],
        "displayName": "Invalidity pension claim",
        "type": "P2200",
        "conversations": null,
        "isSendExecuted": null,
        "id": "0b988b1c20b34ecfb6b91d9aa304aaaf",
        "direction": "OUT"  as Direction,
        "creationDate": 1743683683205,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751963626,
        "parentDocumentId": null,
        "status": "sent",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07",
              "identifier": null,
              "contactTypeIdentifier": null,
              "authority": null,
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Invalidate Sed",
        "type": "X008",
        "conversations": null,
        "isSendExecuted": null,
        "id": "45e14691cd0e43af96e19523ff9238d9",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963599,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": false,
        "versions": null,
        "lastUpdate": 1743751963611,
        "parentDocumentId": "0b988b1c20b34ecfb6b91d9aa304aaaf",
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Country specific information",
        "type": "P3000_NO",
        "conversations": null,
        "isSendExecuted": null,
        "id": "697467568f83432ab5b24972ff8a1d06",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963694,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751963700,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          },
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Report on insurance history",
        "type": "P4000",
        "conversations": null,
        "isSendExecuted": null,
        "id": "fb7ab268b3ee4710bbc164efbda8a18f",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963730,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751963736,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Insurance/residence periods",
        "type": "P5000",
        "conversations": null,
        "isSendExecuted": null,
        "id": "6b69d83e6d024f61a96386184bef3fd2",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963759,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": false,
        "versions": null,
        "lastUpdate": 1743751963765,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Pension decision",
        "type": "P6000",
        "conversations": null,
        "isSendExecuted": null,
        "id": "adc41c9f713b40038d77f4de3bba296d",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963787,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751963792,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Notification of Summary note",
        "type": "P7000",
        "conversations": null,
        "isSendExecuted": null,
        "id": "37542eae19ff4079bf457c1584393702",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963815,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": false,
        "versions": null,
        "lastUpdate": 1743751963822,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Request for additional information",
        "type": "P8000",
        "conversations": null,
        "isSendExecuted": null,
        "id": "31a9a05fc4e842e39c056658dffdb4ff",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963843,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751963848,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Transfer of additional information",
        "type": "P10000",
        "conversations": null,
        "isSendExecuted": null,
        "id": "6d6e16dc2d904419afd57bc16824a3cd",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963874,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751963881,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Reminder",
        "type": "X009",
        "conversations": null,
        "isSendExecuted": null,
        "id": "80af84bfcd924ad2b3a4855fcb14a201",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963899,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": false,
        "versions": null,
        "lastUpdate": 1743751963905,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Add New Participant",
        "type": "X005",
        "conversations": null,
        "isSendExecuted": null,
        "id": "de29d510f85447aa9ef63235bd1004e9",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963924,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": false,
        "versions": null,
        "lastUpdate": 1743751963930,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Remove Participant",
        "type": "X006",
        "conversations": null,
        "isSendExecuted": null,
        "id": "39c50668e2f342d38974644a5738c9af",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963948,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": false,
        "versions": null,
        "lastUpdate": 1743751963953,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Forward Case",
        "type": "X007",
        "conversations": null,
        "isSendExecuted": null,
        "id": "6a0e27b2f200498d8fb8a575120f7bce",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963973,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": false,
        "versions": null,
        "lastUpdate": 1743751963980,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Claim for - Reimbursement - Administrative Check /Medical information",
        "type": "H020",
        "conversations": null,
        "isSendExecuted": null,
        "id": "a21d51f04a004c1fb164f2e9d555fc02",
        "direction": "OUT" as Direction,
        "creationDate": 1743751963998,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751964004,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Notification of death",
        "type": "H070",
        "conversations": null,
        "isSendExecuted": null,
        "id": "6c7255f3357445af9bed5a6ad499434a",
        "direction": "OUT" as Direction,
        "creationDate": 1743751964026,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751964033,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Request for Medical Information",
        "type": "H120",
        "conversations": null,
        "isSendExecuted": null,
        "id": "437b34ce16a14962a89eeb738d852470",
        "direction": "OUT" as Direction,
        "creationDate": 1743751964056,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751964067,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      },
      {
        "attachments": [],
        "displayName": "Notification of Medical Information / Reply to request for Medical Information",
        "type": "H121",
        "conversations": null,
        "isSendExecuted": null,
        "id": "4a70bd3a5750407291e814baf167db41",
        "direction": "OUT" as Direction,
        "creationDate": 1743751964090,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1743751964096,
        "parentDocumentId": null,
        "status": "empty",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT01",
              "countryCode": "NO",
              "name": "NAV ACC 01",
              "id": "NO:NAVAT01"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT02",
              "countryCode": "NO",
              "name": "NAV ACC 02",
              "id": "NO:NAVAT02"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT03",
              "countryCode": "NO",
              "name": "NAV ACC 03",
              "id": "NO:NAVAT03"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2021-03-27T00:00:00.000+00:00",
              "acronym": "NAVAT04",
              "countryCode": "NO",
              "name": "NAV ACC 04",
              "id": "NO:NAVAT04"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT06",
              "countryCode": "NO",
              "name": "NAV ACC 06",
              "id": "NO:NAVAT06"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT08",
              "countryCode": "NO",
              "name": "NAV ACC 08",
              "id": "NO:NAVAT08"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          id: '1',
          date: 1571818194896
        },
        "lastVersion": {
          id: '3',
          date: 1571818294896
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      }
    ],
    "error": null,
    "readOnly": false,
    "subject": null,
    "cdm": "4.3"
  },
  {
    "cdm": "4.3",
    "type": "P_BUC_01",
    "caseId": "999999",
    "internationalId": "f1406de50b7a4084a4149d41c0ea00da",
    "creator": {
      "country": "NO",
      "institution": "NO:NAVAT07",
      "name": "NAV ACC 07",
      "acronym": "NAVAT07"
    },
    "sakType": null,
    "status": "open",
    "startDate": 1654168571352,
    "lastUpdate": 1654168938132,
    "institusjon": [
      {
        "country": "NO",
        "institution": "NO:NAVAT07",
        "name": "NAV ACC 07",
        "acronym": "NAVAT07"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT05",
        "name": "NAV ACC 05",
        "acronym": "NAVAT05"
      }
    ],
    "seds": [
      {
        id: '10678159cd4142f890d56264bfdefd13',
        parentDocumentId: null,
        type: 'P2000',
        status: 'active',
        direction: 'IN' as Direction,
        creationDate: 1571818194896,
        lastUpdate: 1571818294896,
        receiveDate: later,
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
          }
        ],
        attachments: [],
        version: '1',
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
    ],
    "error": null,
    "readOnly": false,
  },
  {
    cdm: "4.2",
    type: 'P_BUC_01',
    readOnly: false,
    caseId: '600891',
    internationalId: '18e6db00c11e455b99971e7668549485',
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
        creationDate: 1571818194896,
        lastUpdate: 1571818294896,
        receiveDate: later,
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
        parentDocumentId: '5d549c96e0ce40788a2eea2992c1f65f',
        type: 'X007',
        status: 'empty',
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        status: 'received',
        direction: 'IN' as Direction,
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
        id: 'dc4670bbd59d4c8ab3b41974a72bf11e',
        parentDocumentId: null,
        type: 'P4000',
        status: 'received',
        direction: 'IN' as Direction,
        creationDate: 1671918181793,
        lastUpdate: 1671918181793,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        status: 'received',
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        status: 'open',
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
        creationDate: 1571234189234,
        lastUpdate: 1571547188033,
        displayName: 'Insurance/residence periods',
        participants: [
          {
            role: 'Receiver',
            organisation: {
              acronym: 'NAVAT07',
              countryCode: 'NO',
              name: 'NAV ACCEPTANCE TEST 07',
              id: 'NO:NAVAT07'
            },
            selected: false
          },
          {
            role: 'Sender',
            organisation: {
              acronym: 'DEDEMO01',
              countryCode: 'DE',
              name: 'German demo 01',
              id: 'NO:DEDEMO01'
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
        status: 'sent',
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        status: 'received',
        direction: 'IN' as Direction,
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
        parentDocumentId: 'fd55d46e6ab741838d3a8e1735d33f1b',
        type: 'X010',
        status: 'empty',
        direction: 'IN' as Direction,
        creationDate: 1571818174000,
        lastUpdate: 1571818174000,
        displayName: 'Reminder',
        participants: [],
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
        direction: 'IN' as Direction,
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
    cdm: "4.2",
    type: 'P_BUC_02',
    readOnly: false,
    creator: {
      country: 'NO',
      institution: 'NO:NAVAT07',
      name: 'NAV ACCEPTANCE TEST 07',
      acronym: 'NAVAT07'
    },
    caseId: '195440',
    internationalId: '18e6db00c11e455b99971e7668549485',
    sakType: 'Generell' as SakTypeValue,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        status: 'open',
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
    cdm: "4.2",
    type: 'P_BUC_02',
    readOnly: false,
    creator: {
      country: 'SE',
      institution: 'SE:DEMOSE01',
      name: 'Swedish Demo Institution 001',
      acronym: 'DEMOSE01'
    },
    caseId: '195441',
    sakType: 'Generell' as SakTypeValue,
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
        direction: 'IN' as Direction,
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
    cdm: "4.2",
    type: 'P_BUC_03',
    readOnly: true,
    creator: {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    },
    caseId: '158123',
    sakType: 'Generell' as SakTypeValue,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      type: 'P2200',
      status: 'received',
      direction: 'IN' as Direction,
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
      id: '3fe845d1142742a5a7a28f339e5d5b31',
      parentDocumentId: null,
      type: 'P2000',
      status: 'sent',
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
    cdm: "4.2",
    type: 'P_BUC_05',
    readOnly: false,
    creator: {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    },
    caseId: '158125',
    sakType: 'Generell' as SakTypeValue,
    aktoerId: '001122334455',
    status: 'open',
    direction: 'IN' as Direction,
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
    seds: [
      {
        "attachments": [],
        "displayName": "Request for additional information",
        "type": "P8000",
        "conversations": null,
        "isSendExecuted": null,
        "id": "87eb0138ed074c02b2018fa1d6454f51",
        "direction": "OUT" as Direction,
        "creationDate": 1740666174199,
        "receiveDate": null,
        "typeVersion": null,
        "allowsAttachments": true,
        "versions": null,
        "lastUpdate": 1740666174652,
        "parentDocumentId": null,
        "status": "new",
        "participants": [
          {
            "role": "Sender",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT07",
              "countryCode": "NO",
              "name": "NAV ACC 07",
              "id": "NO:NAVAT07"
            },
            "selected": false
          },
          {
            "role": "Receiver",
            "organisation": {
              "address": null,
              "activeSince": "2018-08-27T00:00:00.000+00:00",
              "acronym": "NAVAT05",
              "countryCode": "NO",
              "name": "NAV ACC 05",
              "id": "NO:NAVAT05"
            },
            "selected": false
          }
        ],
        "firstVersion": {
          "date": 1557393087051,
          "id": "1"
        },
        "lastVersion": {
          "date": 1557393087051,
          "id": "1"
        },
        "version": "1",
        "message": undefined,
        "name": null,
        "mimeType": null,
        "creator": null
      }
    ]
  },
  {
    cdm: "4.2",
    type: 'P_BUC_06',
    readOnly: false,
    creator: {
      country: 'NO',
      institution: 'NO:DEMONO02',
      name: 'Norwegian institution 02',
      acronym: 'DEMONO02'
    },
    caseId: '158124',
    sakType: 'Generell' as SakTypeValue,
    aktoerId: '001122334455',
    status: 'open',
    direction: 'IN' as Direction,
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
      direction: 'IN' as Direction,
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
    cdm: "4.2",
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
    cdm: "4.2",
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
  },
  {
    cdm: "4.2",
    type: "P_BUC_06",
    readOnly: false,
    caseId: "1442485",
    internationalId: "113ad73552c84cf1a07110b4974bebfe",
    creator: {
      country: "NO",
      institution: "NO:NAVAT05",
      name: "NAV ACC 05",
      acronym: "NAVAT05"
    },
    sakType: null,
    status: "open",
    startDate: 1659963503928,
    lastUpdate: 1659963504162,
    institusjon: [
      {
        country: "NO",
        institution: "NO:NAVAT05",
        name: "NAV ACC 05",
        acronym: "NAVAT05"
      },
      {
        country: "NO",
        institution: "NO:NAVAT07",
        name: "NAV ACC 07",
        acronym: "NAVAT07"
      }
    ],
    seds: [
      {
        id: 'f2123ebf16dc4ddaaaf2420d0adb39c8',
        parentDocumentId: null,
        type: 'P10000',
        status: 'sent',
        direction: 'IN' as Direction,
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
      },
    ],
    error: null
  },
  {
    "cdm": "4.2",
    "type": "P_BUC_06",
    "caseId": "1443112",
    "internationalId": "4cda88884fc2446295b6f2fce0ed14e8",
    "creator": {
      "country": "NO",
      "institution": "NO:NAVAT05",
      "name": "NAV ACC 05",
      "acronym": "NAVAT05"
    },
    "sakType": null,
    "status": "open",
    "startDate": 1666682731992,
    "lastUpdate": 1666682732210,
    "institusjon": [
      {
        "country": "NO",
        "institution": "NO:NAVAT05",
        "name": "NAV ACC 05",
        "acronym": "NAVAT05"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT07",
        "name": "NAV ACC 07",
        "acronym": "NAVAT07"
      }
    ],
    "seds": [
      {
        id: 'f2123ebf16dc4ddaaaf2420d0adb39c8',
        parentDocumentId: null,
        type: 'P10000',
        status: 'sent',
        direction: 'IN' as Direction,
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
      }
    ],
    "error": null,
    "readOnly": false,
  },
  {
    "cdm": "4.2",
    "type": "P_BUC_01",
    "caseId": "1441957",
    "internationalId": "f1406de50b7a4084a4149d41c0ea00da",
    "creator": {
      "country": "NO",
      "institution": "NO:NAVAT07",
      "name": "NAV ACC 07",
      "acronym": "NAVAT07"
    },
    "sakType": null,
    "status": "open",
    "startDate": 1654168571352,
    "lastUpdate": 1654168938132,
    "institusjon": [
      {
        "country": "NO",
        "institution": "NO:NAVAT07",
        "name": "NAV ACC 07",
        "acronym": "NAVAT07"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT05",
        "name": "NAV ACC 05",
        "acronym": "NAVAT05"
      }
    ],
    "seds": [
      {
        id: '98492223b35240138503f58ec09454fa',
        parentDocumentId: '5d549c96e0ce40788a2eea2992c1f65f',
        type: 'X008',
        status: 'empty',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
        creationDate: 1571818194896,
        lastUpdate: 1571818294896,
        receiveDate: later,
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
        parentDocumentId: '5d549c96e0ce40788a2eea2992c1f65f',
        type: 'X007',
        status: 'empty',
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        id: 'dc4670bbd59d4c8ab3b41974a72bf11d',
        parentDocumentId: null,
        type: 'P4000',
        status: 'received',
        direction: 'IN' as Direction,
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
    ],
    "error": null,
    "readOnly": false,
  },
  {
    "cdm": "4.2",
    "type": "P_BUC_01",
    "caseId": "1443133",
    "internationalId": "26ce9f052206448a986adbe7955409f0",
    "creator": {
      "country": "NO",
      "institution": "NO:NAVAT05",
      "name": "NAV ACC 05",
      "acronym": "NAVAT05"
    },
    "sakType": null,
    "status": "open",
    "startDate": 1666852009130,
    "lastUpdate": 1666852009505,
    "institusjon": [
      {
        "country": "NO",
        "institution": "NO:NAVAT05",
        "name": "NAV ACC 05",
        "acronym": "NAVAT05"
      },
      {
        "country": "NO",
        "institution": "NO:NAVAT07",
        "name": "NAV ACC 07",
        "acronym": "NAVAT07"
      }
    ],
    "seds": [
      {
        id: '98492223b35240138503f58ec09454fa',
        parentDocumentId: '5d549c96e0ce40788a2eea2992c1f65f',
        type: 'X008',
        status: 'empty',
        creationDate: 1571818175000,
        lastUpdate: 1571818175000,
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
        creationDate: 1571818194896,
        lastUpdate: 1571818294896,
        receiveDate: later,
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
        parentDocumentId: '5d549c96e0ce40788a2eea2992c1f65f',
        type: 'X007',
        status: 'empty',
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
        direction: 'IN' as Direction,
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
      }
    ],
    "error": null,
    "readOnly": false,
  }
]

const bucs = () => _.cloneDeep(mockBuc)

export default bucs
