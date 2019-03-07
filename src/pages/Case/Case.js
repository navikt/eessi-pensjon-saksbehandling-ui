import React, { Component } from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import FrontPageDrawer from '../../components/drawer/FrontPage'

import './Case.css'

const mapStateToProps = (state) => {
  return {
    status: state.status
  }
}

class Case extends Component {
  render () {
    const { t, children, title, stepIndicator, className, history, location, status } = this.props

    return <TopContainer className={classNames('p-case-case', className)}
      history={history} location={location}
      sideContent={<FrontPageDrawer t={t} status={status} />}
      header={title}>
      { stepIndicator !== undefined ? <Nav.Stegindikator
        visLabel
        onBeforeChange={() => { return false }}
        autoResponsiv
        className='mb-4'
        steg={[
          { label: t('case:form-step1'), aktiv: (stepIndicator === 0) },
          { label: t('case:form-step2'), aktiv: (stepIndicator === 1) },
          { label: t('case:form-step3'), aktiv: (stepIndicator === 2) },
          { label: t('case:form-step4'), aktiv: (stepIndicator === 3) },
          { label: t('case:form-step5'), aktiv: (stepIndicator === 4) }
        ]} /> : null }
      {children}
    </TopContainer>
  }
}

Case.propTypes = {
  title: PT.string.isRequired,
  description: PT.string,
  stepIndicator: PT.number,
  history: PT.object.isRequired,
  t: PT.func,
  className: PT.string,
  children: PT.oneOfType([PT.array, PT.object]).isRequired,
  location: PT.object.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps
)(
  withTranslation()(Case)
)
