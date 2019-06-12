import React from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import * as Nav from 'components/ui/Nav'
import DnDExternalFiles from '../DnDExternalFiles/DnDExternalFiles'
import * as storageActions from 'actions/storage'
import * as storages from 'constants/storages'

import './ExternalFiles.css'

const mapStateToProps = (state) => {
  return {
    username: state.app.username,
    loadingFileList: state.loading.loadingStorageFileList,
    fileList: state.storage.fileList
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({...storageActions}, dispatch) }
}

const ExternalFiles = (props) => {

  const { actions, username, t, loadingFileList, fileList, addFile, style, className } = props

  const requestExternalFileList = () => {
    actions.listStorageFiles(username, storages.FILES)
  }

  return <Nav.Ekspanderbartpanel style={style} className={classNames('c-pdf-externalFiles', className)}
    apen={false} tittel={t('ui:fileSelect')} tittelProps='undertittel'
    onClick={requestExternalFileList}>
    <div className='fileArea'>
      {loadingFileList ? <div className='w-100 text-center'>
        <Nav.NavFrontendSpinner />
        <p className='typo-normal'>{t('pdf:loading-loadingFileList')}</p>
      </div> : <DnDExternalFiles fileList={fileList || []} addFile={addFile} />}
    </div>
  </Nav.Ekspanderbartpanel>
}

ExternalFiles.propTypes = {
  t: PT.func.isRequired,
  username: PT.string.isRequired,
  loadingFileList: PT.bool,
  fileList: PT.array,
  actions: PT.object,
  addFile: PT.func,
  style: PT.object,
  className: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(ExternalFiles)
)
