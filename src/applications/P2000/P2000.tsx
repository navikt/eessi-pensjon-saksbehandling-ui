import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Buc, Sed} from "../../declarations/buc";
import {BUCMode, Validation} from "../../declarations/app";
import {Button, Heading, Loader} from "@navikt/ds-react";
import {BackFilled} from "@navikt/ds-icons";
import {HorizontalSeparatorDiv} from "@navikt/hoykontrast";
import {getSed, saveSed, setPSED, updatePSED} from "actions/buc";
import {resetValidation, setValidation} from 'actions/validation'
import { State } from "../../declarations/reducers";
import {P2000SED} from "../../declarations/p2000";
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

export interface P2000Selector {
  currentPSED: P2000SED
  savingSed: boolean
  gettingSed: boolean
  validation: Validation
}

const mapState = (state: State): P2000Selector => ({
  currentPSED: state.buc.PSED as P2000SED,
  savingSed: state.loading.savingSed,
  gettingSed: state.loading.gettingSed,
  validation: state.validation.status
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
  const { currentPSED, gettingSed, savingSed, validation }: P2000Selector = useSelector<State, P2000Selector>(mapState)
  const namespace = "p2000"

  useEffect(() => {
    if(sed){
      dispatch(getSed(buc.caseId!, sed))
    }

  }, [sed])

  const onBackClick = () => {
    dispatch(resetValidation(namespace))
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
      dispatch(saveSed(buc.caseId!, sed!.id, sed!.type, currentPSED))
    }
  }

  if(gettingSed){
    return(
      <Loader/>
    )
  }

  return (
    <>
      <div style={{ display: 'inline-block' }}>
        <Button
          variant='secondary'
          onClick={onBackClick}
        >
          <BackFilled />
          <HorizontalSeparatorDiv size='0.25' />
          <span>
            {t('ui:back')}
          </span>
        </Button>
      </div>
      <Heading size={"medium"}>P2000</Heading>
      <MainForm
        forms={[
          { label: "Forsikret person", value: 'forsikretperson', component: ForsikretPerson},
          { label: "Yrkesaktivitet", value: 'yrkesaktivitet', component: Yrkesaktivitet},
          { label: "Ytelser", value: 'ytelser', component: Ytelser},
          { label: "Verge", value: 'verge', component: Verge}
        ]}
        PSED={currentPSED}
        setPSED={setPSED}
        updatePSED={updatePSED}
        namespace={namespace}
      />
      <VerticalSeparatorDiv/>
      <ValidationBox heading={t('message:error-validationbox-sedstart')} validation={validation} />
      <VerticalSeparatorDiv/>
      <Button
        variant='primary'
        onClick={onSaveSed}
        loading={savingSed}
      >
        Lagre i RINA
      </Button>
    </>
  )
}

export default P2000
