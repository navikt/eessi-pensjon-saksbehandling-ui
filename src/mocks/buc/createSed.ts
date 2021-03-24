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
        acronym: 'NAV ACCT 07',
        countryCode: 'NO',
        name: 'NAV ACCEPTANCE TEST 07',
        id: 'NO:NAVAT07'
      },
      selected: false
    }, {
      role: 'Receiver',
      organisation: {
        acronym: 'NAV ACCT 08',
        countryCode: 'NO',
        name: 'NAV ACCEPTANCE TEST 08',
        id: 'NO:NAVAT08'
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
