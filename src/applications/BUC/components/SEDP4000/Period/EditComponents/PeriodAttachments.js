import { Row } from 'nav-frontend-grid'
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi'
import FileUpload from 'components/FileUpload/FileUpload'
import React from 'react'
import PT from 'prop-types'

const PeriodAttachments = ({ t, period, setAttachments, openModal, closeModal }) => (
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
        id='a-buc-c-sedp4000-period__vedlegg-fileupload-id'
        className='a-buc-c-sedp4000-period__vedlegg-fileupload'
        acceptedMimetypes={['application/pdf', 'image/jpeg', 'image/png']}
        maxFileSize={10 * 1024 * 1024}
        maxFiles={10}
        t={t}
        files={period.attachments || []}
        onFileChange={(newFiles) => setAttachments(newFiles)}
        openModal={openModal}
        closeModal={closeModal}
      />
    </div>
  </Row>
)

PeriodAttachments.propTypes = {
  t: PT.func,
  period: PT.object,
  openModal: PT.func.isRequired,
  closeModal: PT.func.isRequired,
  setAttachments: PT.func
}

export default PeriodAttachments
