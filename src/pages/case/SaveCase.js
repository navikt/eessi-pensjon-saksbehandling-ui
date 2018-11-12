import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import Export from '../../components/ui/Export/Export'
import RenderPrintData from '../../components/case/RenderPrintData'

import Case from './Case'
import * as Nav from '../../components/ui/Nav'

import * as routes from '../../constants/routes'
import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    dataSaved: state.case.dataSaved,
    dataSent: state.case.dataSent,
    rinaUrl: state.case.rinaUrl,
    sendingCase: state.loading.sendingCase,
    rinaLoading: state.loading.rinaUrl
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, caseActions), dispatch) }
}

class SaveCase extends Component {
    state = {};

    componentDidMount () {
      let { history, actions, dataSaved, dataSent } = this.props

      if (!dataSaved) {
        history.push(routes.CASE_START)
      } else {
        actions.getRinaUrl()
        actions.addToBreadcrumbs([{
          url: routes.CASE,
          label: 'case:app-caseTitle'
        }, {
          url: routes.CASE_SAVE,
          label: 'case:app-saveCaseTitle'
        }])
      }
    }

    componentDidUpdate () {
      const { history, dataSaved, dataSent } = this.props

      if (!dataSaved) {
        history.push(routes.CASE_START)
      }

      if (dataSent) {
        history.push(routes.CASE_SEND)
      }
    }

    onBackButtonClick () {
      const { history, actions } = this.props

      history.goBack()
    }

    onForwardButtonClick () {
      const { actions, dataSaved } = this.props

      let payload = {
        subjectArea: dataSaved.subjectArea,
        sakId: dataSaved.sakId,
        aktoerId: dataSaved.aktoerId,
        buc: dataSaved.buc,
        sed: dataSaved.sed,
        institutions: dataSaved.institutions,
        sendsed: true,
        euxCaseId: dataSaved.euxcaseid
      }

      actions.sendSed(payload)
    }

    render () {
      let { t, history, location, sendingCase, dataSaved, rinaLoading, rinaUrl } = this.props

      let buttonText = sendingCase ? t('case:loading-sendingCase') : t('ui:confirmAndSend')

      return <Case className='p-case-saveCase'
        title={t('case:app-caseTitle') + ' - ' + t('case:app-saveCaseTitle')}
        description={t('case:app-saveCaseDescription')}
        stepIndicator={3}
        history={history}
        location={location}>
        <div className='fieldset animate text-center'>
          { rinaLoading ? <span>{t('case:loading-rinaUrl')}</span>
            : (rinaUrl && dataSaved && dataSaved.euxcaseid ? <div>
              <div className='m-4'><a href={rinaUrl + dataSaved.euxcaseid}>{t('case:form-caseLink')}</a></div>
              <div className='m-4'>
                <h4>{t('case:form-rinaId') + ': ' + dataSaved.euxcaseid}</h4>
              </div>
              <RenderPrintData t={t} data={dataSaved} />
              <Export fileName='kvittering.pdf' nodeId='divToPrint' buttonLabel={t('ui:getReceipt')} />
            </div> : null)}
        </div>

        <Nav.Row className='mb-4 p-4'>
          <div className='col-md-6 mb-2'>
            <Nav.Knapp className='w-100 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
          </div>
          <div className='col-md-6 mb-2'>
            <Nav.Hovedknapp className='w-100 forwardButton' disabled={sendingCase} spinner={sendingCase} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
          </div>
        </Nav.Row>
      </Case>
    }
}

SaveCase.propTypes = {
  actions: PT.object,
  history: PT.object,
  location: PT.object,
  dataSaved: PT.object,
  dataSent: PT.bool,
  sendingCase: PT.bool,
  t: PT.func,
  rinaLoading: PT.bool,
  rinaUrl: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(SaveCase)
)
