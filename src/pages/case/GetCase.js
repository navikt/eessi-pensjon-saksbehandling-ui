import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'

import Case from './Case'

import * as Nav from '../../components/ui/Nav'
import * as routes from '../../constants/routes'
import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    currentCase: state.case.currentCase,
    gettingCase: state.loading.gettingCase
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, caseActions, uiActions), dispatch) }
}

class GetCase extends Component {
    state = {};

    componentDidMount () {
      const { actions, currentCase } = this.props

      if (currentCase) {
        actions.cleanCaseNumber()
      }

      actions.addToBreadcrumbs([{
        url: routes.CASE,
        label: 'case:app-caseTitle'
      }, {
        url: routes.CASE_GET,
        label: 'case:app-getCaseTitle'
      }])
    }

    componentDidUpdate () {
      const { history, currentCase } = this.props

      if (currentCase) {
        history.push(routes.CASE_GET +
          (currentCase.casenumber ? '/' + currentCase.casenumber : '') +
          (currentCase.pinid ? '/' + currentCase.pinid : '') +
          (currentCase.rinaid ? '/' + currentCase.rinaid : '')
        )
      }
    }

    onSakIdChange (e) {
      this.setState({
        sakId: e.target.value.trim()
      })
    }

    onRinaIdChange (e) {
      this.setState({
        rinaId: e.target.value.trim()
      })
    }

    onAktoerIdChange (e) {
      this.setState({
        aktoerId: e.target.value.trim()
      })
    }

    onForwardButtonClick () {
      const { actions } = this.props

      actions.getCaseFromCaseNumber(this.state)
    }

    isButtonDisabled () {
      return !this.state.sakId || !this.state.aktoerId || this.props.gettingCase
    }

    render () {
      const { t, gettingCase, history, location } = this.props
      const { sakId, aktoerId, rinaId } = this.state

      let buttonText = gettingCase ? t('case:loading-gettingCase') : t('ui:search')

      return <Case className='p-case-getcase'
        title={t('case:app-caseTitle') + ' - ' + t('case:app-getCaseTitle')}
        description={t('case:app-getCaseDescription')}
        history={history}
        location={location}>
        <div className='fieldset animate'>
          <Nav.Row>
            <div className='col-md-6'>
              <Nav.HjelpetekstBase id='sakId'>{t('case:help-sakId')}</Nav.HjelpetekstBase>
              <Nav.Input className='getCaseInputSakId' label={t('case:form-sakId') + ' *'} value={sakId || ''} onChange={this.onSakIdChange.bind(this)} />
            </div>
            <div className='col-md-6'>
              <Nav.HjelpetekstBase id='aktoerId'>{t('case:help-aktoerId')}</Nav.HjelpetekstBase>
              <Nav.Input className='getCaseInputAktoerId' label={t('case:form-aktoerId') + ' *'} value={aktoerId || ''} onChange={this.onAktoerIdChange.bind(this)} />
            </div>
            <div className='col-md-6'>
              <Nav.HjelpetekstBase id='rinaId'>{t('case:help-rinaId')}</Nav.HjelpetekstBase>
              <Nav.Input className='getCaseInputRinaId' label={t('case:form-rinaId')} value={rinaId || ''} onChange={this.onRinaIdChange.bind(this)} />
            </div>
          </Nav.Row>
        </div>
        <Nav.Row className='p-4'>
          <div className='col-md-6 mb-2' />
          <div className='col-md-6 mb-2'>
            <Nav.Hovedknapp className='forwardButton w-100'
              spinner={gettingCase}
              disabled={this.isButtonDisabled()}
              onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
          </div>
        </Nav.Row>
      </Case>
    }
}

GetCase.propTypes = {
  currentCase: PT.object,
  gettingCase: PT.bool,
  actions: PT.object,
  history: PT.object,
  location: PT.object,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(GetCase)
)
