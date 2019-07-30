import CountryData from './CountryData'

describe('components/CountryData', () => {
  it('getData', () => {
    let data = CountryData.getData('en')
    expect(data).toBeDefined()
    data = CountryData.getData('nb')
    expect(data).toBeDefined()
    data = CountryData.getData('xx')
    expect(data).not.toBeDefined()
  })

  it('findByValue', () => {
    const data = CountryData.findByValue('nb', 'NO')
    expect(data).toMatchObject({
      currency: 'NOK',
      currencyLabel: 'Norsk Krone',
      label: 'Norge',
      value: 'NO',
      value3: 'NOR'
    })
  })

  it('findByValue3', () => {
    const data = CountryData.findByValue3('nb', 'NOR')
    expect(data).toMatchObject({
      currency: 'NOK',
      currencyLabel: 'Norsk Krone',
      label: 'Norge',
      value: 'NO',
      value3: 'NOR'
    })
  })

  it('filterByValueOnArray', () => {
    const data = CountryData.filterByValueOnArray('nb', ['NO', 'SE', 'FI', 'DK'])
    expect(data).toMatchObject([{
      currency: 'NOK',
      currencyLabel: 'Norsk Krone',
      label: 'Norge',
      value: 'NO',
      value3: 'NOR'
    }, {
      currency: 'SEK',
      currencyLabel: 'Svensk Krona',
      label: 'Sverige',
      value: 'SE',
      value3: 'SWE'
    }, {
      currency: 'DKK',
      currencyLabel: 'Dansk Krone',
      label: 'Danmark',
      value: 'DK',
      value3: 'DNK'
    }, {
      currency: 'EUR',
      currencyLabel: 'Euro',
      label: 'Finland',
      value: 'FI',
      value3: 'FIN'
    }])
  })
})
