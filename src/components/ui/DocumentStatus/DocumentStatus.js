import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'

import Icons from '../Icons'
import * as Nav from '../Nav'

import * as constants from '../../../constants/constants'
import * as routes from '../../../constants/routes'
import * as uiActions from '../../../actions/ui'
import * as statusActions from '../../../actions/status'
import * as p4000Actions from '../../../actions/p4000'
import P4000Util from '../../../components/p4000/Util'

import './DocumentStatus.css'

const mapStateToProps = (state) => {
  return {
    sed: state.status.sed,
    rinaId: state.status.rinaId,
    documents: state.status.documents,
    gettingSED: state.loading.gettingSED,
    loadingStatus: state.loading.status,
    gettingStatus: state.loading.gettingStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, statusActions, p4000Actions), dispatch) }
}

const sortStatusByDocs = (documents) => {
  let res = {}

  if (!documents) {
    return []
  }

  documents.map(item => {
    item.navn !== 'Create' && res[item.dokumentType]
      ? res[item.dokumentType]['aksjoner'].push(item.navn) &&
            res[item.dokumentType]['aksjoner'].sort()
      : res[item.dokumentType] = {
        dokumentId: item.dokumentId,
        aksjoner: [item.navn],
        kategori: item.kategori,
        id: item.id
      }
    return item
  })

  return Object.keys(res).sort().map(key => {
    return {
      dokumentType: key,
      ...res[key]
    }
  })
}

class DocumentStatus extends Component {
    state = {
      currentDocument: undefined,
      documents: undefined,
      sed: undefined,
      filter: 'all'
    }

    static getDerivedStateFromProps (nextProps, prevState) {
      return {
        documents: nextProps.documents ? sortStatusByDocs(nextProps.documents) : undefined
      }
    }

    componentDidUpdate () {
      const { actions, history } = this.props
      const { sed } = this.state

      if (sed && sed.sed) {
        switch (sed.sed) {
          case constants.P4000: {
            let events = P4000Util.convertP4000SedToEvents(sed)
            actions.openP4000Success(events)
            history.push(routes.P4000)
            break
          }
          default:
            break
        }
      }
    }

    getDocumentButtonClass (doc) {
      const { loadingStatus } = this.props
      const { requestedDokumentId } = this.state

      if (!doc.aksjoner) {
        return null
      }
      if (loadingStatus === 'ERROR' && requestedDokumentId === doc.dokumentId) {
        return 'error'
      }
      return doc.aksjoner.indexOf('Send') >= 0 ? 'sent' : 'notsent'
    }

    toggleDocumentStatus (_doc) {
      const { currentDocument } = this.state

      this.setState({
        currentDocument: currentDocument && currentDocument.dokumentType === _doc.dokumentType ? undefined : _doc
      })
    }

    deleteSed (doc) {
      const { actions, rinaId } = this.props

      actions.deleteSed(rinaId, doc.dokumentId)
    }

    handleDocumentClick (doc, aksjoner) {
      const { t, rinaId, actions, history } = this.props

      this.setState({
        requestedDokumentId: doc.dokumentId
      })

      switch (aksjoner) {
        case 'Read':
        case 'Update':
          actions.getSed(rinaId, doc.dokumentId)
          break
        case 'Delete':

          actions.openModal({
            modalTitle: t('deleteSed'),
            modalText: t('areYouSure'),
            modalButtons: [{
              main: true,
              text: t('yes') + ', ' + t('delete'),
              onClick: this.deleteSed.bind(this, doc)
            }, {
              text: t('no') + ', ' + t('cancel'),
              onClick: actions.closeModal
            }]
          })
          break

        case 'Create':

          switch (doc.dokumentType) {
            case constants.P4000:
              history.push(routes.P4000)
              break
            case constants.P2000:
            case constants.P6000:

              history.push(routes.CASE_START + '?sed=' + doc.dokumentType + '&buc=' + doc.id)
              break
            default:
              break
          }
          break

        default:
          break
      }
    }

    setFilter (filter) {
      this.setState({
        filter: filter
      })
    }

    docMatchesFilter (doc) {
      const { filter } = this.state

      switch (filter) {
        case 'all' :
          return true
        case 'sent' :
          return doc.aksjoner.indexOf('Send') >= 0
        case 'notsent' :
          return doc.aksjoner.indexOf('Send') < 0
        default :
          break
      }
    }

    refreshDocumentStatus () {
      const { actions, rinaId } = this.props

      actions.getStatus(rinaId)
    }

    render () {
      const { t, className, gettingSED, gettingStatus } = this.props
      const { documents, currentDocument, filter } = this.state

      return <div className={classNames('c-ui-documentStatus', {
        collapsed: !currentDocument,
        expanded: currentDocument
      }, className)}>

        <div className='documentTags'>
          <Nav.EtikettBase className={classNames('tags', { selected: filter === 'all' })}
            type={filter === 'all' ? 'suksess' : 'info'} onClick={this.setFilter.bind(this, 'all')}>
            <a href='#all'>{t('all')}</a>
          </Nav.EtikettBase>
          <Nav.EtikettBase className={classNames('tags', { selected: filter === 'sent' })}
            type={filter === 'sent' ? 'suksess' : 'info'} onClick={this.setFilter.bind(this, 'sent')}>
            <a href='#sent'>{t('sent')}</a></Nav.EtikettBase>
          <Nav.EtikettBase className={classNames('tags', { selected: filter === 'notsent' })}
            type={filter === 'notsent' ? 'suksess' : 'info'} onClick={this.setFilter.bind(this, 'notsent')}>
            <a href='#notsent'>{t('notSent')}</a></Nav.EtikettBase>
          <div title={t('refresh')} className={classNames('refresh', { rotating: gettingStatus })}>
            <a href='#refresh' onClick={this.refreshDocumentStatus.bind(this)}>
              <Icons kind='refresh'/>
            </a>
          </div>
        </div>

        <div className='documentButtons'>
          {documents.filter(this.docMatchesFilter.bind(this)).map((_doc, index) => {
            let active = currentDocument ? _doc.dokumentType === currentDocument.dokumentType : false
            let label = _doc.dokumentType
            let description = t('case:case-' + _doc.dokumentType)
            if (label !== 'case-' + _doc.dokumentType) {
              label += ' - ' + description
            }

            return <div title={label} key={index} className='documentButton' style={{ animationDelay: index * 0.05 + 's' }}>
              <Nav.Hovedknapp key={index}
                className={classNames('documentButtonContent', 'mr-2',
                  { 'active': active },
                  this.getDocumentButtonClass(_doc))}
                onClick={this.toggleDocumentStatus.bind(this, _doc)}>
                {gettingSED && active ? <Nav.NavFrontendSpinner style={{ position: 'absolute', top: '1rem' }} /> : null}
                <Icons className='mr-3' size='3x' kind='document' />
                <Icons className='documentType' size='2x' kind={_doc.dokumentType.startsWith('P') ? 'form' : 'tool'} />
                <div>{_doc.dokumentType}</div>
              </Nav.Hovedknapp>
            </div>
          })}
        </div>

        {currentDocument ? <div className='documentActions'>
          <div className='documentProperties mb-4'>
            <div>{t('documentType') + ': ' + currentDocument.dokumentType}</div>
            {currentDocument.dokumentId ? <div>{t('documentId') + ': ' + currentDocument.dokumentId}</div> : null}
          </div>
          {currentDocument.aksjoner.map((aksjon, index) => {
            return <Nav.Hovedknapp className='mr-2' key={index} onClick={this.handleDocumentClick.bind(this, currentDocument, aksjon)}>
              {t(aksjon.toLowerCase())}
            </Nav.Hovedknapp>
          })}
        </div> : null}
      </div>
    }
}

DocumentStatus.propTypes = {
  t: PT.func.isRequired,
  rinaId: PT.string,
  className: PT.object,
  history: PT.object.isRequired,
  actions: PT.object.isRequired,
  loadingStatus: PT.string,
  gettingSED: PT.bool,
  gettingStatus: PT.bool
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(DocumentStatus)
)
