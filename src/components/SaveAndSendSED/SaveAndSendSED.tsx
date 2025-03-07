import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import SaveSEDModal from "src/components/SaveAndSendSED/SaveSEDModal";
import {Box, Button, HStack, VStack} from "@navikt/ds-react";
import PreviewSED from "src/components/PreviewSED/PreviewSED";
import {P2000SED} from "src/declarations/p2000";
import {P8000SED} from "src/declarations/p8000";
import _ from "lodash";
import {fetchBuc, saveSed, sendSed} from "src/actions/buc";
import {State} from "src/declarations/reducers";
import WarningModal from "src/applications/P2000/WarningModal";
import {resetValidation} from "src/actions/validation";
import {resetEditingItems} from "src/actions/app";
import {BUCMode} from "src/declarations/app";

export interface SaveAndSendSEDProps {
  validateCurrentPSED: () => boolean
  sakId: string,
  sedId: string
  sedType: string
  namespace: string
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
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
})

const SaveAndSendSED: React.FC<SaveAndSendSEDProps> = ({
  namespace, sakId, sedId, sedType, validateCurrentPSED, setMode
}: SaveAndSendSEDProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { PSEDChanged, currentPSED, savingSed, sendingSed, PSEDSendResponse, PSEDSavedResponse, editingItems }: SaveAndSendSelector = useSelector<State, SaveAndSendSelector>(mapState)

  const [_viewSaveSedModal, setViewSaveSedModal] = useState<boolean>(false)
  const [_viewWarningModal, setViewWarningModal] = useState<boolean>(false)
  const [_sendButtonClicked, _setSendButtonClicked] = useState<boolean>(false)

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

    if (!hasErrors) {
      setViewSaveSedModal(true)
      dispatch(saveSed(sakId, sedId, sedType, currentPSED))
    }
  }

  const onSendSed = () => {
    if (currentPSED) {
      const hasErrors = validateCurrentPSED()

      if (!hasErrors) {
        _setSendButtonClicked(true)
        dispatch(sendSed(sakId, sedId))
      }
    }
  }


  return (
    <>
      <SaveSEDModal
        open={_viewSaveSedModal}
        onModalClose={() => {
          setViewSaveSedModal(false)
        }}
      />
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
              onClick={onSendSed}
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
