import React from 'react'
import PT from 'prop-types'
import { Link } from 'react-router-dom'
import { Lenkepanel } from 'components/Nav'
import * as routes from 'constants/routes'

const PdfWidget = (props) => {
  const { t, widget } = props

  return <div className='w-PdfWidget p-3'>
    <h4>{widget.title}</h4>
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

PdfWidget.propTypes = {
  t: PT.func.isRequired,
  widget: PT.object.isRequired
}

export default PdfWidget
