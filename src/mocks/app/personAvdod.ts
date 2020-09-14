export default () => {
  const x = Math.random()
  const whichOne = Math.floor(x * 3)
  if (whichOne === 0) {
    return []
  }
  if (whichOne === 1) {
    return [{
      fnr: '12345678902',
      aktoerId: '2865434801175',
      fulltNavn: 'BLYANT FRODIG',
      fornavn: 'FRODIG',
      mellomnavn: null,
      etternavn: 'BLYANT',
      relasjon: 'REPA'
    }]
  }
  if (whichOne === 2) {
    return [{
      fnr: '12345678902',
      aktoerId: '2865434801175',
      fulltNavn: 'BLYANT FRODIG MOR',
      fornavn: 'FRODIG',
      mellomnavn: 'BLYANT',
      etternavn: 'MOR',
      relasjon: 'MOR'
    }, {
      fnr: '12345678903',
      aktoerId: '2865434801175',
      fulltNavn: 'BLYANT FRODIG FAR',
      fornavn: 'FRODIG',
      mellomnavn: 'BLYANT',
      etternavn: 'FAR',
      relasjon: 'FAR'
    }]
  }
  return undefined
}
