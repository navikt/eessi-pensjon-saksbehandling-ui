export default (buc: string) => {
  const now = new Date().getTime()

  return {
    type: buc,
    caseId: '123',
    error: null,
    institusjon: [],
    lastUpdate: now,
    startDate: now,
    sakType: null,
    seds: [{
      allowsAttachments: true,
      attachments: [],
      creationDate: now,
      displayName: 'Old age pension claim',
      firstVersion: {
        date: '2020-06-23T10:06:38.000+0000',
        id: '1'
      },
      id: 'b8f5df1b95f54d25ad13e8ed105fae23',
      lastUpdate: now,
      lastVersion: {
        date: '2020-06-23T10:06:38.000+0000',
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
