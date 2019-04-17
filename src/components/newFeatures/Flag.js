import React from 'react'
import classnames from 'classnames'

function Flag(props) {
    return <img className={classnames(props.className, 'flag-image')} src={''.concat(props.flagPath, props.country, props.extention)} />
}

Flag.defaultProps = {
    flagPath: '',
    country: '',
    extention: ''
}

export default Flag