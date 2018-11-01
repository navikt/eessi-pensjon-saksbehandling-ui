import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

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
        'dokumentId': item.dokumentId,
        'aksjoner': [item.navn]
      }
    return item
  })

  return Object.keys(res).sort().map(key => {
    return {
      dokumentType: key,
      aksjoner: res[key].aksjoner,
      dokumentId: res[key].dokumentId
    }
  })
}

class DocumentStatus extends Component {
    state = {
      docs: undefined,
      sed: undefined,
      filter: 'all'
    }

    static getDerivedStateFromProps (nextProps, prevState) {
      return {
        docs: nextProps.documents ? sortStatusByDocs(nextProps.documents) : undefined,
        sed: !_.isEqual(nextProps.sed, prevState.sed) ? nextProps.sed : prevState.sed
      }
    }

    componentDidUpdate () {
      const { sed } = this.state

      if (sed) {
        this.redirectToSed(sed)
      }
    }

    redirectToSed (sed) {
      const { actions, history } = this.props

      this.setState({
        doc: undefined
      })

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
      if (!this.state.doc) {
        this.setState({
          doc: _doc
        })
      } else {
        if (this.state.doc.dokumentId === _doc.dokumentId) {
          this.setState({
            doc: undefined
          })
        } else {
          this.setState({
            doc: _doc
          })
        }
      }
    }

    deleteSed (doc) {
      const { actions, rinaId } = this.props

      actions.deleteSed(rinaId, doc.dokumentId)
    }

    handleDocumentClick (doc, aksjoner) {
      const { t, rinaId, actions, history } = this.props

      switch (aksjoner) {
        case 'Read':
        case 'Update':
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

          if (doc.dokumentType === constants.P4000) {
            history.push(routes.P4000)
          }
          actions.getSed(rinaId, doc.dokumentId)
          break
        default:
          break
      }

      this.setState({
        requestedDokumentId: doc.dokumentId
      })
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
      const { docs, doc, filter } = this.state

      return <div className={classNames('c-ui-documentStatus', {
        collapsed: !doc,
        expanded: doc
      }, className)}>

        <div className='documentTags'>
          <Nav.EtikettBase className={classNames('tags', { selected: filter === 'all' })}
            type={filter === 'all' ? 'suksess' : 'info'}
            onClick={this.setFilter.bind(this, 'all')}>{t('all')}</Nav.EtikettBase>
          <Nav.EtikettBase className={classNames('tags', { selected: filter === 'sent' })}
            type={filter === 'sent' ? 'suksess' : 'info'}
            onClick={this.setFilter.bind(this, 'sent')}>{t('sent')}</Nav.EtikettBase>
          <Nav.EtikettBase className={classNames('tags', { selected: filter === 'notsent' })}
            type={filter === 'notsent' ? 'suksess' : 'info'}
            onClick={this.setFilter.bind(this, 'notsent')}>{t('notSent')}</Nav.EtikettBase>
          <div title={t('refresh')} className={classNames('refresh', { rotating: gettingStatus })}>
            <Icons kind='refresh' onClick={this.refreshDocumentStatus.bind(this)} />
          </div>
        </div>

        <div className='documentButtons'>
          {docs.filter(this.docMatchesFilter.bind(this)).map((_doc, index) => {
            let active = doc ? _doc.dokumentId === doc.dokumentId : false
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

        {doc ? <div className='documentActions'>
          <div className='documentProperties mb-4'>
            <div>{t('documentType') + ': ' + doc.dokumentType}</div>
            <div>{t('documentId') + ': ' + doc.dokumentId}</div>
          </div>
          {doc.aksjoner.map((aksjon, index) => {
            return <Nav.Hovedknapp className='mr-2' key={index} onClick={this.handleDocumentClick.bind(this, doc, aksjon)}>
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
  translate()(DocumentStatus)
)
