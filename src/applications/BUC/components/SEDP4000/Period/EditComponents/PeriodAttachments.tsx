import { Period } from 'declarations/period'
// import { PeriodPropType } from 'declarations/period.pt'
import { ModalContent } from 'declarations/components.d'
import React from 'react'
import PT from 'prop-types'
import { Files } from 'forhandsvisningsfil'
import FileUpload from 'filopplasting'
import { useTranslation } from 'react-i18next'
import { Row } from 'nav-frontend-grid'
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi'

export interface PeriodAttachmentsProps {
  closeModal: () => void;
  openModal: (m: ModalContent) => void;
  period: Period;
  setAttachments: (f: Files) => void;
}

const PeriodAttachments: React.FC<PeriodAttachmentsProps> = ({
  period, setAttachments
}: PeriodAttachmentsProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Row>
      <div className='col-sm-12'>
        <Undertittel className='mt-5 mb-2'>
          {t('buc:p4000-attachment-title')}
        </Undertittel>
        <Undertekst>
          {t('buc:p4000-help-attachment')}
        </Undertekst>
        <Normaltekst className='optional mb-1'>{t('ui:optional')}</Normaltekst>
      </div>
      <div className='col-sm-12'>
        <FileUpload
          acceptedMimetypes={['application/pdf', 'image/jpeg', 'image/png']}
          className='a-buc-c-sedp4000-period__vedlegg-fileupload p-4'
          files={period.attachments || []}
          maxFiles={10}
          maxFileSize={10 * 1024 * 1024}
          onFilesChanged={(newFiles: Files) => setAttachments(newFiles)}
        />
      </div>
    </Row>
  )
}

PeriodAttachments.propTypes = {
  closeModal: PT.func.isRequired,
  openModal: PT.func.isRequired,
  //period: PeriodPropType.isRequired,
  setAttachments: PT.func.isRequired
}

export default PeriodAttachments
