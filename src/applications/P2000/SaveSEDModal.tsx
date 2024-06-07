import { State } from 'declarations/reducers'
import {useAppSelector} from 'store'
import {useTranslation} from "react-i18next";
import Modal from "components/Modal/Modal";
import styled from "styled-components";
import * as types from 'constants/actionTypes'
import {Alert, Button, Loader} from "@navikt/ds-react";
import {
  FlexCenterSpacedDiv,
  PileCenterDiv,
  VerticalSeparatorDiv,
  PileDiv,
  HorizontalSeparatorDiv,

} from '@navikt/hoykontrast'
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
  alertType: state.alert.type,
  savingSed: state.loading.savingSed,
})

const SaveSEDModal: React.FC<SaveSEDModalProps> = ({
  onModalClose,
  open,
}: SaveSEDModalProps): JSX.Element => {
  const {alertMessage, bannerMessage, alertType, savingSed}: SaveSEDSelector = useAppSelector(mapState)
  const { t } = useTranslation()


  return (
    <Modal
      open={open}
      header={t('ui:save-sed')}
      modal={{
        modalContent: (
          <MinimalModalDiv>
            {alertMessage && alertType && [types.BUC_PUT_SED_FAILURE].indexOf(alertType) >= 0 && (
              <PileCenterDiv>
                <AlertstripeDiv>
                  <Alert variant='error'>{alertMessage}</Alert>
                </AlertstripeDiv>
                <VerticalSeparatorDiv />
                <FlexCenterSpacedDiv>
                  <div />
                  <Button
                    variant='secondary'
                    onClick={onModalClose}
                  >
                    {t('ui:damn-really')}
                  </Button>
                  <div />
                </FlexCenterSpacedDiv>
              </PileCenterDiv>
            )}
            {bannerMessage && (
              <>
                <Alert variant='error'>
                  {bannerMessage}
                </Alert>
                <VerticalSeparatorDiv size='2' />
              </>
            )}
            <MinimalContentDiv>
              <SectionDiv>
                <PileDiv style={{ alignItems: 'flex-start' }}>
                  <div>
                    {savingSed && (
                      <FlexCenterSpacedDiv>
                        <Loader type='xsmall' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-lagrer-sed')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                    {!savingSed && (
                      <FlexCenterSpacedDiv>
                        <CheckmarkCircleFillIcon color='green' />
                        <HorizontalSeparatorDiv size='0.5' />
                        <span>{t('message:loading-sed-lagret')}</span>
                      </FlexCenterSpacedDiv>
                    )}
                  </div>
                  <VerticalSeparatorDiv size='0.5' />
                </PileDiv>
              </SectionDiv>
              <SectionDiv>
                {!savingSed && (
                  <FlexCenterSpacedDiv>
                    <Button
                      variant='secondary'
                      onClick={onModalClose}
                    >
                      {t('ui:close')}
                    </Button>
                  </FlexCenterSpacedDiv>
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
