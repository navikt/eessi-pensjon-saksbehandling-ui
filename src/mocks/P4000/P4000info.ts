export default {
  person: {},
  bank: {},
  stayAbroad: [{
    id: 1,
    type: 'other',
    startDate: { day: '1', month: '1', year: '1970' },
    endDate: { day: '1', month: '1', year: '1971' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockAA', value: 'AF' },
    comment: 'other period 1 comment',
    otherType: 'other period 1 otherType'
  }, {
    id: 2,
    type: 'other',
    startDate: { day: '1', month: '1', year: '1972' },
    dateType: 'onlyStartDate01',
    uncertainDate: true,
    country: { label: 'mockBB', value: 'BB' },
    comment: 'other period 2 comment',
    otherType: 'other period 2 otherType'
  }, {
    id: 3,
    type: 'daily',
    startDate: { day: '1', month: '1', year: '1973' },
    endDate: { day: '1', month: '1', year: '1974' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockCC', value: 'CA' },
    comment: 'daily period 1 comment',
    payingInstitution: 'daily period 1 payingInstitution'
  }, {
    id: 4,
    type: 'daily',
    startDate: { day: '1', month: '1', year: '1975' },
    endDate: { day: '1', month: '1', year: '1976' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockDD', value: 'DO' },
    comment: 'daily period 2 comment',
    payingInstitution: 'daily period 2 payingInstitution'
  }, {
    id: 5,
    type: 'home',
    startDate: { day: '1', month: '1', year: '1977' },
    endDate: { day: '1', month: '1', year: '1978' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockEE', value: 'EC' },
    comment: 'home period 1 comment'
  }, {
    id: 6,
    type: 'home',
    startDate: { day: '1', month: '1', year: '1979' },
    endDate: { day: '1', month: '1', year: '1980' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockFF', value: 'FR' },
    comment: 'home period 2 comment'
  }, {
    id: 7,
    type: 'learn',
    startDate: { day: '1', month: '1', year: '1981' },
    endDate: { day: '1', month: '1', year: '1982' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockGG', value: 'GR' },
    comment: 'learn period 1 comment',
    learnInstitution: 'learn period 1 learnInstitution'
  }, {
    id: 8,
    type: 'learn',
    startDate: { day: '1', month: '1', year: '1983' },
    endDate: { day: '1', month: '1', year: '1984' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockHH', value: 'HU' },
    comment: 'learn period 2 comment',
    learnInstitution: 'learn period 2 learnInstitution'
  }, {
    id: 9,
    type: 'sick',
    startDate: { day: '1', month: '1', year: '1985' },
    endDate: { day: '1', month: '1', year: '1986' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockII', value: 'IT' },
    comment: 'sick period 1 comment',
    payingInstitution: 'sick period 1 payingInstitution'
  }, {
    id: 10,
    type: 'sick',
    startDate: { day: '1', month: '1', year: '1987' },
    endDate: { day: '1', month: '1', year: '1988' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockJJ', value: 'JP' },
    comment: 'sick period 2 comment',
    payingInstitution: 'sick period 2 payingInstitution'
  }, {
    id: 11,
    type: 'child',
    startDate: { day: '1', month: '1', year: '1989' },
    endDate: { day: '1', month: '1', year: '1990' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockKK', value: 'KE' },
    comment: 'child period 1 comment',
    childFirstName: 'Ole',
    childLastName: 'Olsen',
    childBirthDate: { day: '1', month: '1', year: '2002' }
  }, {
    id: 12,
    type: 'child',
    startDate: { day: '1', month: '1', year: '1991' },
    endDate: { day: '1', month: '1', year: '1992' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockLL', value: 'LU' },
    comment: 'child period 2 comment',
    childFirstName: 'Teddy',
    childLastName: 'Olsen',
    childBirthDate: { day: '1', month: '1', year: '2003' }
  }, {
    id: 13,
    type: 'work',
    startDate: { day: '1', month: '1', year: '1993' },
    endDate: { day: '1', month: '1', year: '1994' },
    dateType: 'both',
    uncertainDate: true,
    comment: 'work period 1 comment',
    country: { label: 'mockMM', value: 'MX' },
    workName: 'work period 1 workName',
    workType: '01',
    workActivity: 'work period 1 workActivity',
    workStreet: 'work period 1 workStreet',
    workZipCode: '0123',
    workCity: 'work period 1 workCity',
    workRegion: 'work period 1 workRegion',
    insuranceId: 'work period 1 insuranceId'
  }, {
    id: 14,
    type: 'work',
    startDate: { day: '1', month: '1', year: '1995' },
    endDate: { day: '1', month: '1', year: '1996' },
    dateType: 'both',
    uncertainDate: true,
    comment: 'work period 2 comment',
    country: { label: 'mockNN', value: 'NL' },
    workName: 'work period 2 workName',
    workType: '02',
    workActivity: 'work period 2 workActivity',
    workStreet: 'work period 2 workStreet',
    workZipCode: '0124',
    workCity: 'work period 2 workCity',
    workRegion: 'work period 2 workRegion',
    insuranceId: 'work period 2 insuranceId'
  }, {
    id: 15,
    type: 'military',
    startDate: { day: '1', month: '1', year: '1997' },
    endDate: { day: '1', month: '1', year: '1998' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockOO', value: 'OM' },
    comment: 'military period 1 comment'
  }, {
    id: 16,
    type: 'military',
    startDate: { day: '1', month: '1', year: '1999' },
    endDate: { day: '1', month: '1', year: '2000' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockPP', value: 'PT' },
    comment: 'military period 2 comment'
  }, {
    id: 17,
    type: 'birth',
    startDate: { day: '1', month: '1', year: '2001' },
    dateType: 'onlyStartDate98',
    uncertainDate: false,
    country: { label: 'mockQQ', value: 'QA' },
    comment: 'birth period 1 comment'
  }, {
    id: 18,
    type: 'birth',
    startDate: { day: '1', month: '1', year: '2002' },
    endDate: { day: '1', month: '1', year: '2003' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockRR', value: 'RU' },
    comment: 'birth period 2 comment'
  }, {
    id: 19,
    type: 'voluntary',
    startDate: { day: '1', month: '1', year: '2004' },
    endDate: { day: '1', month: '1', year: '2005' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockSS', value: 'SM' },
    comment: 'voluntary period 1 comment'
  }, {
    id: 20,
    type: 'voluntary',
    startDate: { day: '1', month: '1', year: '2006' },
    endDate: { day: '1', month: '1', year: '2007' },
    dateType: 'both',
    uncertainDate: true,
    country: { label: 'mockTT', value: 'TR' },
    comment: 'voluntary period 2 comment'
  }]
}
