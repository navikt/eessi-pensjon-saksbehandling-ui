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
import SaveCase from '../../components/case/SaveCase'
import SendCase from '../../components/case/SendCase'

import './Case.css'

const mapStateToProps = (state) => {
  return {
    status: state.status,
    step: state.case.step
  }
}

const caseTitles = ['case:app-startCaseTitle']
const caseDescriptions = ['', 'case:app-startCaseDescription']

export class Case extends Component {

  render () {
    const { t, step, className, history, location, status } = this.props

    return <TopContainer className={classNames('p-case-case', className)}
      history={history} location={location}
      sideContent={<FrontPageDrawer t={t} status={status} />}
      header={t('case:app-caseTitle') + ' - ' + t(caseTitles[step])}>
      <div className='mt-4'>
       <Nav.Stegindikator
        visLabel
        onBeforeChange={() => { return false }}
        autoResponsiv
        className='mb-4'
        steg={_.range(0, 4).map(index => ({
          label: t('case:form-step' + (index + 1)),
          ferdig: index < step,
          aktiv: index === step
        }))}/>
      {step === 0 ? <StartCase /> : null}
      {step === 1 ? <PreviewCase /> : null}
      {step === 2 ? <SaveCase /> : null}
      {step === 3 ? <SendCase /> : null}
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
