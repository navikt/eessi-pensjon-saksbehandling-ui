import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode, Validation} from "src/declarations/app";
import {Box, Button, HStack, Loader} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {fetchBuc, getSed, saveSed, sendSed, setPSED, updatePSED} from "src/actions/buc";
import {resetValidation, setValidation} from 'src/actions/validation'
import { State } from "src/declarations/reducers";
import {P2000SED} from "src/declarations/p2000";
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
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
import SaveSEDModal from "./SaveSEDModal";
import Diverse from "./Diverse/Diverse";

export interface P2000Selector {
  PSEDChanged: boolean
  currentPSED: P2000SED
  savingSed: boolean
  sendingSed: boolean
  PSEDSendResponse: any | null | undefined
  gettingSed: boolean
  validation: Validation
}

const mapState = (state: State): P2000Selector => ({
  PSEDChanged: state.buc.PSEDChanged,
  currentPSED: state.buc.PSED as P2000SED,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  PSEDSendResponse: state.buc.PSEDSendResponse,
  gettingSed: state.loading.gettingSed,
  validation: state.validation.status,
})

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
  const { PSEDChanged, currentPSED, gettingSed, savingSed, sendingSed, PSEDSendResponse, validation }: P2000Selector = useSelector<State, P2000Selector>(mapState)
  const namespace = "p2000"

  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)
  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)

  const disableSave =  !PSEDChanged || savingSed
  const disableSend = !disableSave || sendingSed || (currentPSED?.originalSed?.status === "sent" && _.isEmpty(PSEDSendResponse)) || !_.isEmpty(PSEDSendResponse)

  useEffect(() => {
    if(sed){
      dispatch(getSed(buc.caseId!, sed))
    }

  }, [sed])

  useEffect(() => {
    if(_sendButtonClicked && !_.isNil(PSEDSendResponse)){
      dispatch(resetValidation(namespace))
      dispatch(fetchBuc(buc.caseId!))
      setMode('bucedit', 'back')
    }
  }, [_sendButtonClicked, PSEDSendResponse])

  const onBackClick = () => {
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  const onSaveSed = () => {
    const newP2000SED: P2000SED = _.cloneDeep(currentPSED)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationP2000Props>(clonedValidation, namespace, validateP2000, {
      P2000SED: newP2000SED
    })
    dispatch(setValidation(clonedValidation))
    if (!hasErrors) {
      setViewSaveSedModal(true)
      dispatch(saveSed(buc.caseId!, sed!.id, sed!.type, currentPSED))
    }
  }

  const onSendSed = () => {
    if (currentPSED) {
      const newP2000SED: P2000SED = _.cloneDeep(currentPSED)
      const clonedValidation = _.cloneDeep(validation)
      const hasErrors = performValidation<ValidationP2000Props>(clonedValidation, namespace, validateP2000, {
        P2000SED: newP2000SED
      })
      dispatch(setValidation(clonedValidation))

      if (!hasErrors) {
        _setSendButtonClicked(true)
        dispatch(sendSed(buc.caseId!, sed!.id))
      }
    }
  }

  if(gettingSed){
    return(
      <Loader/>
    )
  }

  return (
    <>
      <SaveSEDModal
        open={_viewSaveSedModal}
        onModalClose={() => {
          //dispatch(alertReset())
          setViewSaveSedModal(false)
        }}
      />
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
      <VerticalSeparatorDiv/>
      <SakInfo PSED={currentPSED}/>
      <VerticalSeparatorDiv/>
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
      <VerticalSeparatorDiv/>
      <ValidationBox heading={t('message:error-validationbox-sedstart')} validation={validation} />
      <VerticalSeparatorDiv/>
      <Box
        as="header"
        borderWidth="1"
        borderRadius="medium"
        borderColor="border-default"
        background="bg-default"
        padding="4"
      >
        <HStack gap="4">
          <Button
            variant='primary'
            onClick={onSaveSed}
            loading={savingSed}
            disabled={disableSave}
          >
            {t('ui:save-sed')}
          </Button>
          <Button
            variant='primary'
            onClick={onSendSed}
            loading={false}
            disabled={disableSend}
          >
            {sendingSed ? t('message:loading-sendingSed') : t('ui:send-sed')}
          </Button>
        </HStack>
      </Box>
    </>
  )
}

export default P2000
