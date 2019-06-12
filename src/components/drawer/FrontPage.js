import React, { Component } from 'react'
import PT from 'prop-types'
import { Link } from 'react-router-dom'

import * as routes from '../../constants/routes'
import * as Nav from '../ui/Nav'

class FrontPage extends Component {
  render () {
    let { t } = this.props

    return <div style={{ transform: 'scale(0.8)' }}>
      <h4 className='mb-4'>{t('forms')}</h4>
      <Nav.Lenkepanel style={{ animationDelay: '0s' }} className='frontPageLink bucLink' linkCreator={(props) => (
        <Link to={routes.BUC} {...props} />)
      } href='#'>{t('buc:form-createNewCase')}</Nav.Lenkepanel>
      <Nav.Lenkepanel style={{ animationDelay: '0.2s' }} className='frontPageLink pInfoLink' linkCreator={(props) => (
        <Link to={routes.PINFO} {...props} />)
      } href='#'>{t('pinfo:app-startPinfo')}</Nav.Lenkepanel>
      <Nav.Lenkepanel style={{ animationDelay: '0.3s' }}
        className='frontPageLink p4000Link' linkCreator={(props) => (
          <Link to={routes.P4000} {...props} />)
        } href='#'>{t('p4000:app-startP4000')}</Nav.Lenkepanel>
      <h4 className='mt-4 mb-4'>{t('tools')}</h4>
      <Nav.Lenkepanel style={{ animationDelay: '0.4s' }} className='frontPageLink pdfLink' linkCreator={(props) => (
        <Link to={routes.PDF} {...props} />)
      } href='#'>{t('pdf:app-createPdf')}</Nav.Lenkepanel>
    </div>
  }
}

FrontPage.propTypes = {
  t: PT.func.isRequired
}

export default FrontPage
