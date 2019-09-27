import React from 'react'
import PT from 'prop-types'
import { Link } from 'react-router-dom'
import { Nav } from 'eessi-pensjon-ui'
import * as routes from 'constants/routes'

const PdfWidget = (props) => {
  const { t, widget } = props

  return (
    <div className='w-PdfWidget p-3'>
      <h4>{widget.title}</h4>
      <Nav.Lenkepanel
        border
        className='link pdfLink'
        linkCreator={(props) => (
          <Link to={routes.PDF} {...props} />)} href='#'
      >
        {t('pdf:app-createPdf')}
      </Nav.Lenkepanel>
    </div>
  )
}

PdfWidget.propTypes = {
  t: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default PdfWidget
