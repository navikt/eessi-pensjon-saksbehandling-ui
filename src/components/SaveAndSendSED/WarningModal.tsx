import {JSX} from "react";
import {useTranslation} from "react-i18next";
import Modal from "src/components/Modal/Modal";
import {Alert} from "@navikt/ds-react";



interface WarningModalProps {
  onModalClose: () => void
  open: boolean
  elementKeys: Array<string>
}

const WarningModal: React.FC<WarningModalProps> = ({
  onModalClose,
  open,
  elementKeys
}: WarningModalProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      header={t('ui:warning')}
      modal={{
        modalContent: (
          <Alert variant="warning">
            Du holder på legge til eller redigere et eller flere elementer ({elementKeys?.map((k) => t('ui:editingItem-' + k)).join(', ')}).
            Husk å lagre eller avbryte for å gå videre.
          </Alert>
        )
      }}
      onModalClose={onModalClose}
    />
  )
}

export default WarningModal
