import React from "react";
import Flag from "@navikt/flagg-ikoner";
import CountryData from "@navikt/land-verktoy";
import {State} from "src/declarations/reducers";
import {useAppSelector} from "src/store";
import {CenterHStack} from "src/components/StyledComponents";

export interface FlagPanelProps {
  land: string | undefined
}

export interface FlagPanelSelector {
  countryCodeMap: {string: string} | undefined
}

const mapState = (state: State): FlagPanelSelector => ({
  countryCodeMap: state.app.countryCodeMap
})

const FlagPanel: React.FC<FlagPanelProps> = ({
  land
}: FlagPanelProps): JSX.Element => {
  const { countryCodeMap } = useAppSelector(mapState)
  const countryData = CountryData.getCountryInstance('nb')
  const country = countryData.findByValue(land)

  return(
    <CenterHStack gap="4">
      {land && <Flag size='S' country={country ? land : "XU"} />}
      {country ? country.label : countryCodeMap && land ? countryCodeMap[land as keyof typeof countryCodeMap] : land}
    </CenterHStack>
  )
}

export default FlagPanel
