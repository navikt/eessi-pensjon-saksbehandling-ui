import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import Period from './Period'

import { stayAbroadValidation } from '../Validation/singleTests'
import * as pinfoActions from '../../../actions/pinfo'

const mapStateToProps = (state) => {
  return {
    locale: state.ui.locale,
    stayAbroad: state.pinfo.stayAbroad
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, pinfoActions), dispatch) }
}

class StayAbroad extends React.Component {
  state = {
    error: {},
    editPeriod: undefined
  }

  setEditPeriod (period) {
    this.setState({
      editPeriod: period
    })
  }

  render () {
    const { t, stayAbroad, actions, locale } = this.props
    const { editPeriod } = this.state

    return <div>
      <h2 className='typo-undertittel ml-0 mb-4 appDescription'>{t('pinfo:stayAbroad-title')}</h2>
      {!_.isEmpty(stayAbroad) ? <h3 className='typo-undertittel mb-3'>{t('pinfo:stayAbroad-previousPeriods')}</h3> : null}
      {stayAbroad.map((period, index) => {
        return <Period t={t}
          mode='view'
          current={editPeriod && editPeriod.id === period.id}
          period={period}
          locale={locale}
          periods={stayAbroad}
          setStayAbroad={actions.setStayAbroad}
          editPeriod={this.setEditPeriod.bind(this)}
          key={period.id} />
      })}
      <Period t={t} periods={stayAbroad}
        mode={editPeriod ? 'edit' : 'new'}
        period={editPeriod}
        locale={locale}
        setStayAbroad={actions.setStayAbroad}
      />
    </div>
  }
}

StayAbroad.propTypes = {
  locale: PT.string,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(StayAbroad)
)
