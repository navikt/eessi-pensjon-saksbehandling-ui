
const BUCLIST = {

  ONGOING: [
    {
      type: 'P_BUC_01',
      name: 'AldersPensjon',
      dateCreated: 'dd.mm.åå',
      countries: ['ZW', 'KR', 'SE', 'DK', 'CZ']
    },
    {
      type: 'P_BUC_02',
      name: 'UførePensjon',
      dateCreated: 'dd.mm.åå',
      countries: ['SE', 'DK', 'CZ'],
      merknader: ['foo', 'bar', 'baz']
    },
    {
      type: 'P_BUC_01',
      name: 'AldersPensjon',
      dateCreated: 'dd.mm.åå',
      countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
      comments: ['foo', 'bar', 'baz']
    },
    {
      type: 'P_BUC_01',
      name: 'AldersPensjon',
      dateCreated: 'dd.mm.åå',
      countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
      merknader: ['foo', 'bar', 'baz'],
      comments: ['foo', 'bar', 'baz']
    }
  ],
  OTHER: [
    {
      type: 'P_BUC_01',
      name: 'FIFOFA',
      dateCreated: 'dd.mm.åå',
      countries: ['RU', 'GB', 'CH']
    },
    {
      type: 'P_BUC_02',
      name: 'GRÅTASS',
      dateCreated: 'dd.mm.åå',
      countries: ['DE', 'TR', 'CA']
    }
  ]
}

const SEDS = [
  {
    name: 'P2000',
    status: 'sent',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  },
  {
    name: 'P3000SE',
    status: 'draft',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  },
  {
    name: 'P4000',
    status: 'received',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  },
  {
    name: 'P5000',
    status: 'foo',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  }
]

export const fetchBucList = async () => {
  return BUCLIST
}

export const fetchSedListForBuc = async (buc) => {
  return SEDS
}
