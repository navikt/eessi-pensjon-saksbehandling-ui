
export default (aktoerId: string, sakId: string) => ([
  {
    buctype: 'P_BUC_05',
    euxCaseId: '158125',
    aktoerId,
    saknr: sakId,
    avdodFnr: null,
    kilde: 'pdl'
  }, {
    buctype: 'X_BUC_XX',
    euxCaseId: '362453',
    aktoerId,
    saknr: sakId,
    avdodFnr: null,
    kilde: 'pdl'
  }
])
