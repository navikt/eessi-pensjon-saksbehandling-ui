import React from 'react'
import PT from 'prop-types'
import { Element, PanelBase, Normaltekst, Lenke } from 'components/ui/Nav'
import classNames from 'classnames'
import SEDStatus from '../SEDStatus/SEDStatus'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import Icons from 'components/ui/Icons'
import _ from 'lodash'

import './SEDRow.css'

const SEDRow = (props) => {
  const { t, sed, className, locale, rinaId, rinaUrl, border = false } = props

  const institutionList = sed.participants ? sed.participants.map(participant => {
    return {
      country: participant.organisation.countryCode,
      institution: participant.organisation.name
    }
  }) : []

  return <PanelBase
    className={classNames('a-buc-c-sedrow p-0', className)}>
    <div className={classNames('a-buc-c-sedrow__content pt-3 pb-3', { withborder: border })}>
      <div className='col-4 a-buc-c-sedrow__column a-buc-c-sedrow__info'>
        <Element className='pb-2' data-qa='SedLabel-name'>{sed.type}</Element>
        <div className='a-buc-c-sedrow__info-dates'>
          <SEDStatus data-qa='SedLabel-SEDStatus' t={t} className='col-auto' status={sed.status} />
          <div data-qa='SedLabel-date' className='col'>
            <div className='a-buc-c-sedrow__info-date'>
              <Element>{t('ui:created')}:</Element>
              <Normaltekst>{new Date(sed.creationDate).toLocaleDateString()}</Normaltekst>
            </div>
            <div className='a-buc-c-sedrow__info-date'>
              <Element>{t('ui:lastUpdate')}:</Element>
              <Normaltekst>{new Date(sed.lastUpdate).toLocaleDateString()}</Normaltekst>
            </div>
          </div>
        </div>
      </div>
      <div className='col-4 a-buc-c-sedrow__column a-buc-c-sedrow__institutions'>
        <Element className='pb-2' >{t('ui:institutions')}</Element>
        <InstitutionList t={t} locale={locale} type='separated' institutions={institutionList} />
      </div>
      <div className='col-4 a-buc-c-sedrow__column a-buc-c-sedrow__actions'>
        <Element className='pb-2' >{t('ui:actions')}</Element>
        <div>{!_.isEmpty(sed.attachments) ? <Icons kind='vedlegg' /> : null}
          <Lenke target='_blank'
            id='a-buc-c-sedrow__gotorina-button'
            className='a-buc-c-sedrow__gotorina'
            href={rinaUrl + rinaId}>{t('ui:goToRina')}</Lenke>
        </div>
      </div>
    </div>
  </PanelBase>
}

SEDRow.propTypes = {
  t: PT.func.isRequired,
  className: PT.string,
  sed: PT.object.isRequired,
  border: PT.bool
}

export default SEDRow
