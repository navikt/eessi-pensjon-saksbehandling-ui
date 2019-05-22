import React from 'react'
import { Link } from 'react-router-dom'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'

import * as Nav from '../../components/ui/Nav'
import * as routes from '../../constants/routes'

const Links = (props) => {
  const { t } = props

  return <div className='w-links-links'>
    <Nav.Lenkepanel border className='frontPageLink bucLink' linkCreator={(props) => (
      <Link to={routes.BUC + '?sed=&buc='} {...props} />)
    } href='#'>{t('buc:form-createNewCase')}</Nav.Lenkepanel>

    <Nav.Lenkepanel border className='frontPageLink pInfoLink' linkCreator={(props) => (
      <Link to={routes.PINFO} {...props} />)
    } href='#'>{t('pinfo:app-startPinfo')}</Nav.Lenkepanel>

    <Nav.Lenkepanel border className='frontPageLink p4000Link' linkCreator={(props) => (
      <Link to={routes.P4000} {...props} />)
    } href='#'>{t('p4000:app-startP4000')}</Nav.Lenkepanel>
  </div>
}

Links.propTypes = {
  t: PT.func.isRequired,
  gettingStatus: PT.bool
}

export default withTranslation()(Links)
