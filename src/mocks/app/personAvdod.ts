const avdod1 = {
  fnr: 'personFarFnr',
  aktoerId: '2865434801175',
  fulltNavn: 'MOR AVDØD1',
  fornavn: 'MOR',
  mellomnavn: null,
  etternavn: 'AVDØD1',
  relasjon: 'MOR'
}

const avdod2 = {
  fnr: 'personMorFnr',
  aktoerId: '2865434801175',
  fulltNavn: 'FAR AVDØD2',
  fornavn: 'FAR',
  mellomnavn: null,
  etternavn: 'AVDØD2',
  relasjon: 'FAR'
}

export default (nrAvdod: number | undefined) => {
  let whichOne = 0
  if (nrAvdod !== undefined) {
    whichOne = nrAvdod
    if (whichOne > 2) {
      whichOne = 2
    }
  } else {
    whichOne = Math.floor(Math.random() * 3)
  }
  if (whichOne === 0) {
    return []
  }
  if (whichOne === 1) {
    return [avdod1]
  }
  if (whichOne === 2) {
    return [avdod1, avdod2]
  }
  return undefined
}
