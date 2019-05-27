import React from 'react'
import { connect, bindActionCreators } from 'store'
import PT from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'

import * as Nav from '../../components/ui/Nav'
import Icons from '../../components/ui/Icons'
import * as storageActions from '../../actions/storage'
import * as pinfoActions from '../../actions/pinfo'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId,
    fileList: state.storage.fileList,
    file: state.storage.file
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions, storageActions), dispatch) }
}

class VarslerTable extends React.Component {
  state = {
    isReady: false,
    noParams: false,
    fileList: undefined,
    files: {}
  }

  componentDidMount () {
    let { actions, aktoerId, sakId, fileList } = this.props
    if (aktoerId && sakId && fileList === undefined) {
      actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
    }
    if (!aktoerId || !sakId) {
      this.setState({
        noParams: true
      })
    }
  }

  componentDidUpdate () {
    let { fileList, actions, file, aktoerId, sakId } = this.props

    if (fileList !== undefined && this.state.fileList === undefined) {
      fileList.map(file => {
        actions.getStorageFileWithNoNotification({
          userId: aktoerId,
          namespace: 'varsler',
          file: sakId + '___' + file
        })
        return file
      })

      this.setState({
        isReady: _.isEmpty(fileList),
        fileList: fileList
      })
    }

    if (file !== undefined && !this.state.isReady) {
      let files = _.cloneDeep(this.state.files)
      let key = file.timestamp + '.json'
      if (!files.hasOwnProperty(key)) {
        files[key] = file
        let allFilesDone = Object.keys(files).length === fileList.length
        this.setState({
          files: files,
          isReady: allFilesDone
        })
      }
    }
  }

  refresh () {
    let { actions, aktoerId, sakId } = this.props

    if (aktoerId && sakId) {
      this.setState({
        fileList: undefined,
        files: {}
      }, () => {
        actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
      })
    }
  }

  render () {
    const { t } = this.props
    const { isReady, noParams, files } = this.state

    if (noParams) {
      return <div className='text-center'>
        <Nav.Normaltekst>{t('pinfo:error-noParams')}</Nav.Normaltekst>
      </div>
    }

    return <React.Fragment>
      <div className='a-pinfo-table-notification-title'>
        <Nav.Undertittel>{t('pinfo:sb-sent-notifications-title')}</Nav.Undertittel>
        <div title={t('refresh')} className={classNames('refresh', { rotating: !isReady })}>
          {isReady ? <a href='#refresh' onClick={this.refresh.bind(this)}>
            <Icons kind='refresh' />
          </a> : <Icons kind='refresh' />}
        </div>
      </div>

      {!isReady ? <div className='text-center' style={{ paddingTop: '3rem' }}>
        <Nav.NavFrontendSpinner />
        <p className='typo-normal'>{t('ui:loading')}</p>
      </div>
        : <table className='w-100 mt-4'>
          <thead>
            <tr style={{ borderBottom: '1px solid lightgrey' }}>
              <th />
              <th>{t('document')}</th>
              <th>{t('sender')}</th>
              <th>{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {files ? Object.keys(files)
              .sort((a, b) => files[b].timestamp.localeCompare(files[a].timestamp))
              .map((file, index) => {
                let content = files[file]
                return <tr className='slideAnimate' style={{ animationDelay: index * 0.03 + 's' }} key={file}>
                  <td><Icons kind='nav-message-sent' /></td>
                  <td>{content.tittel || file}</td>
                  <td>{content.fulltnavn || t('unknown')}</td>
                  <td>{content.timestamp ? new Date(content.timestamp).toDateString() : t('unknown')}</td>
                </tr>
              }) : null}
          </tbody>
        </table>}
    </React.Fragment>
  }
}

VarslerTable.propTypes = {
  t: PT.func,
  locale: PT.string,
  actions: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VarslerTable)
