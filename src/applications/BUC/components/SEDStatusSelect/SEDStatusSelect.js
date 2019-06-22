import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { ToggleGruppe, Checkbox, ToggleKnapp } from 'components/ui/Nav'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
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
  const { t, actions, statusFilter } = props

  const onChange = (newStatus) => {
    const index = statusFilter.indexOf(newStatus)
    let newArray = _.cloneDeep(statusFilter)
    if (index >= 0) {
      newArray.splice(index, 1)
    } else {
      newArray.push(newStatus)
    }
    actions.setStatusFilter(newArray)
  }

  return <div>
     <ToggleKnapp kompakt pressed={statusFilter.indexOf('empty') >= 0} onClick={() => onChange('empty')}>{t('ui:empty')}</ToggleKnapp>
     <ToggleKnapp kompakt pressed={statusFilter.indexOf('new') >= 0} onClick={() => onChange('new')}>{t('ui:new')}</ToggleKnapp>
     <ToggleKnapp kompakt pressed={statusFilter.indexOf('draft') >= 0} onClick={() => onChange('draft')}>{t('ui:draft')}</ToggleKnapp>
     <ToggleKnapp kompakt pressed={statusFilter.indexOf('received') >= 0} onClick={() => onChange('received')}>{t('ui:received')}</ToggleKnapp>
     <ToggleKnapp kompakt pressed={statusFilter.indexOf('sent') >= 0} onClick={() => onChange('sent')}>{t('ui:sent')}</ToggleKnapp>
    </div>
}
SEDStatusSelect.propTypes = {
  t: PT.func.isRequired,
  statusFilter: PT.array.isRequired,
  actions: PT.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(SEDStatusSelect)
