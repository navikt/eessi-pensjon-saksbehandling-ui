import { NewSedPayload } from 'declarations/buc'
import md5 from 'md5'

export default (sed: NewSedPayload) => {
  const now = new Date().getTime()
  return {
    allowsAttachments: true,
    attachments: [],
    creationDate: now,
    displayName: "Transfer of additional information",
    firstVersion: {
      date: "2020-01-29T13:10:51.000+0000",
      id: "1"}
    ,
    id: md5('' + now),
    lastUpdate: now,
    lastVersion: {
      date: "2020-01-29T13:10:51.000+0000",
      id: "1"
    },
    parentDocumentId: null,
    participants: [{
      organisation: {
        address: {
          country: "NO",
          town: null, street:
            null,
          postalCode: null,
          region: null
        },
        accessPoint: null,
        acronym: "NAV ACCT 07",
        activeSince: "2018-08-26T22:00:00.000+0000",
        assignedBUCs: null,
        contactMethods: null,
        countryCode: "NO",
        id: "NO:NAVAT07",
        location: null,
        name: "NAV ACCEPTANCE TEST 07",
        registryNumber: null
      },
      role: "Sender",
      selected: false
    }, {
      organisation: {
        address: {
          country: "NO",
          town: null, street:
            null,
          postalCode: null,
          region: null
        },
        accessPoint: null,
        acronym: "NAV ACCT 08",
        activeSince: "2018-08-26T22:00:00.000+0000",
        assignedBUCs: null,
        contactMethods: null,
        countryCode: "NO",
        id: "NO:NAVAT08",
        location: null,
        name: "NAV ACCEPTANCE TEST 08",
        registryNumber: null
      },
      role: "Receiver",
      selected: false
    }],
    status: "draft",
    type: sed.sed,
    version: "1"
  }
}
