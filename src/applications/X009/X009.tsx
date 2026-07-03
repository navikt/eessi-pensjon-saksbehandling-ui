import React, {JSX, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode, Validation} from "src/declarations/app";
import {Button, HGrid, HStack, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {fetchBuc, getSed, resetPSED, updatePSED} from "src/actions/buc";
import {resetValidation, setValidation} from 'src/actions/validation'
import {State} from "src/declarations/reducers";
import {X009SED} from "src/declarations/x009";
import _ from 'lodash'
import {createSelector} from "@reduxjs/toolkit";

import Paaminnelse from "./Paaminnelse/Paaminnelse";
import performValidation from "src/utils/performValidation";
import {validateX009, ValidationX009Props} from "./validateX009";
import ValidationBox from "src/components/ValidationBox/ValidationBox";
import {resetEditingItems} from "src/actions/app";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import SaveAndSendSED from "src/components/SaveAndSendSED/SaveAndSendSED";
import SEDDetails from "src/components/SEDDetails/SEDDetails";
import useUnmount from "src/hooks/useUnmount";
import styles from "src/assets/css/common.module.css";

export interface X009Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface X009Selector {
  currentPSED: X009SED
  gettingSed: boolean
  validation: Validation
}

const mapState = createSelector(
  (state: State) => state.buc.PSED as X009SED,
  (state: State) => state.loading.gettingSed,
  (state: State) => state.validation.status,
  (currentPSED, gettingSed, validation): X009Selector => ({
    currentPSED,
    gettingSed,
    validation
  })
)

const X009: React.FC<X009Props> = ({
  buc,
  sed,
  setMode
}: X009Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {currentPSED, gettingSed, validation}: X009Selector = useSelector<State, X009Selector>(mapState)
  const namespace = "x009"

  useUnmount(() => {
    dispatch(resetPSED())
  })

  useEffect(() => {
    if (sed) {
      dispatch(resetEditingItems())
      dispatch(resetValidation(namespace))
      dispatch(getSed(buc.caseId!, sed))
    }
  }, [sed])

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  const validateX009Sed = () => {
    const newX009SED: X009SED = _.cloneDeep(currentPSED)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationX009Props>(clonedValidation, namespace, validateX009, {
      X009SED: newX009SED
    })

    dispatch(setValidation(clonedValidation))

    return hasErrors
  }

  if (gettingSed) {
    return (
      <div className={styles.waitingPanel}>
        <WaitingPanel size="2xlarge"/>
      </div>
    )
  }

  return (
    <VStack gap="space-16">
      <HStack>
        <Button
          variant='secondary'
          onClick={onBackClick}
          iconPosition="left" icon={<ChevronLeftIcon aria-hidden/>}
        >
          {t('ui:back')}
        </Button>
      </HStack>
      <HGrid columns="1fr 400px" gap="space-8" align="start">
        <VStack gap="space-16">
          <Paaminnelse
            label={t('x009:form-paaminnelser')}
            parentNamespace={namespace}
            PSED={currentPSED}
            updatePSED={updatePSED}
          />
          <ValidationBox heading={t('message:error-validationbox-sedstart')} validation={validation}/>
          <SaveAndSendSED
            namespace={namespace}
            sakId={buc!.caseId!}
            sedId={sed!.id}
            sedType={sed!.type}
            setMode={setMode}
            validateCurrentPSED={validateX009Sed}
          />
        </VStack>
        {sed && (
          <SEDDetails sed={sed}/>
        )}
      </HGrid>
    </VStack>
  );
}

export default X009
