import React from "react";
import {FlexCenterDiv, HorizontalSeparatorDiv} from "@navikt/hoykontrast";
import Flag from "@navikt/flagg-ikoner";
import CountryData from "@navikt/land-verktoy";
import {State} from "src/declarations/reducers";
import {useAppSelector} from "src/store";

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
    <FlexCenterDiv>
      {land && <Flag size='S' country={country ? land : "XU"} />}
      <HorizontalSeparatorDiv />
      {country ? country.label : countryCodeMap && land ? countryCodeMap[land as keyof typeof countryCodeMap] : land}
    </FlexCenterDiv>
  )
}

export default FlagPanel
