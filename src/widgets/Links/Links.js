import React from 'react'
import { Link } from 'react-router-dom'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Lenkepanel } from 'components/Nav'
import * as routes from 'constants/routes'

export const Links = (props) => {
  const { t } = props

  return <div className='w-links'>
    <Lenkepanel
      border
      className='frontPageLink bucLink'
      linkCreator={(props) => (
        <Link to={routes.BUC + '?sed=&buc='} {...props} />)
      } href='#'>
      {t('buc:form-createNewCase')}
    </Lenkepanel>
  </div>
}

Links.propTypes = {
  t: PT.func.isRequired
}

export default withTranslation()(Links)
