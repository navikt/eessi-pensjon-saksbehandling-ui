import React, { Component } from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import MiniatureOther from './MiniatureOther'
import MiniaturePDF from './MiniaturePDF'
import MiniatureImage from './MiniatureImage'

const units = ['bytes', 'KB', 'MB', 'GB']

class File extends Component {
  renderBytes (bytes) {
    if (!bytes) {
      return '-'
    }
    let level = 0
    while (bytes >= 1024 && ++level) {
      bytes = bytes / 1024
    }
    return bytes.toFixed(bytes >= 10 || level < 1 ? 0 : 1) + ' ' + units[level]
  }

  render () {
    const { file, animate, scale, ui } = this.props

    let _animate = _.isBoolean(animate) ? animate : true
    let _size = this.renderBytes(file.size)
    let _scale = scale || 1.0
    let _ui = ui || 'paper'

    switch (file.mimetype) {
      case 'application/pdf' :
        return <MiniaturePDF animate={_animate} size={_size} scale={_scale} ui={_ui} {...this.props} />
      case 'image/png':
      case 'image/jpeg':
        return <MiniatureImage animate={_animate} size={_size} scale={_scale} ui={_ui} {...this.props} />
      default:
        return <MiniatureOther animate={_animate} size={_size} scale={_scale} ui={_ui} {...this.props} />
    }
  }
}

File.propTypes = {
  file: PT.object.isRequired,
  animate: PT.bool,
  scale: PT.number,
  ui: PT.string
}

export default File
