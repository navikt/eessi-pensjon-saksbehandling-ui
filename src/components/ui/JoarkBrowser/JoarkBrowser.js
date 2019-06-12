import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import File from 'components/ui/File/File'
import * as joarkActions from 'actions/joark'

import './JoarkBrowser.css'

const mapStateToProps = (state) => {
  return {
    list: state.joark.list,
    file: state.joark.file,
    loadingJoarkList : state.loading.loadingJoarkList,
    loadingJoarkFile : state.loading.loadingJoarkFile,
    aktoerId: state.app.params.aktoerId
  }
}

const mapDispatchToProps = (dispatch) => {
  return {actions: bindActionCreators(joarkActions, dispatch)}
}

const JoarkBrowser = (props) => {

  const { t, list, files, file, loadingJoarkList, loadingJoarkFile, actions, aktoerId } = props
  const [ _files, setFiles ] = useState(files)
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      actions.listJoarkFiles()
      setMounted(true)
    }
  }, [mounted, list, loadingJoarkList, actions])

  const onDragEnd = () => {
  }

  const onDrop = () => {
  }

  const onDropRejected = () => {
  }

  const addFile = (file) => {
  }

  const previewFile = (file) => {
  }

  return <div className='c-ui-joarkBrowser'>

    {list ? list.map((file, index) => {
      return <div key={index} className={classNames('c-ui-joarkBrowser__item')}>
        <File file={file} addLink animate previewLink downloadLink
          width={141.4} height={200} scale={1.0}
          onAddFile={() => addFile(file)}
          onPreviewDocument={() => previewFile(file)} />
      </div>
    }) : null}
  </div>
}

JoarkBrowser.propTypes = {
  t: PT.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(JoarkBrowser))
