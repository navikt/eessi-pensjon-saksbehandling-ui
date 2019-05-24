import React from 'react'
import PT from 'prop-types'
import { Element, PanelBase, Flatknapp } from 'components/ui/Nav'
import classNames from 'classnames'
import SEDStatus from '../SEDStatus/SEDStatus'

import './SEDRow.css'

const SEDRow = (props) => {

  const { t, sed, className, border = false } = props

  const onGoToRinaClick = () => {}

  return <PanelBase
    className={classNames('a-buc-c-sedrow p-0', className)}>
    <div className={classNames('a-buc-c-sedrow__content pt-3 pb-3', { withborder: border })}>
      <div className='col-2 a-buc-c-sedrow__name'>
        <Element data-qa='SedLabel-name'>
          {sed.name}
        </Element>
      </div>
      <div className='col-4 a-buc-c-sedrow__status pl-0 pr-0'>
        <SEDStatus data-qa='SedLabel-SEDStatus' t={t} className='col-auto' status={sed.status} />
        <div data-qa='SedLabel-date' className='col'>
          {sed.date}
        </div>
      </div>
      <div className='col-4 a-buc-c-sedrow__institutions'>
        {sed.institutions.map(el => {
          return <div key={el.country + el.institution} className='a-buc-c-sedrow__institution'>
            <Element className='mr-2' data-qa='SedLabel-country'>{el.country}{': '}</Element>
            <span>{el.institution}</span>
          </div>
        })}
      </div>
      <div className='col-2 a-buc-c-sedrow__actions'>
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
