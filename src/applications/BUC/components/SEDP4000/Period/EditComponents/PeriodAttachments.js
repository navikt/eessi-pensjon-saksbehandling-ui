import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

const PeriodAttachments = ({ closeModal, openModal, period, setAttachments, t }) => (
  <Ui.Nav.Row>
    <div className='col-sm-12'>
      <Ui.Nav.Undertittel className='mt-5 mb-2'>
        {t('buc:p4000-attachment-title')}
      </Ui.Nav.Undertittel>
      <Ui.Nav.Undertekst>
        {t('buc:p4000-help-attachment')}
      </Ui.Nav.Undertekst>
      <Ui.Nav.Normaltekst className='optional mb-1'>{t('ui:optional')}</Ui.Nav.Normaltekst>
    </div>
    <div className='col-sm-12'>
      <Ui.FileUpload
        acceptedMimetypes={['application/pdf', 'image/jpeg', 'image/png']}
        className='a-buc-c-sedp4000-period__vedlegg-fileupload p-4'
        closeModal={closeModal}
        files={period.attachments || []}
        id='a-buc-c-sedp4000-period__vedlegg-fileupload-id'
        maxFiles={10}
        maxFileSize={10 * 1024 * 1024}
        onFilesChanged={(newFiles) => setAttachments(newFiles)}
        openModal={openModal}
        t={t}
      />
    </div>
  </Ui.Nav.Row>
)

PeriodAttachments.propTypes = {
  closeModal: PT.func.isRequired,
  openModal: PT.func.isRequired,
  period: PT.object,
  setAttachments: PT.func.isRequired,
  t: PT.func.isRequired
}

export default PeriodAttachments
