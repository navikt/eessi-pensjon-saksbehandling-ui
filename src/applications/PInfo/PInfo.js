import React from 'react'
import PT from 'prop-types'
import { connect } from 'store'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import VarslerPanel from './VarslerPanel'
import VarslerTable from './VarslerTable'
import * as Nav from '../../components/ui/Nav'
import TopContainer from '../../components/ui/TopContainer/TopContainer'
import Psycho from '../../components/ui/Psycho/Psycho'

import '../PInfo/PInfo.css'

const mapStateToProps = (state) => {
  return {
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId
  }
}

class PInfo extends React.Component {
  state = {
    noParams: false
  }
  componentDidMount () {
    let { aktoerId, sakId } = this.props
    if (!aktoerId || !sakId) {
      this.setState({
        noParams: true
      })
    }
  }

  render () {
    const { t, location, history } = this.props

    if (this.state.noParams) {
      return <TopContainer className='p-pInfo' history={history} location={location} header={t('pinfo:app-title')}>
        <div className='content container text-center pt-4'>
          <div className='psycho mt-3 mb-4' style={{ height: '110px' }}>
            <Psycho type='trist' id='psycho' />
          </div>
          <div className='text-center'>
            <Nav.Normaltekst>{t('pinfo:error-noParams')}</Nav.Normaltekst>
          </div>
        </div>
      </TopContainer>
    }

    return <TopContainer className='p-pInfo' history={history} location={location}>
      <Nav.Row>
        <div className='col-md-2' />
        <div className='col-md-8'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <VarslerPanel {...this.props} />
          </div>
        </div>
        <div className='col-md-2' />
        <div className='col-md-12'>
          <div className={classNames('fieldset', 'animate', 'mt-4', 'mb-4')}>
            <VarslerTable {...this.props} />
          </div>
        </div>
      </Nav.Row>
    </TopContainer>
  }
}

PInfo.propTypes = {
  history: PT.object,
  t: PT.func,
  location: PT.object.isRequired,
  status: PT.object
}

export default connect(
  mapStateToProps,
  () => {}
)(withTranslation()(PInfo))
