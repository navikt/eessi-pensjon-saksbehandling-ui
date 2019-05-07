import React, { useEffect } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'

import * as Nav from 'components/ui/Nav'
import TopContainer from 'components/ui/TopContainer/TopContainer'
import FrontPageDrawer from 'components/drawer/FrontPage'
import SEDStart from 'applications/BUC/steps/SEDStart'
import SEDPreview from 'applications/BUC/steps/SEDPreview'
import SEDSaveSend from 'applications/BUC/steps/SEDSaveSend'
import * as routes from 'constants/routes'

import './index.css'

const caseTitles = ['buc:step-startSEDTitle', 'buc:step-previewSEDTitle', 'buc:step-saveSendSEDTitle']
const caseDescriptions = [undefined, 'buc:step-previewSEDDescription', 'buc:step-saveSendSEDDescription']

const mapStateToProps = (state) => {
  return {
    step: state.buc.step
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

export const BUCPageIndex = (props) => {

  const { t, className, history, location, match, step } = props

  useEffect(() => {
    if (_.has(match, 'params.step') && String(step + 1) !== match.params.step) {
      history.push({
        pathname: `${routes.BUC}/${step + 1}`,
        search: window.location.search
      })
    }
  }, [])

  return <TopContainer
    className={classNames('a-buc-page', className)}
    history={history}
    location={location}
    sideContent={<FrontPageDrawer t={t}/>}
    header={t('buc:app-bucTitle') + ' - ' + t(caseTitles[step])}>
    <div className='mt-4'>
      <Nav.Stegindikator
        className='mb-4'
        aktivtSteg={step}
        visLabel
        onBeforeChange={() => { return false }}
        autoResponsiv
        steg={_.range(0, 3).map(index => ({
          label: t('buc:form-step' + index),
          ferdig: index < step,
          aktiv: index === step
        }))} />
      {caseDescriptions[step] ? <h2 className='mb-4 appDescription'>{t(caseDescriptions[step])}</h2> : null}
      {step === 0 ? <SEDStart mode='page' {...props}/> : null}
      {step === 1 ? <SEDPreview mode='page' {...props}/> : null}
      {step === 2 ? <SEDSaveSend mode='page' {...props}/> : null}
    </div>
  </TopContainer>
}

BUCPageIndex.propTypes = {
  description: PT.string,
  history: PT.object.isRequired,
  t: PT.func,
  step: PT.number.isRequired,
  className: PT.string,
  location: PT.object.isRequired,
  status: PT.object
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(BUCPageIndex))
