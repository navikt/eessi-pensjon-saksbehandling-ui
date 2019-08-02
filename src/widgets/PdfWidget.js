import React from 'react'
import { Link } from 'react-router-dom'
import { Lenkepanel } from 'components/Nav'
import * as routes from 'constants/routes'

const PdfWidget = (props) => {
  return <div className='w-PdfWidget p-3'>
    <h4>{props.widget.title}</h4>
    <Lenkepanel
      border
      className='link pdfLink'
      linkCreator={(props) => (
        <Link to={routes.PDF} {...props} />)
      } href='#'>
        {props.t('pdf:app-createPdf')}
      </Lenkepanel>
  </div>
}

export default PdfWidget
