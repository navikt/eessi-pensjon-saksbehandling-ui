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
    _period: {},
    maxPeriods: 8
  }

  setEditPeriod (period) {
    this.setState({
      _period: period
    })
  }

  render () {
    const { t, stayAbroad, locale } = this.props
    const { _period, maxPeriods } = this.state

    const editMode = _period && _period.id

    return <React.Fragment>
      {!editMode ? <React.Fragment>
        <Nav.Undertittel>{t('pinfo:stayAbroad-title')}</Nav.Undertittel>
        <Nav.Undertekst>{t('pinfo:stayAbroad-description')}</Nav.Undertekst>
        <Nav.Undertekst className='mt-4 mb-4'>{t('pinfo:app-info-on-help-icon')}</Nav.Undertekst>

      </React.Fragment> : null}
      {!_.isEmpty(stayAbroad) && !editMode ? <React.Fragment>
        <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-previousPeriods')}</Nav.Undertittel>
        {stayAbroad.sort((a, b) => {
          return a.startDate - b.startDate
        }).map((period, index) => {
          return <Period t={t}
            mode='view'
            first={index === 0}
            last={index === stayAbroad.length - 1}
            period={period}
            periods={stayAbroad}
            editPeriod={this.setEditPeriod.bind(this)}
            key={period.id}
            showButtons />
        })}
      </React.Fragment>
        : null}
      { stayAbroad.length < maxPeriods ? <Period t={t}
        periods={stayAbroad}
        mode={editMode ? 'edit' : 'new'}
        period={_period}
        periods={stayAbroad}
        locale={locale}
        editPeriod={this.setEditPeriod.bind(this)}
      /> : t('pinfo:alert-maxPeriods', {maxPeriods : maxPeriods})}
    </React.Fragment>
  }
}

StayAbroad.propTypes = {
  locale: PT.string,
  t: PT.func
}

export default connect(
  mapStateToProps,
  null
)(
  withTranslation()(StayAbroad)
)
