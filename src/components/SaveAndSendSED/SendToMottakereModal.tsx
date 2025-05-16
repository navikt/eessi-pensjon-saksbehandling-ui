import {useTranslation} from "react-i18next";
import Modal from "src/components/Modal/Modal";
import {Box, Button, Checkbox, HStack, VStack} from "@navikt/ds-react";
import React, {Dispatch, SetStateAction} from "react";
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

  const changeValgteMottakere = (mottaker: string, checked: boolean) => {
    let newValgteMottakere = _.cloneDeep(valgteMottakere)
    if (checked) {
      newValgteMottakere = newValgteMottakere!.concat(mottaker)
    } else {
      newValgteMottakere = _.filter(newValgteMottakere, _d => _d !== mottaker)
    }
    setValgteMottakere(newValgteMottakere)
  }

  return (
    <Modal
      open={open}
      width="600px"
      header={t('ui:send-til-valgte-mottakere')}
      modal={{
        modalContent: (
          <VStack gap="4">
            <Box borderWidth="1" borderColor="border-subtle" padding="4">
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
            <HStack gap="4">
              <Button
                variant='primary'
                onClick={onSendSed}
              >
                {t('ui:send-sed')}
              </Button>
              <Button
                variant='secondary'
                onClick={onModalClose}
              >
                {t('ui:close')}
              </Button>
            </HStack>
          </VStack>

        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default SendToDeltakereModal
