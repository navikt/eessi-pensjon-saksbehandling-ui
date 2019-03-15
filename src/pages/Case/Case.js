import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import _ from 'lodash'

import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import FrontPageDrawer from '../../components/drawer/FrontPage'
import StartCase from '../../components/case/StartCase'
import PreviewCase from '../../components/case/PreviewCase'
import SaveSendCase from '../../components/case/SaveSendCase'
import * as routes from '../../constants/routes'

import './Case.css'

const mapStateToProps = (state) => {
  return {
    status: state.status,
    step: state.case.step
  }
}
const caseTitles = ['case:app-startCaseTitle', 'case:app-previewCaseTitle', 'case:app-saveSendCaseTitle']
const caseDescriptions = [undefined, 'case:app-previewCaseDescription', 'case:app-saveSendCaseDescription']

export class Case extends Component {
  componentDidUpdate () {
    const { step, match, history } = this.props

    if (_.has(match, 'params.step') && String(step + 1) !== match.params.step) {
      history.push({
        pathname: `${routes.CASE}/${step + 1}`,
        search: window.location.search
      })
    }
  }

  render () {
    const { t, step, className, history, location, status } = this.props

    return <TopContainer className={classNames('p-case-case', className)}
      history={history} location={location}
      sideContent={<FrontPageDrawer t={t} status={status} />}
      header={t('case:app-caseTitle') + ' - ' + t(caseTitles[step])}>
      <div className='mt-4'>
        <Nav.Stegindikator
          className='mb-4'
          aktivtSteg={step}
          visLabel
          onBeforeChange={() => { return false }}
          autoResponsiv
          steg={_.range(0, 3).map(index => ({
            label: t('case:form-step' + index),
            ferdig: index < step,
            aktiv: index === step
          }))} />
        {caseDescriptions[step] ? <h2 className='mb-4 appDescription'>{t(caseDescriptions[step])}</h2> : null}
        {step === 0 ? <StartCase /> : null}
        {step === 1 ? <PreviewCase /> : null}
        {step === 2 ? <SaveSendCase /> : null}
      </div>
    </TopContainer>
  }
}

Case.propTypes = {

  description: PT.string,
  history: PT.object.isRequired,
  t: PT.func,
  step: PT.number.isRequired,
  className: PT.string,
  location: PT.object.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps
)(
  withTranslation()(Case)
)
