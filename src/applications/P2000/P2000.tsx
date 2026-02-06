import React, {JSX, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode, Validation} from "src/declarations/app";
import {Box, Button, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {fetchBuc, getSed, resetPSED, setPSED, updatePSED} from "src/actions/buc";
import {resetValidation, setValidation} from 'src/actions/validation'
import { State } from "src/declarations/reducers";
import {P2000SED} from "src/declarations/p2000";
import _ from 'lodash'

import Verge from "./Verge/Verge";
import MainForm from "./MainForm";
import performValidation from "../../utils/performValidation";
import {validateP2000, ValidationP2000Props} from "./validateP2000";
import ValidationBox from "../../components/ValidationBox/ValidationBox";
import ForsikretPerson from "./ForsikretPerson/ForsikretPerson";
import Yrkesaktivitet from "./Yrkesaktivitet/Yrkesaktivitet";
import Ytelser from "./Ytelser/Ytelser";
import Ektefelle from "./Ektefelle/Ektefelle";
import Barn from "./Barn/Barn";
import InformasjonOmBetaling from "./InformasjonOmBetaling/InformasjonOmBetaling";
import SakInfo from "./SakInfo/SakInfo";
import Diverse from "./Diverse/Diverse";
import {resetEditingItems} from "src/actions/app";
import SEDAttachmentsPanel from "src/applications/BUC/components/SEDAttachmentsPanel/SEDAttachmentsPanel";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import SaveAndSendSED from "src/components/SaveAndSendSED/SaveAndSendSED";
import useUnmount from "src/hooks/useUnmount";
import styles from "src/assets/css/common.module.css";
import {createSelector} from "@reduxjs/toolkit";


export interface P2000Selector {
  currentPSED: P2000SED
  gettingSed: boolean
  validation: Validation
  aktoerId: string | null | undefined
}

const mapState = createSelector(
  (state: State) => state.buc.PSED as P2000SED,
  (state: State) => state.loading.gettingSed,
  (state: State) => state.validation.status,
  (state: State) => state.app.params.aktoerId,
  (currentPSED, gettingSed, validation, aktoerId): P2000Selector => ({
    currentPSED,
    gettingSed,
    validation,
    aktoerId
  })
)

export interface P2000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

const P2000: React.FC<P2000Props> = ({
  buc,
  sed,
  setMode
}: P2000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { currentPSED, gettingSed, validation, aktoerId }: P2000Selector = useSelector<State, P2000Selector>(mapState)
  const namespace = "p2000"

  const activeStatus: Array<string> = ['new', 'active']
  const sedCanHaveAttachments = (sed: Sed | undefined): boolean => {
    return !buc.readOnly && sed !== undefined && sed.allowsAttachments && _.includes(activeStatus, sed.status)
  }

  useUnmount(() => {
    dispatch(resetPSED())
  })

  useEffect(() => {
    if(sed){
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

  const validateP2000Sed = () => {
    const newP2000SED: P2000SED = _.cloneDeep(currentPSED)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationP2000Props>(clonedValidation, namespace, validateP2000, {
      P2000SED: newP2000SED
    })

    dispatch(setValidation(clonedValidation))

    return hasErrors
  }

  if(gettingSed){
    return(
      <div className={styles.waitingPanel}>
        <WaitingPanel size="2xlarge"/>
      </div>
    )
  }

  return (
    <>
      <VStack gap="4">
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
        <SakInfo PSED={currentPSED}/>
        <MainForm
          forms={[
            { label: "Forsikret person", value: 'forsikretperson', component: ForsikretPerson},
            { label: "Yrkesaktivitet", value: 'yrkesaktivitet', component: Yrkesaktivitet},
            { label: "Ytelser", value: 'ytelser', component: Ytelser},
            { label: "Ektefelle", value: 'ektefelle', component: Ektefelle},
            { label: "Barn", value: 'barn', component: Barn},
            { label: "Verge", value: 'verge', component: Verge},
            { label: "Informasjon om betaling", value: 'informasjonombetaling', component: InformasjonOmBetaling},
            { label: "Diverse", value: 'diverse', component: Diverse}
          ]}
          PSED={currentPSED}
          setPSED={setPSED}
          updatePSED={updatePSED}
          namespace={namespace}
        />
        <Box
          borderWidth="1"
          borderRadius="medium"
          borderColor="border-default"
          background="bg-default"
          padding="4"
        >
          <SEDAttachmentsPanel aktoerId={aktoerId} buc={buc} canHaveAttachments={sedCanHaveAttachments(currentPSED?.originalSed)} sed={sed!}/>
        </Box>
        <ValidationBox heading={t('message:error-validationbox-sedstart')} validation={validation} />
        <SaveAndSendSED
          namespace={namespace}
          sakId={buc!.caseId!}
          sedId={sed!.id}
          sedType={sed!.type}
          setMode={setMode}
          validateCurrentPSED={validateP2000Sed}
        />
      </VStack>
    </>
  )
}

export default P2000
