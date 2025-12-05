import React from "react";
import CountrySelect, {CountrySelectProps} from "@navikt/landvelger";
import {State} from "src/declarations/reducers";
import {useAppSelector} from "src/store";
import {CountryCodeLists, CountryCodes, SimpleCountry} from "src/declarations/app";
import {Bucs} from "src/declarations/buc";

export interface CountryDropdownSelector {
  currentBuc: string | undefined
  bucs: Bucs | undefined
  countryCodes: CountryCodes | null | undefined
}

const mapState = (state: State): CountryDropdownSelector => ({
  currentBuc: state.buc.currentBuc,
  bucs: state.buc.bucs,
  countryCodes: state.app.countryCodes
})

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

  let includeList = countryCodeListName && countryCodesByVersion ? countryCodesByVersion[countryCodeListName as keyof CountryCodeLists] : rest.includeList

  if(countryCodeListName && excludeNorway){
    includeList = includeList?.filter((country: SimpleCountry) => country.landkode !== 'NO')
  } else {!countryCodeListName && excludeNorway} {
    includeList = includeList?.filter((it: string) => it !== 'NO')
  }

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
