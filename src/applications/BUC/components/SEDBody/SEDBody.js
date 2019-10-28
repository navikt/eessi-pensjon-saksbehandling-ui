import React, { useState } from 'react'
import SEDAttachments from '../SEDAttachments/SEDAttachments'

const SEDBody = ({ t, sed }) => {
  const [files, setFiles] = useState(sed.vedlegg)
  return (
    <div className='a-buc-c-sedbody'>
      <SEDAttachments t={t} files={files} setFiles={setFiles} />
    </div>
  )
}

export default SEDBody
