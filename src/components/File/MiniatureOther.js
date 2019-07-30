import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Icons from 'components/Icons'

import './MiniatureOther.css'

export const MiniatureOther = (props) => {
  const { animate, className, file, isHovering, onClick, onDeleteDocument, size, t } = props
  const extension = file.name.substring(file.name.lastIndexOf('.') + 1)

  return <div
    className={classNames('c-file-miniatureOther', className, { animate: animate })}>
    title={file.name + '\n' + t('ui:size') + ': ' + size}
    { isHovering
      ? <div className='link deleteLink'>
        <Icons kind='trashcan' size={15} onClick={onDeleteDocument} />
      </div> : null }
    { isHovering && file.content
      ? <div
        className='link downloadLink'>
        <a
          onClick={(e) => e.stopPropagation()}
          title={t('ui:download')}
          href={'data:application/octet-stream;base64,' + encodeURIComponent(file.content.base64)}
          download={file.name}>
          <Icons size={'sm'} kind='download' />
        </a>
      </div>
      : null }
    <div className='content' onClick={onClick}>
      <div className='extension'>{extension}</div>
    </div>
  </div>
}

MiniatureOther.propTypes = {
  animate: PT.bool,
  className: PT.string,
  file: PT.object.isRequired,
  isHovering: PT.bool,
  onClick: PT.func,
  onDeleteDocument: PT.func,
  size: PT.string,
  t: PT.func.isRequired
}

export default MiniatureOther
