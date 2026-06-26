import {Buc, Sed} from "src/declarations/buc";
import {BUCMode} from "src/declarations/app";
import React, {JSX} from "react";
import {Button, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {resetEditingItems} from "src/actions/app";
import {resetValidation} from "src/actions/validation";
import {fetchBuc} from "src/actions/buc";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {X009SED} from "src/declarations/x009";
import {createSelector} from "@reduxjs/toolkit";
import {State} from "src/declarations/reducers";

export interface X009Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface X009Selector {
  currentPSED: X009SED
}

const mapState = createSelector(
  (state: State) => state.buc.PSED as X009SED,
  (currentPSED): X009Selector => ({
    currentPSED
  })
)

const X009: React.FC<X009Props> = ({buc, setMode}: X009Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { }: X009Selector = useSelector<State, X009Selector>(mapState)
  const namespace = "x009"

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  return (
    <>
      <VStack gap="space-16">
        <div style={{ display: 'inline-block' }}>
          <Button
            variant='secondary'
            onClick={onBackClick}
            iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
          >
            <span>
              {t('ui:back')}
            </span>
          </Button>
        </div>
      </VStack>
    </>
  )
}
export default X009
