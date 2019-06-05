import React from 'react'
import PT from 'prop-types'
import { Element, PanelBase, Normaltekst, Flatknapp } from 'components/ui/Nav'
import classNames from 'classnames'
import SEDStatus from '../SEDStatus/SEDStatus'
import FlagList from 'components/ui/Flag/FlagList'
import Icons from 'components/ui/Icons'
import _ from 'lodash'

import './SEDRow.css'

const SEDRow = (props) => {
  const { t, sed, className, locale, border = false } = props

  const onGoToRinaClick = () => {}

  return <PanelBase
    className={classNames('a-buc-c-sedrow p-0', className)}>
    <div className={classNames('a-buc-c-sedrow__content pt-3 pb-3', { withborder: border })}>
      <div className='col-2 a-buc-c-sedrow__name'>
        <Element data-qa='SedLabel-name'>
          {sed.type}
        </Element>
      </div>
      <div className='col-4 a-buc-c-sedrow__status pl-0 pr-0'>
        <SEDStatus data-qa='SedLabel-SEDStatus' t={t} className='col-auto' status={sed.status} />
        <div data-qa='SedLabel-date' className='col'>
          <Normaltekst>{t('ui:created')}: {new Date(sed.creationDate).toLocaleDateString()}</Normaltekst>
          <Normaltekst>{t('ui:lastUpdate')}: {sed.lastUpdate}</Normaltekst>
        </div>
      </div>
      <div className='col-4 a-buc-c-sedrow__institutions'>
        {sed.participants ? sed.participants.map(participant => {
          return <div key={participant.organisation.id} className='a-buc-c-sedrow__institution'>
            <FlagList locale={locale} items={[{
              country: participant.organisation.countryCode
            }]} />
            <span>{participant.organisation.name}</span>
          </div>
        }) : null}
      </div>
      <div className='col-2 a-buc-c-sedrow__actions'>
        {!_.isEmpty(sed.attachments) ? <Icons kind='vedlegg' /> : null}
        <Flatknapp
          id='a-buc-c-sedrow__gotorina-button'
          className='a-buc-c-sedrow__gotorina smallerButton'
          onClick={onGoToRinaClick}>{t('ui:goToRina')}</Flatknapp>
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
