import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../../ui/Nav'
import Period from './Period'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    stayAbroad: state.pinfo.stayAbroad
  }
}

class StayAbroad extends React.Component {
  state = {
    _period: {}
  }

  setEditPeriod (period) {
    this.setState({
      _period: period
    })
  }

  render () {
    const { t, stayAbroad, locale, mode } = this.props
    const { _period } = this.state

    return <React.Fragment>
      <Nav.Undertittel>{t('pinfo:stayAbroad-title')}</Nav.Undertittel>
      {mode !== 'view' ? <Nav.Undertekst>{t('pinfo:stayAbroad-description')}</Nav.Undertekst> : null}
      {!_.isEmpty(stayAbroad) ? <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-previousPeriods')}</Nav.Undertittel> : null}
      {stayAbroad.map((period, index) => {
        return <Period t={t}
          mode='view'
          current={_period.id === period.id}
          first={index === 0}
          last={index === stayAbroad.length - 1}
          period={period}
          periods={stayAbroad}
          editPeriod={this.setEditPeriod.bind(this)}
          key={period.id}
          showButtons={mode !== 'view'} />
      })}
      {mode !== 'view' ? <Period t={t}
        periods={stayAbroad}
        mode={_.isEmpty(_period) ? 'new' : 'edit'}
        period={_period}
        locale={locale}
        editPeriod={this.setEditPeriod.bind(this)}
      /> : null}

    </React.Fragment>
  }
}

StayAbroad.propTypes = {
  locale: PT.string,
  t: PT.func,
  mode: PT.string
}

export default connect(
  mapStateToProps,
  null
)(
  withTranslation()(StayAbroad)
)
