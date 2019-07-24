import React from 'react'
import { Link } from 'react-router-dom'
import * as Nav from '../components/Nav'
import * as routes from '../constants/routes'

const PdfWidget = (props) => {
  return <div className='c-ui-d-PdfWidget p-3'>
    <h4>{props.widget.title}</h4>
    <Nav.Lenkepanel border className='link pdfLink' linkCreator={(props) => (
      <Link to={routes.PDF} {...props} />)
    } href='#'>{props.t('pdf:app-createPdf')}</Nav.Lenkepanel>
  </div>
}

export default PdfWidget
