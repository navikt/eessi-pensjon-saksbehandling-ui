import React from 'react'
import SEDAttachments from '../SEDAttachments/SEDAttachments'

const SEDBody = ({ t, files }) => {
  return (
    <div>
      <SEDAttachments t={t} files={files} />
    </div>
  )
}

export default SEDBody
