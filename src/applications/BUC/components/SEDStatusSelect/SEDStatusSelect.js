import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { ToggleKnappPure } from 'components/ui/Nav'
import { connect, bindActionCreators } from 'store'
import * as bucActions from 'actions/buc'

const mapStateToProps = (state) => {
  return {
    statusFilter: state.buc.statusFilter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(bucActions, dispatch)
  }
}

const SEDStatusSelect = (props) => {
  const { t, actions, statusFilter, multiple } = props
  const _multiple = multiple || false

  const onChange = (newStatus) => {
    const index = statusFilter.indexOf(newStatus)
    let newArray = _.cloneDeep(statusFilter)
    if (index >= 0) {
      if (!_multiple) {
        return
      }
      newArray.splice(index, 1)
    } else {
      if (_multiple) {
        newArray.push(newStatus)
      } else {
        newArray = [newStatus]
      }
    }
    actions.setStatusFilter(newArray)
  }

  return <div>
    <ToggleKnappPure pressed={statusFilter.indexOf('inbox') >= 0} onClick={() => onChange('inbox')}>{t('ui:inbox')}</ToggleKnappPure>
    <ToggleKnappPure pressed={statusFilter.indexOf('draft') >= 0} onClick={() => onChange('draft')}>{t('ui:draft')}</ToggleKnappPure>
  </div>
}
SEDStatusSelect.propTypes = {
  t: PT.func.isRequired,
  statusFilter: PT.array.isRequired,
  actions: PT.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SEDStatusSelect)
