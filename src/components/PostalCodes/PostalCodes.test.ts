import PostalCodes from './PostalCodes'

describe('components/PostalCodes/PostalCodes', () => {
  it('Gets city from zip code', () => {
    expect(PostalCodes.get('3070')).toEqual('SANDE I VESTFOLD')
  })
})
