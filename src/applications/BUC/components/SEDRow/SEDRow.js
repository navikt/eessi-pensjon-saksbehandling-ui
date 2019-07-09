import React from 'react'
import PT from 'prop-types'
import { Element, PanelBase, Normaltekst, Flatknapp } from 'components/ui/Nav'
import classNames from 'classnames'
import SEDStatus from '../SEDStatus/SEDStatus'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import Icons from 'components/ui/Icons'
import _ from 'lodash'

import './SEDRow.css'

const SEDRow = (props) => {
  const { t, sed, className, locale, border = false, onSEDNew } = props

  const institutionList = sed.participants ? sed.participants.map(participant => {
    return {
      country: participant.organisation.countryCode,
      institution: participant.organisation.name
    }
  }) : []
  return <PanelBase
    className={classNames('a-buc-c-sedrow p-0', className)}>
    <div className={classNames('a-buc-c-sedrow__content pt-3 pb-3', { withborder: border })}>
      <div className='col-2 a-buc-c-sedrow__column a-buc-c-sedrow__name'>
        <Element>{sed.type}</Element>
      </div>
      <div className='col-4 a-buc-c-sedrow__column a-buc-c-sedrow__status'>
        <SEDStatus data-qa='SedLabel-SEDStatus' t={t} className='col-auto' status={sed.status} />
        <Normaltekst className='pl-2'>
          {new Date(sed.creationDate).toLocaleDateString()}
          {sed.lastUpdate && sed.status !== 'received' && sed.status !== 'sent'
            ? ' - ' + new Date(sed.lastUpdate).toLocaleDateString() : ''}
        </Normaltekst>
      </div>
      <div className='col-4 a-buc-c-sedrow__column a-buc-c-sedrow__institutions'>
        <InstitutionList t={t} locale={locale} type='separated' institutions={institutionList} />
      </div>
      <div className='col-2 a-buc-c-sedrow__column a-buc-c-sedrow__actions'>
        {!_.isEmpty(sed.attachments) ? <div
          title={t('buc:form-youHaveXAttachmentsInSed', { attachments: sed.attachments.length })}>
          <Icons kind='paperclip' />
        </div> : null}
        {sed.status === 'received'
          ? <Flatknapp mini onClick={onSEDNew}>{t('buc:form-answerSED')}</Flatknapp>
          : null}
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
