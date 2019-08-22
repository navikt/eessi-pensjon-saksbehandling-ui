import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import * as storageActions from 'actions/storage'
import * as pinfoActions from 'actions/pinfo'
import VarslerPanel from './VarslerPanel'
import VarslerTable from './VarslerTable'
import * as Nav from 'components/Nav'
import TopContainer from 'components/TopContainer/TopContainer'
import Psycho from 'components/Psycho/Psycho'
import { getDisplayName } from 'utils/displayName'

import './PInfo.css'

const mapStateToProps = (state) => {
  return {
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId,
    sakType: state.app.params.sakType,
    isSendingPinfo: state.loading.isSendingPinfo,
    isInvitingPinfo: state.loading.isInvitingPinfo,
    invite: state.pinfo.invite,
    fileList: state.storage.fileList,
    file: state.storage.file
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...pinfoActions, ...storageActions }, dispatch) }
}

const PInfo = (props) => {
  const { aktoerId, history, sakId, sakType, t } = props
  const [noParams, setNoParams] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) {
      if (!aktoerId || !sakId || !sakType) {
        setNoParams(true)
      }
      setMounted(true)
    }
  }, [mounted, aktoerId, sakId, sakType])

  if (!mounted) {
    return null
  }

  if (noParams) {
    return (
      <TopContainer className='p-pInfo' t={t} history={history} header={t('pinfo:app-title')}>
        <div className='content container text-center pt-4'>
          <div className='psycho mt-3 mb-4' style={{ height: '110px' }}>
            <Psycho type='trist' id='psycho' />
          </div>
          <div className='text-center'>
            <Nav.Normaltekst>{t('pinfo:error-noParams')}</Nav.Normaltekst>
          </div>
        </div>
      </TopContainer>
    )
  }

  return (
    <TopContainer className='p-pInfo' t={t} history={history}>
      <Nav.Row>
        <div className='col-md-2' />
        <div className='col-md-8'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <VarslerPanel {...props} />
          </div>
        </div>
        <div className='col-md-2' />
        <div className='col-md-12'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <VarslerTable {...props} />
          </div>
        </div>
      </Nav.Row>
    </TopContainer>
  )
}

PInfo.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  history: PT.object,
  t: PT.func.isRequired,
  sakId: PT.string,
  sakType: PT.string
}

const ConnectedPInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PInfo))

ConnectedPInfo.displayName = `Connect(${getDisplayName(withTranslation()(PInfo))})`

export default ConnectedPInfo
