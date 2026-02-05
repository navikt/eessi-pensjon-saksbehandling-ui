import React, {JSX, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import SaveSEDModal from "src/components/SaveAndSendSED/SaveSEDModal";
import {Box, Button, HStack, VStack} from "@navikt/ds-react";
import PreviewSED from "src/components/PreviewSED/PreviewSED";
import {P2000SED} from "src/declarations/p2000";
import {P8000SED} from "src/declarations/p8000";
import _, {cloneDeep} from "lodash";
import {fetchBuc, saveSed, sendSed, sendSedTo} from "src/actions/buc";
import {State} from "src/declarations/reducers";
import WarningModal from "src/components/SaveAndSendSED/WarningModal";
import {resetValidation} from "src/actions/validation";
import {resetEditingItems} from "src/actions/app";
import {BUCMode} from "src/declarations/app";
import {Institutions, Participant} from "src/declarations/buc";
import SendToMottakereModal from "src/components/SaveAndSendSED/SendToMottakereModal";

export interface SaveAndSendSEDProps {
  validateCurrentPSED: () => boolean
  sakId: string,
  sedId: string
  sedType: string
  namespace: string
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  mottakere?: Institutions
}

export interface SaveAndSendSelector {
  PSEDChanged: boolean
  currentPSED: P2000SED | P8000SED
  savingSed: boolean
  sendingSed: boolean
  PSEDSendResponse: any | null | undefined
  PSEDSavedResponse: any | null | undefined
  editingItems: any
}

const mapState = (state: State): SaveAndSendSelector => ({
  PSEDChanged: state.buc.PSEDChanged,
  currentPSED: state.buc.PSED,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  PSEDSendResponse: state.buc.PSEDSendResponse,
  PSEDSavedResponse: state.buc.PSEDSavedResponse,
  editingItems: state.app.editingItems,
}) as SaveAndSendSelector

const SaveAndSendSED: React.FC<SaveAndSendSEDProps> = ({
  namespace, sakId, sedId, sedType, validateCurrentPSED, setMode, mottakere
}: SaveAndSendSEDProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { PSEDChanged, currentPSED, savingSed, sendingSed, PSEDSendResponse, PSEDSavedResponse, editingItems = {} }: SaveAndSendSelector = useSelector<State, SaveAndSendSelector>(mapState)

  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const [_viewWarningModal, setViewWarningModal] = useState<boolean>(false)
  const [_viewSendToMottakereModal, setViewSendToMottakereModal] = useState<boolean>(false)
  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)

  const avsender: Participant | undefined = currentPSED?.originalSed?.participants?.find((p: Participant) => {return p.role.toLowerCase() === "sender"})
  const mottakereUtenAvsender = mottakere?.filter((m) => {return m.institution !== avsender?.organisation.id})
  const [valgteMottakere, setValgteMottakere] = useState<Array<string> | undefined>(mottakereUtenAvsender?.map((d) => {return d.institution}))

  const disableSave =  !PSEDChanged || savingSed
  const disableSend = !disableSave || sendingSed || (currentPSED?.originalSed?.status === "sent" && _.isEmpty(PSEDSavedResponse)) || !_.isEmpty(PSEDSendResponse)

  useEffect(() => {
    if(_sendButtonClicked && !_.isNil(PSEDSendResponse)){
      dispatch(resetEditingItems())
      dispatch(resetValidation(namespace))
      dispatch(fetchBuc(sakId))
      setMode('bucedit', 'back')
    }
  }, [_sendButtonClicked, PSEDSendResponse])

  const onSaveSed = () => {
    if(Object.keys(editingItems).length > 0){
      setViewWarningModal(true)
      return
    } else {
      setViewWarningModal(false)
    }

    const hasErrors = validateCurrentPSED()

    let PSEDToSave = cloneDeep(currentPSED)
    if(PSEDToSave.options){
      const encodeOptionsString = encodeURI(JSON.stringify(currentPSED.options))
      PSEDToSave = {
        ...PSEDToSave,
        options: encodeOptionsString
      }
    }

    if (!hasErrors) {
      setViewSaveSedModal(true)
      dispatch(saveSed(sakId, sedId, sedType, PSEDToSave))
    }
  }

  const onSendSed = () => {
    if (currentPSED) {
      const hasErrors = validateCurrentPSED()

      if (!hasErrors) {
        _setSendButtonClicked(true)
        if(valgteMottakere){
          setViewSendToMottakereModal(false)
          dispatch(sendSedTo(sakId, sedId, valgteMottakere))
        } else {
          dispatch(sendSed(sakId, sedId))
        }
      }
    }
  }

  const onSendSedToMottakere = () => {
    setViewSendToMottakereModal(true)
  }

  return (
    <>
      <SaveSEDModal
        open={_viewSaveSedModal}
        onModalClose={() => {
          setViewSaveSedModal(false)
        }}
      />
      {mottakereUtenAvsender   &&
        <SendToMottakereModal
          onModalClose={() => setViewSendToMottakereModal(false)}
          open={_viewSendToMottakereModal}
          mottakere={mottakereUtenAvsender}
          valgteMottakere={valgteMottakere}
          setValgteMottakere={setValgteMottakere}
          onSendSed={onSendSed}
        />
      }
      <WarningModal open={_viewWarningModal} onModalClose={() => setViewWarningModal(false)} elementKeys={Object.keys(editingItems)}/>
      <Box
        borderWidth="1"
        borderRadius="medium"
        borderColor="border-default"
        background="bg-default"
        padding="4"
      >
        <VStack gap="4">
          <HStack><PreviewSED PSED={currentPSED}/></HStack>
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
              onClick={mottakere ? onSendSedToMottakere : onSendSed}
              loading={false}
              disabled={disableSend}
            >
              {sendingSed ? t('message:loading-sendingSed') : t('ui:send-sed')}
            </Button>
          </HStack>
        </VStack>
      </Box>
    </>
  )
}

export default SaveAndSendSED
