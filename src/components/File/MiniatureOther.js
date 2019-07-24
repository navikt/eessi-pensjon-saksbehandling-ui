import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import Icons from '../Icons'

import './File.css'
import './MiniatureOther.css'

export class MiniatureOther extends Component {
  render () {
    const { t, file, size, onDeleteDocument, className, animate, isHovering, onClick } = this.props

    let extension = file.name.substring(file.name.lastIndexOf('.') + 1)

    return <div title={file.name + '\n' + t('ui:size') + ': ' + size}
      className={classNames('c-file', 'c-miniatureOther', className, { 'animate': animate })}>
      { isHovering ? <div className='link deleteLink'>
        <Icons kind='trashcan' size={15} onClick={onDeleteDocument} />
      </div> : null }
      { isHovering && file.content ? <div className='link downloadLink'>
        <a onClick={(e) => e.stopPropagation()} title={t('ui:download')}
          href={'data:application/octet-stream;base64,' + encodeURIComponent(file.content.base64)}
          download={file.name}>
          <Icons size={'sm'} kind='download' />
        </a>
      </div> : null }
      <div className='miniatureDocument' onClick={onClick}>
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

const MiniatureOtherWithTranslation = withTranslation()(MiniatureOther)

export default MiniatureOtherWithTranslation
