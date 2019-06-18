import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import File from 'components/ui/File/File'
import { NavFrontendSpinner } from 'components/ui/Nav'
import TableSorter from 'components/ui/TableSorter/TableSorter'
import * as joarkActions from 'actions/joark'

import './JoarkBrowser.css'

const mapStateToProps = (state) => {
  return {
    list: state.joark.list,
    file: state.joark.file,
    loadingJoarkList: state.loading.loadingJoarkList,
    loadingJoarkFile: state.loading.loadingJoarkFile,
    aktoerId: state.app.params.aktoerId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(joarkActions, dispatch) }
}

const JoarkBrowser = (props) => {
  const { t, list, files, file, loadingJoarkList, loadingJoarkFile, actions, aktoerId, onFilesChange } = props
  const [ _files, setFiles ] = useState(files)
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      actions.listJoarkFiles(aktoerId)
      setMounted(true)
    }
  }, [mounted, list, loadingJoarkList, actions, aktoerId])

  const previewFile = (file) => {
  }

  const handleFileClick = (file) => {
    let newFiles = _.cloneDeep(_files)
    if (_.find(newFiles, file)) {
      newFiles = _.reject(newFiles, file)
    } else {
      newFiles.push(file)
    }
    setFiles(newFiles)
    if (onFilesChange) {
      onFilesChange(newFiles)
    }
  }

  const config = {
    sort: {column: 'name', order: 'desc'},
    columns: {
      name: {name: 'name', filterText: '', defaultSortOrder: 'desc'},
      tags: {name: 'tags', filterText: '', defaultSortOrder: 'desc'},
      date: {name: 'date', filterText: '', defaultSortOrder: 'desc'},
    }
  }

  const items = list ? list.map((file, index) => {
    return {id: index, name: file.name, tags: file.tags.join(', '), date: file.date}
  }) : []

  if (loadingJoarkList) {
    return <div>
      <NavFrontendSpinner type='XS' />
      <span>{t('ui:loading')}</span>
    </div>
  }

  return <div className='c-ui-joarkBrowser'>
    <TableSorter items={items} config={config} />
  </div>
}

/* <File file={file} addLink animate previewLink
            width={141.4} height={200} scale={1.0}
            onPreviewDocument={() => previewFile(file)}
            onClick={() => handleFileClick(file)} />*/
JoarkBrowser.propTypes = {
  t: PT.func.isRequired,
  onFilesChange: PT.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(JoarkBrowser))
