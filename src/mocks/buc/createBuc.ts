import md5 from 'md5'

export default (buc: string) => {
  const now = new Date().getTime()
  const caseId = Math.floor(100000 + Math.random() * 900000)
  return {
    type: buc,
    caseId: caseId,
    error: null,
    institusjon: [],
    lastUpdate: now,
    startDate: now,
    sakType: null,
    seds: [{
      allowsAttachments: true,
      attachments: [],
      creationDate: new Date().getTime(),
      displayName: 'Old age pension claim',
      firstVersion: {
        date: '2020-07-14T07:43:36.000+0000',
        id: '1'
      },
      id: md5('' + new Date().getTime()),
      lastUpdate: 1594712616000,
      lastVersion: {
        date: '2020-07-14T07:43:36.000+0000',
        id: '1'
      },
      parentDocumentId: null,
      participants: null,
      status: 'empty',
      type: 'P2000',
      version: '1'
    }],
    status: 'open',
    creator: {
      institution: 'NO:NAV07',
      country: 'NO'
    }
  }
}
