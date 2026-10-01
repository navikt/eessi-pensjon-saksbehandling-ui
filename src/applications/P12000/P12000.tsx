import React, {JSX, useEffect} from "react";
import {Button, HGrid, HStack, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {fetchBuc, getSed, resetPSED, setPSED, updatePSED} from "src/actions/buc";
import {resetEditingItems} from "src/actions/app";
import {resetValidation, setValidation} from "src/actions/validation";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode, Validation} from "src/declarations/app";
import {P12000SED} from "src/declarations/p12000";
import {State} from "src/declarations/reducers";
import styles from "src/assets/css/common.module.css";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import useUnmount from "src/hooks/useUnmount";
import SEDDetails from "src/components/SEDDetails/SEDDetails";
import SakInfo from "src/components/SakInfo/SakInfo";
import TextArea from "src/components/Forms/TextArea";
import MainForm from "src/applications/MainForm";
import ValidationBox from "src/components/ValidationBox/ValidationBox";
import SaveAndSendSED from "src/components/SaveAndSendSED/SaveAndSendSED";
import performValidation from "src/utils/performValidation";
import {validateP12000, ValidationP12000Props} from "./validateP12000";
import MottakerAvGjenlevendePensjon from "./MottakerAvGjenlevendePensjon/MottakerAvGjenlevendePensjon";
import InformasjonOmPensjon from "./InformasjonOmPensjon/InformasjonOmPensjon";
import {createSelector} from "@reduxjs/toolkit";
import _ from "lodash";

export interface P12000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P12000Selector {
  currentPSED: P12000SED
  gettingSed: boolean
  validation: Validation
}

const mapState = createSelector(
  (state: State) => state.buc.PSED as P12000SED,
  (state: State) => state.loading.gettingSed,
  (state: State) => state.validation.status,
  (currentPSED, gettingSed, validation): P12000Selector => ({
    currentPSED,
    gettingSed,
    validation
  })
)

const P12000: React.FC<P12000Props> = ({buc, sed, setMode}: P12000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {currentPSED, gettingSed, validation}: P12000Selector = useSelector<State, P12000Selector>(mapState)
  const namespace = "p12000"

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

  const setYtterligereInformasjon = (ytterligereInformasjon: string) => {
    dispatch(updatePSED('pensjon.ytterligereInformasjon', ytterligereInformasjon))
    if (validation[namespace + '-ytterligereInformasjon']) {
      dispatch(resetValidation(namespace + '-ytterligereInformasjon'))
    }
  }

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  const validateP12000Sed = () => {
    const newP12000SED: P12000SED = _.cloneDeep(currentPSED)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationP12000Props>(clonedValidation, namespace, validateP12000, {
      P12000SED: newP12000SED
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
          iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
        >
          {t('ui:back')}
        </Button>
      </HStack>
      <HGrid columns="1fr 400px" gap="space-16" align="start">
        <VStack gap="space-16">
          <SakInfo PSED={currentPSED} title="P12000"/>
          <MainForm
            forms={[
              { label: "Informasjon om pensjon", value: 'informasjonompensjon', component: InformasjonOmPensjon},
              { label: "Mottaker av gjenlevendepensjon", value: 'mottakeravgjenlevendepensjon', component: MottakerAvGjenlevendePensjon}
            ]}
            PSED={currentPSED}
            setPSED={setPSED}
            updatePSED={updatePSED}
            namespace={namespace}
          />
          <TextArea
            namespace={namespace}
            error={validation[namespace + '-ytterligereInformasjon']?.feilmelding}
            id='ytterligereInformasjon'
            label={t('p12000:form-ytterligereinformasjon')}
            onChanged={setYtterligereInformasjon}
            value={currentPSED?.pensjon?.ytterligereInformasjon ?? ''}
            maxLength={500}
          />
          <ValidationBox heading={t('message:error-validationbox-sedstart')} validation={validation}/>
          <SaveAndSendSED
            namespace={namespace}
            sakId={buc!.caseId!}
            sedId={sed!.id}
            sedType={sed!.type}
            setMode={setMode}
            validateCurrentPSED={validateP12000Sed}
          />
        </VStack>
        {sed && (
          <SEDDetails sed={sed}/>
        )}
      </HGrid>
    </VStack>
  )
}

export default P12000
