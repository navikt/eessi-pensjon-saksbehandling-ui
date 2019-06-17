import React, { useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import MiniatureOther from './MiniatureOther'
import MiniaturePDF from './MiniaturePDF'
import MiniatureImage from './MiniatureImage'

const units = ['bytes', 'KB', 'MB', 'GB']

const renderBytes = (bytes) => {
  if (!bytes) {
    return '-'
  }
  let level = 0
  while (bytes >= 1024 && ++level) {
    bytes = bytes / 1024
  }
  return bytes.toFixed(bytes >= 10 || level < 1 ? 0 : 1) + ' ' + units[level]
}

const File = (props) => {
  const { file, animate, scale, ui, onClick } = props
  const [ isHovering, setIsHovering ] = useState(false)

  const _animate = _.isBoolean(animate) ? animate : true
  const _size = renderBytes(file.size)
  const _scale = scale || 1.0
  const _ui = ui || 'paper'

  const onHandleMouseEnter = () => {
    setIsHovering(true)
  }

  const onHandleMouseLeave = () => {
    setIsHovering(false)
  }

  if (!file.content) {
    return <div onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
      <MiniatureOther isHovering={isHovering}
        animate={_animate} size={_size} scale={_scale} ui={_ui} {...props} />
    </div>
  }
  switch (file.mimetype) {
    case 'application/pdf' :
      return <div onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
        <MiniaturePDF isHovering={isHovering}
          animate={_animate} size={_size} scale={_scale} ui={_ui} {...props} />
      </div>
    case 'image/png':
    case 'image/jpeg':
      return <div onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
        <MiniatureImage isHovering={isHovering}
          animate={_animate} size={_size} scale={_scale} ui={_ui} {...props} />
      </div>
    default:
      return <div onMouseEnter={onHandleMouseEnter} onMouseLeave={onHandleMouseLeave}>
        <MiniatureOther isHovering={isHovering}
          animate={_animate} size={_size} scale={_scale} ui={_ui} {...props} />
      </div>
  }
}

File.propTypes = {
  file: PT.object.isRequired,
  animate: PT.bool,
  scale: PT.number,
  ui: PT.string,
  onClick: PT.func
}

export default File
