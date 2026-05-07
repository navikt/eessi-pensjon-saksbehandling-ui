import React, {useMemo} from "react";
import CountrySelect, {CountrySelectProps} from "@navikt/landvelger";
import {State} from "src/declarations/reducers";
import {useAppSelector} from "src/store";
import {CurrencyCodeLists, CurrencyCodes, SimpleCurrency} from "src/declarations/app";
import {Bucs} from "src/declarations/buc";
import {createSelector} from "@reduxjs/toolkit";

export interface CurrencyDropdownSelector {
  currentBuc: string | undefined
  bucs: Bucs | undefined
  currencyCodes: CurrencyCodes | undefined
}

const mapState = createSelector(
  (state: State) => state.buc.currentBuc,
  (state: State) => state.buc.bucs,
  (state: State) => state.app.currencyCodes,
  (currentBuc, bucs, currencyCodes): CurrencyDropdownSelector => ({
    currentBuc,
    bucs,
    currencyCodes
  })
)

export interface CurrencyDropdownProps extends CountrySelectProps<any>{
  dataTestId?: string
  currencyCodeListName?: keyof CurrencyCodeLists
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  currencyCodeListName = 'verdensValuta',
  dataTestId,
  ...rest
}: CurrencyDropdownProps) => {

  const {bucs, currentBuc, currencyCodes} = useAppSelector(mapState)
  const cdmVersion = "v" + bucs![currentBuc!].cdm

  const currencyCodesByVersion: CurrencyCodeLists | undefined = currencyCodes
    ? currencyCodes[cdmVersion as keyof CurrencyCodes]
    : undefined

  const includeList = useMemo(() => {
    if (currencyCodeListName && currencyCodesByVersion) {
      return currencyCodesByVersion[currencyCodeListName].map((c: SimpleCurrency) => c.valutakode)
    }
    return rest.includeList
  }, [currencyCodeListName, currencyCodesByVersion, rest.includeList])

  return(
    <CountrySelect
      {...rest}
      type='currency'
      menuPortalTarget={document.body}
      data-testid={dataTestId}
      includeList={includeList}
    />
  )
}

export default CurrencyDropdown
