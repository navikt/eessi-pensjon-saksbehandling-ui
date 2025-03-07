import { State } from 'src/declarations/reducers'
import {useAppSelector} from 'src/store'
import {useTranslation} from "react-i18next";
import Modal from "src/components/Modal/Modal";
import styled from "styled-components";
import * as types from 'src/constants/actionTypes'
import {Alert, Box, Button, HStack, Loader, Spacer, VStack} from "@navikt/ds-react";
import {CheckmarkCircleFillIcon} from "@navikt/aksel-icons";

const MinimalModalDiv = styled.div`
  min-height: 200px;
  min-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`
const MinimalContentDiv = styled.div`
  flex: 1;
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
`

export const AlertstripeDiv = styled.div`
  margin: 0.5rem;
  min-width: 50%;
`

const SectionDiv = styled.div`
  flex: 1;
  align-items: stretch;
  flex-direction: row;
  display: flex;
  justify-content: center;
`

interface SaveSEDSelector {
  alertMessage: JSX.Element | string | undefined
  bannerMessage: JSX.Element | string | undefined
  bannerStatus: string | undefined
  alertType: string | undefined
  savingSed: boolean
}

interface SaveSEDModalProps {
  onModalClose: () => void
  open: boolean
}

const mapState = (state: State): SaveSEDSelector => ({
  alertMessage: state.alert.stripeMessage,
  bannerMessage: state.alert.bannerMessage,
  bannerStatus: state.alert.bannerStatus,
  alertType: state.alert.type,
  savingSed: state.loading.savingSed,
})

const SaveSEDModal: React.FC<SaveSEDModalProps> = ({
  onModalClose,
  open,
}: SaveSEDModalProps): JSX.Element => {
  const {alertMessage, bannerStatus, alertType, savingSed}: SaveSEDSelector = useAppSelector(mapState)
  const { t } = useTranslation()


  return (
    <Modal
      open={open}
      header={t('ui:save-sed')}
      modal={{
        modalContent: (
          <MinimalModalDiv>
            {alertMessage && alertType && [types.BUC_PUT_SED_FAILURE].indexOf(alertType) >= 0 && (
              <VStack gap="4">
                <AlertstripeDiv>
                  <Alert variant='error'>{alertMessage}</Alert>
                </AlertstripeDiv>
                <HStack>
                  <Spacer/>
                  <Button
                    variant='secondary'
                    onClick={onModalClose}
                  >
                    {t('ui:damn-really')}
                  </Button>
                  <Spacer/>
                </HStack>
              </VStack>
            )}

            <MinimalContentDiv>
              <SectionDiv>
                <VStack style={{ alignItems: 'flex-start' }}>
                  <div>
                    {savingSed && (
                      <HStack gap="4">
                        <Loader type='xsmall' />
                        <span>{t('message:loading-lagrer-sed')}</span>
                      </HStack>
                    )}
                    {!savingSed && bannerStatus !== 'error' && (
                      <HStack gap="4">
                        <CheckmarkCircleFillIcon color='green' />
                        <span>{t('message:loading-sed-lagret')}</span>
                      </HStack>
                    )}
                  </div>
                </VStack>
              </SectionDiv>
              <SectionDiv>
                {!savingSed &&  bannerStatus !== 'error' && (
                  <Box>
                    <Button
                      variant='secondary'
                      onClick={onModalClose}
                    >
                      {t('ui:close')}
                    </Button>
                  </Box>
                )}
              </SectionDiv>
            </MinimalContentDiv>
          </MinimalModalDiv>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SaveSEDModal
