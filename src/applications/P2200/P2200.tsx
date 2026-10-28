import React, { JSX, useEffect } from "react";
import { Button, HGrid, HStack, VStack } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchBuc, getSed, resetPSED } from "src/actions/buc";
import { resetEditingItems } from "src/actions/app";
import { resetValidation } from "src/actions/validation";
import { Buc, Sed } from "src/declarations/buc";
import { BUCMode, Validation } from "src/declarations/app";
import { P2200SED } from "src/declarations/p2200";
import { State } from "src/declarations/reducers";
import styles from "src/assets/css/common.module.css";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import useUnmount from "src/hooks/useUnmount";
import { createSelector } from "@reduxjs/toolkit";
import _ from "lodash";
import { setPSED, updatePSED } from "src/actions/buc";
import { setValidation } from "src/actions/validation";
import MainForm from "src/applications/MainForm";
import SakInfo from "src/components/SakInfo/SakInfo";
import ForsikretPerson from "src/components/ForsikretPerson/ForsikretPerson";
import Yrkesaktivitet from "src/components/Yrkesaktivitet/Yrkesaktivitet";
import Ytelser from "src/components/Ytelser/Ytelser";
import Ektefelle from "src/components/Ektefelle/Ektefelle";
import Barn from "src/components/Barn/Barn";
import Verge from "src/components/Verge/Verge";
import InformasjonOmBetaling from "src/components/InformasjonOmBetaling/InformasjonOmBetaling";
import Diverse from "src/components/Diverse/Diverse";
import ValidationBox from "src/components/ValidationBox/ValidationBox";
import SaveAndSendSED from "src/components/SaveAndSendSED/SaveAndSendSED";
import SEDDetails from "src/components/SEDDetails/SEDDetails";
import performValidation from "src/utils/performValidation";
import { validateP2200, ValidationP2200Props } from "./validateP2200";

export interface P2200Props {
  buc: Buc
  sed?: Sed
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P2200Selector {
  currentPSED: P2200SED
  gettingSed: boolean
  validation: Validation
}

const mapState = createSelector(
  (state: State) => state.buc.PSED as P2200SED,
  (state: State) => state.loading.gettingSed,
  (state: State) => state.validation.status,
  (currentPSED, gettingSed, validation): P2200Selector => ({ currentPSED, gettingSed, validation })
)

const P2200: React.FC<P2200Props> = ({ buc, sed, setMode }: P2200Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { currentPSED, gettingSed, validation }: P2200Selector = useSelector<State, P2200Selector>(mapState)
  const namespace = "p2200"

  useUnmount(() => {
    dispatch(resetPSED())
  })

  useEffect(() => {
    if (sed) {
      dispatch(resetEditingItems())
      dispatch(resetValidation("p2200"))
      dispatch(getSed(buc.caseId!, sed))
    }
  }, [sed])

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode("bucedit", "back")
  }

  const validateP2200Sed = () => {
    const newP2200SED: P2200SED = _.cloneDeep(currentPSED)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationP2200Props>(clonedValidation, namespace, validateP2200, {
      P2200SED: newP2200SED
    })

    dispatch(setValidation(clonedValidation))

    return hasErrors
  }

  if (gettingSed) {
    return (
      <div className={styles.waitingPanel}>
        <WaitingPanel size="2xlarge" />
      </div>
    )
  }

  return (
    <VStack gap="space-16">
      <HStack>
        <Button
          variant="secondary"
          onClick={onBackClick}
          iconPosition="left"
          icon={<ChevronLeftIcon aria-hidden />}
        >
          {t("ui:back")}
        </Button>
      </HStack>
      <HGrid columns="1fr 400px" gap="space-16" align="start">
        <VStack gap="space-16">
          <SakInfo PSED={currentPSED} title="P2200"/>
          <MainForm
            forms={[
              { label: "Forsikret person", value: "forsikretperson", component: ForsikretPerson },
              { label: "Yrkesaktivitet", value: "yrkesaktivitet", component: Yrkesaktivitet },
              { label: "Ytelser", value: "ytelser", component: Ytelser },
              { label: "Ektefelle", value: "ektefelle", component: Ektefelle },
              { label: "Barn", value: "barn", component: Barn },
              { label: "Verge", value: "verge", component: Verge },
              { label: "Informasjon om betaling", value: "informasjonombetaling", component: InformasjonOmBetaling },
              { label: "Diverse", value: "diverse", component: Diverse }
            ]}
            PSED={currentPSED}
            setPSED={setPSED}
            updatePSED={updatePSED}
            namespace={namespace}
          />
          <ValidationBox heading={t("message:error-validationbox-sedstart")} validation={validation}/>
          <SaveAndSendSED
            namespace={namespace}
            sakId={buc.caseId!}
            sedId={sed!.id}
            sedType={sed!.type}
            setMode={setMode}
            validateCurrentPSED={validateP2200Sed}
          />
        </VStack>
        {sed && <SEDDetails sed={sed}/>}
      </HGrid>
    </VStack>
  )
}

export default P2200
