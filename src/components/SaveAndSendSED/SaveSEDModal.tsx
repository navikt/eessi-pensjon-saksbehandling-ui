import {JSX} from 'react'
import { State } from 'src/declarations/reducers'
import {useAppSelector} from 'src/store'
import {useTranslation} from "react-i18next";
import Modal from "src/components/Modal/Modal";
import * as types from 'src/constants/actionTypes'
import {Alert, Box, Button, HStack, Loader, Spacer, VStack} from "@navikt/ds-react";
import {CheckmarkCircleFillIcon} from "@navikt/aksel-icons";
import styles from './SaveSEDModal.module.css'

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
          <div className={styles.minimalModalDiv}>
            {alertMessage && alertType && [types.BUC_PUT_SED_FAILURE].indexOf(alertType) >= 0 && (
              <VStack gap="4">
                <div className={styles.alertstripeDiv}>
                  <Alert variant='error'>{alertMessage}</Alert>
                </div>
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

            <div className={styles.minimalContentDiv}>
              <div className={styles.sectionDiv}>
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
              </div>
              <div className={styles.sectionDiv}>
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
              </div>
            </div>
          </div>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SaveSEDModal
