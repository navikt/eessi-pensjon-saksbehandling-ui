import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import Icons from 'components/Icons'

import './MiniatureImage.css'

export const MiniatureImage = (props) => {
  const { animate, className, deleteLink, downloadLink, file, isHovering, onClick, onDeleteDocument, scale, size, t } = props
  const title = '' + file.name + '\n' + t('ui:size') + ': ' + size

  return (
    <div
      className={classNames('c-file-miniatureImage', className, { animate: animate })}
      title={title}
      style={{ transform: 'scale(' + scale + ')' }}
    >
      <div>
        {deleteLink && isHovering
          ? (
            <div
              className='link deleteLink'
              onClick={onDeleteDocument}
            >
              <Icons kind='trashcan' size={15} />
            </div>
          )
          : null}
        {downloadLink && isHovering
          ? (
            <div className='link downloadLink'>
              <a
                onClick={(e) => e.stopPropagation()} title={t('ui:download')}
                href={'data:application/octet-stream;base64,' + encodeURIComponent(file.content.base64)}
                download={file.name}
              >
                <Icons size='sm' kind='download' />
              </a>
            </div>
          ) : null}
        <div className='content' onClick={onClick}>
          <img
            alt={file.name}
            style={{ maxWidth: '100px' }}
            src={'data:' + file.mimetype + ';base64,' + file.content.base64}
          />
        </div>
      </div>
    </div>
  )
}

MiniatureImage.propTypes = {
  animate: PT.bool,
  className: PT.string,
  deleteLink: PT.bool,
  downloadLink: PT.bool,
  file: PT.object.isRequired,
  isHovering: PT.bool,
  onClick: PT.func,
  onDeleteDocument: PT.func,
  scale: PT.number.isRequired,
  size: PT.string,
  t: PT.func.isRequired
}

export default MiniatureImage
