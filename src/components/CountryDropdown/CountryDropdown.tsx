import React, {useMemo} from "react";
import CountrySelect, {CountrySelectProps} from "@navikt/landvelger";
import {State} from "src/declarations/reducers";
import {useAppSelector} from "src/store";
import {CountryCodeLists, CountryCodes, SimpleCountry} from "src/declarations/app";
import {Bucs} from "src/declarations/buc";
import {createSelector} from "@reduxjs/toolkit";

export interface CountryDropdownSelector {
  currentBuc: string | undefined
  bucs: Bucs | undefined
  countryCodes: CountryCodes | null | undefined
}

const mapState = createSelector(
  (state: State) => state.buc.currentBuc,
  (state: State) => state.buc.bucs,
  (state: State) => state.app.countryCodes,
  (currentBuc, bucs, countryCodes): CountryDropdownSelector => ({
    currentBuc,
    bucs,
    countryCodes
  })
)

export interface CountryDropdownProps extends CountrySelectProps<any>{
  dataTestId?: string
  countryCodeListName?: string
  excludeNorway?: boolean
}

const CountryDropdown : React.FC<CountryDropdownProps> = ({
  countryCodeListName,
  dataTestId,
  excludeNorway = false,
  ...rest
}: CountryDropdownProps) => {

  const {bucs, currentBuc, countryCodes} = useAppSelector(mapState)
  const cdmVersion = "v" + bucs![currentBuc!].cdm

  const countryCodesByVersion: CountryCodeLists | undefined = countryCodes ? countryCodes[cdmVersion as keyof CountryCodes] : undefined

  const includeList = useMemo(() => {
    let list = countryCodeListName && countryCodesByVersion ? countryCodesByVersion[countryCodeListName as keyof CountryCodeLists] : rest.includeList

    if(countryCodeListName && excludeNorway){
      list = list?.filter((country: SimpleCountry) => country.landkode !== 'NO')
    } else if(!countryCodeListName && excludeNorway) {
      list = list?.filter((it: string) => it !== 'NO')
    }

    return list
  }, [countryCodeListName, countryCodesByVersion, excludeNorway, rest.includeList])

  return(
    <CountrySelect
      {...rest}
      menuPortalTarget={document.body}
      data-testid={dataTestId}
      includeList={includeList}
    />
  )


}

export default CountryDropdown
