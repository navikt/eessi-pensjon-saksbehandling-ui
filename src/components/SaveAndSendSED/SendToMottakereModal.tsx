import {useTranslation} from "react-i18next";
import Modal from "src/components/Modal/Modal";
import {Box, Button, Checkbox, ErrorMessage, HStack, VStack} from "@navikt/ds-react";
import React, {Dispatch, JSX, SetStateAction, useState} from "react";
import _ from "lodash";
import {Institutions} from "src/declarations/buc";

interface SendToDeltakereModalProps {
  onModalClose: () => void
  open: boolean
  mottakere: Institutions
  valgteMottakere: Array<string> | undefined
  setValgteMottakere: Dispatch<SetStateAction<Array<string> | undefined>>
  onSendSed: () => void
}

const SendToDeltakereModal: React.FC<SendToDeltakereModalProps> = ({
  onModalClose,
  open,
  mottakere,
  valgteMottakere,
  setValgteMottakere,
  onSendSed
}: SendToDeltakereModalProps): JSX.Element => {
  const { t } = useTranslation()
  const [_invalid, setInvalid] = useState<boolean>(false)

  const changeValgteMottakere = (mottaker: string, checked: boolean) => {
    let newValgteMottakere = _.cloneDeep(valgteMottakere)
    if (checked) {
      newValgteMottakere = newValgteMottakere!.concat(mottaker)
    } else {
      newValgteMottakere = _.filter(newValgteMottakere, _d => _d !== mottaker)
    }
    setValgteMottakere(newValgteMottakere)
  }

  const sendSed = () => {
    if(valgteMottakere && valgteMottakere?.length > 0){
      setInvalid(false)
      onSendSed()
    } else {
      setInvalid(true)
    }
  }

  const onClose = () => {
    setInvalid(false)
    onModalClose()
  }

  return (
    <Modal
      open={open}
      width="600px"
      header={t('ui:send-til-valgte-mottakere')}
      modal={{
        modalContent: (
          <VStack gap="4">
            <Box borderWidth={_invalid ? "2" : "1"} borderColor={_invalid ? "border-danger" : "border-subtle"} padding="4">
              {mottakere?.map((m) => {
                return(
                  <Checkbox
                    value={m.institution}
                    checked={_.find(valgteMottakere, _m => _m === m.institution) !== undefined}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeValgteMottakere(m.institution, e.target.checked)}
                  >
                    {m.name}
                  </Checkbox>
                )
              })}
            </Box>
            {_invalid &&
              <ErrorMessage showIcon={true}>{t('validation:missing-mottakere')}</ErrorMessage>
            }
            <HStack gap="4">
              <Button
                variant='primary'
                onClick={sendSed}
              >
                {t('ui:send-sed')}
              </Button>
              <Button
                variant='secondary'
                onClick={onClose}
              >
                {t('ui:close')}
              </Button>
            </HStack>
          </VStack>

        )
      }}
      onModalClose={onClose}
    />
  )
}

export default SendToDeltakereModal
