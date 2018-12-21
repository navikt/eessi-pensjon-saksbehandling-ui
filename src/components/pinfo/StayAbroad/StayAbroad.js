import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import * as Nav from '../../ui/Nav'
import Period from './Period'

import * as pinfoActions from '../../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    stayAbroad: state.pinfo.stayAbroad,
    comment: state.pinfo.comment
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class StayAbroad extends React.Component {
  state = {
    _period: {}
  }

  setComment (e) {
    const { actions } = this.props
    actions.setComment(e.target.value)
  }

  setEditPeriod (period) {
    this.setState({
      _period: period
    })
  }

  render () {
    const { t, stayAbroad, locale, mode, comment } = this.props
    const { _period } = this.state

    return <React.Fragment>
      <Nav.Undertittel>{t('pinfo:stayAbroad-title')}</Nav.Undertittel>
      {mode !== 'view' ? <Nav.Undertekst className='mb-4'>{t('pinfo:stayAbroad-description')}</Nav.Undertekst> : null}
      {!_.isEmpty(stayAbroad) ? <Nav.Undertittel className='mb-3'>{t('pinfo:stayAbroad-previousPeriods')}</Nav.Undertittel> : null}
      {stayAbroad.map((period, index) => {
        return <Period t={t}
          mode='view'
          current={_period.id === period.id}
          first={index === 0}
          last={index === stayAbroad.length - 1}
          period={period}
          locale={locale}
          periods={stayAbroad}
          editPeriod={this.setEditPeriod.bind(this)}
          key={period.id} />
      })}
      {mode !== 'view' ? <Period t={t}
        periods={stayAbroad}
        mode={_.isEmpty(_period) ? 'new' : 'edit'}
        period={_period}
        locale={locale}
        editPeriod={this.setEditPeriod.bind(this)}
      /> : <div className='mt-4'>
        <Nav.Textarea id='pinfo-comment'
          label={t('pinfo:stayAbroad-comment')}
          placeholder={t('ui:writeIn')}
          value={comment || ''}
          style={{ minHeight: '100px' }}
          maxLength={200}
          onChange={this.setComment.bind(this)}
        />
      </div>
      }

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
  mapDispatchToProps
)(
  withNamespaces()(StayAbroad)
)
