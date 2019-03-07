import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import Icons from '../Icons'

import './File.css'
import './MiniatureOther.css'

class MiniatureOther extends Component {
    state = {
      isHovering: false
    }

    onHandleMouseEnter () {
      this.setState({ isHovering: true })
    }

    onHandleMouseLeave () {
      this.setState({ isHovering: false })
    }

    render () {
      const { t, file, size, onDeleteDocument, className, animate } = this.props

      let extension = file.name.substring(file.name.lastIndexOf('.') + 1)

      return <div title={file.name + '\n' + t('ui:size') + ': ' + size}
        className={classNames('c-ui-file', 'c-ui-miniatureOther', className, { 'animate': animate })}
        onMouseEnter={this.onHandleMouseEnter.bind(this)}
        onMouseLeave={this.onHandleMouseLeave.bind(this)}>
        { this.state.isHovering ? <div className='link deleteLink'>
          <Icons kind='trashcan' size={15} onClick={onDeleteDocument} />
        </div> : null }
        { this.state.isHovering ? <div className='link downloadLink'>
          <a onClick={(e) => e.stopPropagation()} title={t('ui:download')}
            href={'data:application/octet-stream;base64,' + encodeURIComponent(file.content.base64)}
            download={file.name}>
            <Icons size={'sm'} kind='download' />
          </a>
        </div> : null }
        <div className='miniatureDocument'>
          <div className='content'>{extension}</div>
        </div>

      </div>
    }
}

MiniatureOther.propTypes = {
  t: PT.func.isRequired,
  file: PT.object.isRequired,
  size: PT.string,
  animate: PT.bool,
  onDeleteDocument: PT.func,
  className: PT.string
}

export default withTranslation()(MiniatureOther)
