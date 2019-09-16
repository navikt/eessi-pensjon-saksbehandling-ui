import React from 'react'
import PT from 'prop-types'
import FileUpload from 'components/FileUpload/FileUpload'
import { Normaltekst, Row, Undertekst, Undertittel } from 'components/Nav'

const PeriodAttachments = ({ closeModal, openModal, period, setAttachments, t }) => (
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
        className='a-buc-c-sedp4000-period__vedlegg-fileupload'
        closeModal={closeModal}
        files={period.attachments || []}
        id='a-buc-c-sedp4000-period__vedlegg-fileupload-id'
        maxFiles={10}
        maxFileSize={10 * 1024 * 1024}
        onFileChange={(newFiles) => setAttachments(newFiles)}
        openModal={openModal}
        t={t}
      />
    </div>
  </Row>
)

PeriodAttachments.propTypes = {
  closeModal: PT.func.isRequired,
  openModal: PT.func.isRequired,
  period: PT.object,
  setAttachments: PT.func.isRequired,
  t: PT.func.isRequired
}

export default PeriodAttachments
