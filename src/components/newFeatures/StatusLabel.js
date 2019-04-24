import React from 'react'
import classnames from 'classnames'
import './StatusLabel.css'

function StatusLabel (props) {
  const { t } = props
  const status = ['draft', 'sendt', 'received']
  if (status.indexOf(props.status) === -1) {
    return (
      <div data-qa='StatusLabel-unknown' className={classnames(props.className, 'd-inline-flex justify-content-center align-content-center', 'c-ui-status-label', 'c-ui-status-label-unknown')}>
        {t('unknown')}
      </div>
    )
  }
  return (
    <div data-qa={`StatusLabel-${props.status}`} className={classnames(props.className, 'd-inline-flex justify-content-center align-content-center', 'c-ui-status-label', 'c-ui-status-label-' + t(props.status))}>
      {props.status}
    </div>
  )
}

StatusLabel.defaultProps = {
  status: '',
  className: '',
  t: arg => arg
}

export default StatusLabel
