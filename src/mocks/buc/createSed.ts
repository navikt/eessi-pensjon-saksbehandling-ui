import md5 from 'md5'

export default (payload:any) => {
  const now = new Date().getTime()
  const nowString = new Date().toDateString()
  return {
    id: md5('' + now),
    parentDocumentId: null,
    type: payload.sed,
    status: 'empty',
    creationDate: now,
    lastUpdate: now,
    displayName: 'Display name',
    participants: [{
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
      selected: false
    }, {
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
        acronym: 'NAV ACCT 08',
        countryCode: 'NO',
        contactMethods: null,
        name: 'NAV ACCEPTANCE TEST 08',
        location: null,
        assignedBUCs: null,
        id: 'NO:NAVAT08',
        accessPoint: null
      },
      selected: false
    }],
    attachments: [],
    version: '1',
    firstVersion: {
      date: nowString,
      id: '1'
    },
    lastVersion: {
      date: nowString,
      id: '1'
    },
    allowsAttachments: true,
    message: 'additional message'
  }
}
