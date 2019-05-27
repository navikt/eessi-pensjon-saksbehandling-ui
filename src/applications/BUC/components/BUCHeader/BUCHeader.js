import React from 'react'
import PT from 'prop-types'

import * as Nav from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import Icons from 'components/ui/Icons'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'

import './BUCHeader.css'

const BUCHeader = (props) => {
  const { t, locale, buc, onBUCEdit } = props

  const requestHandleBUC = (buc, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof onBUCEdit === 'function') {
      onBUCEdit(buc)
    }
  }

  let institutionList = {}
  if (buc.institusjon) {
    buc.institusjon.forEach(institution => {
      if (institutionList.hasOwnProperty(institution.country)) {
        institutionList[institution.country].push(institution.institution)
      } else {
        institutionList[institution.country] = [institution.institution]
      }
    })
  }

  return <div
    className='a-buc-c-bucheader'
    id={'a-buc-c-bucheader__' + buc.buc}>
    <div className='col-4 a-buc-c-bucheader__label'>
      <Nav.Ingress data-qa='BucHeader-type-name'>{buc.buc + ' - ' + t('buc:buc-' + buc.buc)}</Nav.Ingress>
    </div>
    <div className='col-4 a-buc-c-bucheader__flags'>
      <FlagList data-qa='BucHeader-FlagList'
        locale={locale}
        items={Object.keys(institutionList).map(landkode => {
          return {
            country: landkode,
            label: institutionList[landkode].join(', ')
          }
        })}
        overflowLimit={5} />
    </div>
    <div className='col-2 a-buc-c-bucheader__actions'>
      <Nav.LenkepanelBase data-qa='BucHeader-LinkButton' onClick={(e) => requestHandleBUC(buc, e)} className='a-buc-c-bucheader__button smallerButton knapp' href={'#' + buc.buc} border>{t('ui:processing')}</Nav.LenkepanelBase>
    </div>
    <div className='col-2 a-buc-c-bucheader__tags'>
      <SEDStatus t={t} status={buc.status} />
      {buc.merknader && buc.merknader.length > 0
        ? <Icons kind='problem' data-qa='BucHeader-ProblemCircle' className='a-buc-c-bucheader__tag' />
        : null
      }
    </div>
  </div>
}

BUCHeader.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  locale: PT.string.isRequired,
  onBUCEdit: PT.func
}

export default BUCHeader
