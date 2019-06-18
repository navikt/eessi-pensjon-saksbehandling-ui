import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import { NavFrontendSpinner } from 'components/ui/Nav'
import TableSorter from 'components/ui/TableSorter/TableSorter'
import * as joarkActions from 'actions/joark'
import * as uiActions from 'actions/ui'

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
  return { actions: bindActionCreators({...uiActions, ...joarkActions}, dispatch) }
}

const JoarkBrowser = (props) => {
  const { t, list, files, file, loadingJoarkList, loadingJoarkFile, actions, aktoerId, onFilesChange } = props
  const [ _files, setFiles ] = useState(files)
  const [ _previewFile, setPreviewFile ] = useState(undefined)
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      actions.listJoarkFiles(aktoerId)
      setMounted(true)
    }
  }, [mounted, list, loadingJoarkList, actions, aktoerId])

  useEffect(() => {
    if (file && !_previewFile) {
      setPreviewFile(file)
    }
  }, [file, _previewFile])

  const onItemClicked = (clickedItem) => {
    setPreviewFile(undefined)
    const foundFile = _.find(files, clickedItem.raw)
    if (!foundFile) {
      actions.getJoarkFile(aktoerId, clickedItem.name)
    } else {
      setPreviewFile(clickedItem)
    }
  }

  const onSelectedItemsChange = (items) => {
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

  const items = list ? list.map((file) => {
    return {
      raw: file,
      id: file.id,
      name: file.name,
      tema: file.tema,
      date: file.date,
      focused: _previewFile ? _previewFile.id === file.id : false,
      selected: _.find(files, file) !== undefined
    }
  }) : []

  if (loadingJoarkList) {
    return <div>
      <NavFrontendSpinner type='XS' />
      <span>{t('ui:loading')}</span>
    </div>
  }

  return <div className='c-ui-joarkBrowser'>
    <TableSorter
      t={t}
      items={items}
      loadingJoarkFile={loadingJoarkFile}
      previewFile={_previewFile}
      sort={{column: 'name', order: 'desc'}}
      columns={{
        name: {name: t('ui:title'), filterText: '', defaultSortOrder: 'desc'},
        tema: {name: t('ui:tema'), filterText: '', defaultSortOrder: 'desc'},
        date: {name: t('ui:date'), filterText: '', defaultSortOrder: 'desc'},
      }}
      onItemClicked={onItemClicked}
      onSelectedItemsChange={onSelectedItemsChange}
      />
  </div>
}

JoarkBrowser.propTypes = {
  t: PT.func.isRequired,
  onFilesChange: PT.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(JoarkBrowser))
