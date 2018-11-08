import React, { Component } from 'react'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'
import classNames from 'classnames'

import { Ikon } from '../Nav'
import Icons from '../Icons'

import './File.css'
import './MiniatureImage.css'

class MiniatureImage extends Component {
    state = {
      isHovering: false
    }

    onHandleMouseEnter () {
      this.setState({ isHovering: true })
    }

    onHandleMouseLeave () {
      this.setState({ isHovering: false })
    }

    onDeleteDocument (e) {
      e.stopPropagation()
      e.preventDefault()

      const { onDeleteDocument } = this.props

      onDeleteDocument()
    }

    render () {
      const { t, file, size, deleteLink, downloadLink, className, animate, scale } = this.props
      const { isHovering } = this.state

      const title = '' + file.name + '\n' + t('ui:size') + ': ' + size

      return <div title={title} className={classNames('c-ui-file', 'c-ui-miniatureImage', className, { 'animate': animate })}
        onMouseEnter={this.onHandleMouseEnter.bind(this)}
        onMouseLeave={this.onHandleMouseLeave.bind(this)}
        style={{ transform: 'scale(' + scale + ')' }}>
        <div>
          { deleteLink && isHovering ? <div onClick={this.onDeleteDocument.bind(this)} className='link deleteLink'>
            <Ikon size={15} kind='trashcan' />
          </div> : null}
          { downloadLink && isHovering ? <div className='link downloadLink'><a
            onClick={(e) => e.stopPropagation()} title={t('ui:download')}
            href={'data:application/octet-stream;base64,' + encodeURIComponent(file.content.base64)}
            download={file.name}>
            <Icons size={'sm'} kind='download' />
          </a></div> : null}
          <img alt={file.name} style={{ maxWidth: '100px' }} src={'data:' + file.mimetype + ';base64,' + file.content.base64} />
        </div>
      </div>
    }
}

MiniatureImage.propTypes = {
  t: PT.func.isRequired,
  file: PT.object.isRequired,
  size: PT.string,
  animate: PT.bool,
  onDeleteDocument: PT.func,
  deleteLink: PT.bool,
  downloadLink: PT.bool,
  className: PT.string,
  scale: PT.number.isRequired
}

export default withNamespaces()(MiniatureImage)
