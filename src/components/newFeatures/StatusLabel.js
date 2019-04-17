import React from 'react'
import classnames from 'classnames'
import './StatusLabel.css'

function StatusLabel(props){
    const status = ['utkast', 'sendt', 'mottatt']
    if(status.indexOf(props.status) === -1){
        return (
            <div className={classnames(props.className, 'd-inline-flex justify-content-center align-content-center', 'c-ui-status-label', 'c-ui-status-label-unknown')}>
                ukjent
            </div>
        )
    }
    return (
        <div className={classnames(props.className, 'd-inline-flex justify-content-center align-content-center', 'c-ui-status-label', 'c-ui-status-label-' + props.status)}>
            {props.status}
        </div>
    )
}

StatusLabel.defaultProps = {
    status: '',
    className: ''
}

export default StatusLabel