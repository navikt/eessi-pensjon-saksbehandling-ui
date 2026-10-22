import { fireEvent, render, screen } from '@testing-library/react'
import mockCountryCodes from 'src/mocks/app/countryAndCurrencyCodes'
import { stageSelector } from 'src/setupTests'
import CountryDropdown from './CountryDropdown'

describe('components/CountryDropdown/CountryDropdown', () => {
  const stageBuc = (cdm: string) => stageSelector({}, {
    bucs: { '123': { cdm } },
    currentBuc: '123',
    countryCodes: mockCountryCodes
  })

  const renderAndOpen = (props: any) => {
    const wrapper = render(<CountryDropdown id='country-dropdown-id' label='country' {...props} />)
    const input = wrapper.container.querySelector('input#country-dropdown-id, #country-dropdown-id input')
    fireEvent.keyDown(input!, { key: 'ArrowDown' })
  }

  it('uses the named list for the BUC CDM version and ignores includeList', () => {
    stageBuc('4.2')
    renderAndOpen({ countryCodeListName: 'euEftaLand', includeList: ['PT'] })
    expect(screen.getByText('Danmark')).toBeTruthy()
    expect(screen.getByText('Norge')).toBeTruthy()
    expect(screen.queryByText('Portugal')).toBeNull()
  })

  it('removes Norway from the named list with excludeNorway', () => {
    stageBuc('4.2')
    renderAndOpen({ countryCodeListName: 'euEftaLand', excludeNorway: true })
    expect(screen.getByText('Danmark')).toBeTruthy()
    expect(screen.queryByText('Norge')).toBeNull()
  })

  it('uses includeList without a named list, and removes Norway with excludeNorway', () => {
    stageBuc('4.2')
    renderAndOpen({ includeList: ['NO', 'PT'], excludeNorway: true })
    expect(screen.getByText('Portugal')).toBeTruthy()
    expect(screen.queryByText('Norge')).toBeNull()
    expect(screen.queryByText('Danmark')).toBeNull()
  })

  it('falls back to includeList when the BUC CDM version has no country codes', () => {
    stageBuc('4.4')
    renderAndOpen({ countryCodeListName: 'euEftaLand', includeList: ['PT'] })
    expect(screen.getByText('Portugal')).toBeTruthy()
    expect(screen.queryByText('Danmark')).toBeNull()
  })
})
