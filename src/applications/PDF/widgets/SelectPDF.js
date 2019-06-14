import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import * as Nav from 'components/ui/Nav'
import FileUpload from 'components/ui/FileUpload/FileUpload'

const SelectPDF = (props) => {
  const { t, actions, loadingPDF, files, setStep } = props

  const onForwardButtonClick = () => {
    setStep('edit')
  }

  const handleFileChange = (files) => {
    actions.selectPDF(files)
  }

  const handleBeforeDrop = () => {
    actions.loadingFilesStart()
  }

  const handleAfterDrop = () => {
    actions.loadingFilesEnd()
  }

  const buttonText = loadingPDF ? t('pdf:loading-loadingPDF') : t('ui:forward')

  return <React.Fragment>
    <div style={{ animation: 'none', opacity: 1 }} className='fieldset mt-4 mb-4'>
      <h2 className='mb-3'>{t('ui:fileUpload')}</h2>
      <FileUpload t={t} fileUploadDroppableId={'selectPdf'}
        className={classNames('fileUpload', 'mb-3')}
        accept={['application/pdf', 'image/jpeg', 'image/png']}
        files={files || []}
        beforeDrop={handleBeforeDrop}
        afterDrop={handleAfterDrop}
        onFileChange={handleFileChange} />
    </div>
    <Nav.Hovedknapp
      className='forwardButton'
      spinner={loadingPDF}
      disabled={_.isEmpty(files)}
      onClick={onForwardButtonClick}>{buttonText}</Nav.Hovedknapp>
  </React.Fragment>
}

SelectPDF.propTypes = {
  loadingPDF: PT.bool,
  actions: PT.object,
  t: PT.func,
  files: PT.array.isRequired
}

export default SelectPDF
