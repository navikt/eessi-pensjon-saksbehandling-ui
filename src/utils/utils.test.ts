import {
  checkSingleFilstoerrelseMB,
  checkSumFilstoerrelseMB,
  removeWhiteSpace,
  replaceCommasWithPeriods,
  sumFilstoerrelseMB,
  removeWhiteSpaceAndReplaceCommas,
  replacePeriodsWithCommas
} from 'src/utils/utils'
import { JoarkBrowserItem } from 'src/declarations/joark'

describe('utils/utils/sumFilstoerrelseMB', () => {
  const buildJoarkItem = (filstoerrelseMB?: number): JoarkBrowserItem => ({
    hasSubrows: false,
    key: '1',
    type: 'joark',
    journalpostId: '123',
    title: 'title',
    tema: 'tema',
    date: new Date(2020, 1, 1),
    dokumentInfoId: '456',
    variant: undefined,
    filstoerrelseMB
  })

  it('Should return 0 when all file sizes are undefined', () => {
    expect(sumFilstoerrelseMB([buildJoarkItem(), buildJoarkItem(undefined)])).toEqual(0)
  })

  it('Should sum file sizes and round to two decimals', () => {
    expect(sumFilstoerrelseMB([buildJoarkItem(1.234), buildJoarkItem(2.345)])).toEqual(3.58)
  })
})

describe('utils/utils/checkSumFilstoerrelseMB', () => {
  it('Should return true when total size is within the limit', () => {
    expect(checkSumFilstoerrelseMB(2.5, '3.4', 10)).toEqual(true)
  })

  it('Should return false when total size is equal to the limit', () => {
    expect(checkSumFilstoerrelseMB(4, '6', 10)).toEqual(false)
  })

  it('Should return false when total size is above the limit', () => {
    expect(checkSumFilstoerrelseMB(4.1, '6', 10)).toEqual(false)
  })

  it('Should treat null attachment size as 0', () => {
    expect(checkSumFilstoerrelseMB(2.5, null, 10)).toEqual(true)
  })

  it('Should treat undefined attachment size as 0', () => {
    expect(checkSumFilstoerrelseMB(2.5, undefined, 10)).toEqual(true)
  })

  it('Should treat invalid attachment size as 0', () => {
    expect(checkSumFilstoerrelseMB(2.5, 'invalid-number', 10)).toEqual(true)
  })
})

describe('utils/utils/checkSingleFilstoerrelseMB', () => {
  const buildJoarkItem = (filstoerrelseMB?: number): JoarkBrowserItem => ({
    hasSubrows: false,
    key: '1',
    type: 'joark',
    journalpostId: '123',
    title: 'title',
    tema: 'tema',
    date: new Date(2020, 1, 1),
    dokumentInfoId: '456',
    variant: undefined,
    filstoerrelseMB
  })

  it('Should return true when file size is undefined', () => {
    expect(checkSingleFilstoerrelseMB([buildJoarkItem(undefined)], 10)).toEqual(true)
  })

  it('Should return true when all file sizes are within the limit', () => {
    expect(checkSingleFilstoerrelseMB([buildJoarkItem(1), buildJoarkItem(9.99)], 10)).toEqual(true)
  })

  it('Should return true when item list is empty', () => {
    expect(checkSingleFilstoerrelseMB([], 10)).toEqual(true)
  })

  it('Should return true when file size is null', () => {
    const itemWithNullFileSize = {
      ...buildJoarkItem(undefined),
      filstoerrelseMB: null
    } as unknown as JoarkBrowserItem

    expect(checkSingleFilstoerrelseMB([itemWithNullFileSize], 10)).toEqual(true)
  })

  it('Should return false when one file is equal to the limit', () => {
    expect(checkSingleFilstoerrelseMB([buildJoarkItem(9.9), buildJoarkItem(10)], 10)).toEqual(false)
  })

  it('Should return false when one file is greater than the limit', () => {
    expect(checkSingleFilstoerrelseMB([buildJoarkItem(12)], 10)).toEqual(false)
  })
})

describe('utils/utils/removeWhiteSpace', () => {
  it('Should remove white spaces', () => {
    expect(removeWhiteSpace(' String With White Spaces ')).toEqual(
      'StringWithWhiteSpaces'
    )
  })

  it('Should do nothing when string has no white spaces', () => {
    expect(removeWhiteSpace('StringWithoutWhiteSpacesCommasOrPeriods')).toEqual(
      'StringWithoutWhiteSpacesCommasOrPeriods'
    )
  })

  it('Should return empty string when string contains only white spaces', () => {
    expect(removeWhiteSpace('  ')).toEqual(
      ''
    )
  })

  it('Should not remove periods', () => {
    expect(removeWhiteSpace('String.WithPeriods')).toEqual(
      'String.WithPeriods'
    )
  })

  it('Should remove white spaces from number strings', () => {
    expect(removeWhiteSpace(' 432 56 1 9 ')).toEqual(
      '4325619'
    )
  })

  it('Should do nothing when number string has no white spaces', () => {
    expect(removeWhiteSpace('12345678')).toEqual(
      '12345678'
    )
  })

  it('Should not remove periods from number strings', () => {
    expect(removeWhiteSpace('4646.872')).toEqual(
      '4646.872'
    )
  })

  it('Empty string should return empty string', () => {
    expect(removeWhiteSpace('')).toEqual(
      ''
    )
  })
})

describe('utils/utils/replacePeriodsWithCommas', () => {
  it('Should replace period with comma', () => {
    expect(replacePeriodsWithCommas('StringWith.Period')).toEqual(
      'StringWith,Period'
    )
  })

  it('Should replace multiple commas with multiple periods (although it would fail at save step)', () => {
    expect(replacePeriodsWithCommas('String.With.Multiple.Periods.')).toEqual(
      'String,With,Multiple,Periods,'
    )
  })


  it('Should not replace commas', () => {
    expect(replacePeriodsWithCommas('String,With,Commas')).toEqual(
      'String,With,Commas'
    )
  })

  it('Should replace period with comma on number strings', () => {
    expect(replacePeriodsWithCommas('432.5619')).toEqual(
      '432,5619'
    )
  })

  it('Should replace multiple periods with multiple commas on number strings (although it would fail at save step)', () => {
    expect(replacePeriodsWithCommas('123.456.789.')).toEqual(
      '123,456,789,'
    )
  })

  it('Should do nothing when number string has no periods', () => {
    expect(replacePeriodsWithCommas('12345678')).toEqual(
      '12345678'
    )
  })

  it('Empty string should return empty string', () => {
    expect(replacePeriodsWithCommas('')).toEqual(
      ''
    )
  })
})

describe('utils/utils/replaceCommaWithPeriods', () => {
  it('Should replace comma with period', () => {
    expect(replaceCommasWithPeriods('StringWith,Commas')).toEqual(
      'StringWith.Commas'
    )
  })

  it('Should replace multiple commas with multiple periods (although it would fail at save step)', () => {
    expect(replaceCommasWithPeriods('String,With,Multiple,Commas,')).toEqual(
      'String.With.Multiple.Commas.'
    )
  })


  it('Should not remove periods', () => {
    expect(replaceCommasWithPeriods('String.WithPeriods')).toEqual(
      'String.WithPeriods'
    )
  })

  it('Should replace comma with period on number strings', () => {
    expect(replaceCommasWithPeriods('432,5619')).toEqual(
      '432.5619'
    )
  })

  it('Should replace multiple commas with multiple periods on number strings (although it would fail at save step)', () => {
    expect(replaceCommasWithPeriods('123,456,789,')).toEqual(
      '123.456.789.'
    )
  })

  it('Should do nothing when number string has no commas', () => {
    expect(replaceCommasWithPeriods('12345678')).toEqual(
      '12345678'
    )
  })

  it('Should not remove periods from number strings', () => {
    expect(replaceCommasWithPeriods('4646.872.')).toEqual(
      '4646.872.'
    )
  })

  it('Empty string should return empty string', () => {
    expect(replaceCommasWithPeriods('')).toEqual(
      ''
    )
  })
})

describe('utils/utils/removeWhiteSpaceAndReplaceCommas', () => {
  it('Should remove white spaces', () => {
    expect(removeWhiteSpaceAndReplaceCommas(' String With White Spaces ')).toEqual(
      'StringWithWhiteSpaces'
    )
  })

  it('Should do nothing when string has no white spaces', () => {
    expect(removeWhiteSpaceAndReplaceCommas('StringWithoutWhiteSpacesCommasOrPeriods')).toEqual(
      'StringWithoutWhiteSpacesCommasOrPeriods'
    )
  })

  it('Should return empty string when string contains only white spaces', () => {
    expect(removeWhiteSpaceAndReplaceCommas('  ')).toEqual(
      ''
    )
  })

  it('Should not remove period', () => {
    expect(removeWhiteSpaceAndReplaceCommas('String.WithPeriod')).toEqual(
      'String.WithPeriod'
    )
  })

  it('Should remove white spaces from number strings', () => {
    expect(removeWhiteSpaceAndReplaceCommas(' 432 56 1 9 ')).toEqual(
      '4325619'
    )
  })

  it('Should do nothing when number string has no white spaces', () => {
    expect(removeWhiteSpaceAndReplaceCommas('12345678')).toEqual(
      '12345678'
    )
  })

  it('Should not remove period from number strings', () => {
    expect(removeWhiteSpaceAndReplaceCommas('4646.872')).toEqual(
      '4646.872'
    )
  })

  it('Empty string should return empty string', () => {
    expect(removeWhiteSpaceAndReplaceCommas('')).toEqual(
      ''
    )
  })
})

describe('utils/utils/removeWhiteSpaceAndReplaceComma', () => {
  it('Should replace comma with period', () => {
    expect(removeWhiteSpaceAndReplaceCommas('StringWith,Comma')).toEqual(
      'StringWith.Comma'
    )
  })

  it('Should replace multiple commas with multiple periods (although it would fail at save step)', () => {
    expect(removeWhiteSpaceAndReplaceCommas('String,With,Multiple,Commas,')).toEqual(
      'String.With.Multiple.Commas.'
    )
  })


  it('Should not remove period', () => {
    expect(removeWhiteSpaceAndReplaceCommas('String.WithPeriod')).toEqual(
      'String.WithPeriod'
    )
  })

  it('Should replace comma with period on number strings', () => {
    expect(removeWhiteSpaceAndReplaceCommas('432,5619')).toEqual(
      '432.5619'
    )
  })

  it('Should replace multiple commas with multiple periods on number strings (although it would fail at save step)', () => {
    expect(removeWhiteSpaceAndReplaceCommas('123,456,789,')).toEqual(
      '123.456.789.'
    )
  })

  it('Should do nothing when number string has no commas', () => {
    expect(removeWhiteSpaceAndReplaceCommas('12345678')).toEqual(
      '12345678'
    )
  })

  it('Should not remove periods from number strings', () => {
    expect(removeWhiteSpaceAndReplaceCommas('4646.872.')).toEqual(
      '4646.872.'
    )
  })

  it('Empty string should return empty string', () => {
    expect(removeWhiteSpaceAndReplaceCommas('')).toEqual(
      ''
    )
  })
})

describe('utils/utils/removeWhiteSpaceAndReplaceComma', () => {
  it('Should remove white space and replace comma with period', () => {
    expect(removeWhiteSpaceAndReplaceCommas('StringWith WhiteSpace,Comma')).toEqual(
      'StringWithWhiteSpace.Comma'
    )
  })
})


