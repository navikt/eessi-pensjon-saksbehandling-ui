import React from "react";
import CountrySelect, {CountrySelectProps} from "@navikt/landvelger";
import {State} from "src/declarations/reducers";
import {useAppSelector} from "src/store";
import {CountryCodeLists, CountryCodes, SimpleCountry, PSED} from "src/declarations/app";
import _ from "lodash";

export interface CountryDropdownSelector {
  currentPSED: PSED
  countryCodes: CountryCodes | null | undefined
}

const mapState = (state: State): CountryDropdownSelector => ({
  currentPSED: state.buc.PSED,
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

  const {currentPSED, countryCodes} = useAppSelector(mapState)
  const sedVersion = _.get(currentPSED, "sedVersion")

  const countryCodesByVersion: CountryCodeLists | undefined = countryCodes ? countryCodes[sedVersion as keyof CountryCodes] : undefined

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
