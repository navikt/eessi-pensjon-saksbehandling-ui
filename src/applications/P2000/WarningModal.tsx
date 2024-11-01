import {useTranslation} from "react-i18next";
import Modal from "src/components/Modal/Modal";
import { BodyLong } from "@navikt/ds-react";



interface WarningModalProps {
  onModalClose: () => void
  open: boolean
}



const WarningModal: React.FC<WarningModalProps> = ({
  onModalClose,
  open,
}: WarningModalProps): JSX.Element => {
  const { t } = useTranslation()


  return (
    <Modal
      open={open}
      header={t('ui:warning')}
      modal={{
        modalContent: (
          <BodyLong>
            OBS: Du holder på legge til eller redigere et element.  Husk å lagre eller avbryte for å gå videre
          </BodyLong>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default WarningModal
