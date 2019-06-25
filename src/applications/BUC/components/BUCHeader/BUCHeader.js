import React from 'react'
import PT from 'prop-types'

import * as Nav from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import Icons from 'components/ui/Icons'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'

import './BUCHeader.css'

const BUCHeader = (props) => {
  const { t, locale, buc, bucInfo, onBUCEdit } = props

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

  const numberOfSeds = buc.seds ? buc.seds.length : 0
  return <div
    className='a-buc-c-bucheader'
    id={'a-buc-c-bucheader__' + buc.type}>
    <div className='col-4 a-buc-c-bucheader__label'>
      <Nav.Undertittel data-qa='BucHeader-type-name'>{buc.type + ' - ' + t('buc:buc-' + buc.type)}</Nav.Undertittel>
      <Nav.Normaltekst style={{ color: 'grey' }} data-qa='BucHeader-type-dates'>{buc.startDate + ' - ' + buc.lastUpdate}</Nav.Normaltekst>
    </div>
    <div className='col-2 a-buc-c-bucheader__flags'>
      <FlagList data-qa='BucHeader-FlagList'
        locale={locale}
        size='L'
        items={Object.keys(institutionList).map(landkode => {
          return {
            country: landkode,
            label: institutionList[landkode].join(', ')
          }
        })}
        overflowLimit={5} />
    </div>
    <div className='col-3 a-buc-c-bucheader__tags'>
      <div title={t('buc:form-youhaveXseds', {seds: numberOfSeds})} className='a-buc-c-bucheader__numberofseds'>{numberOfSeds}</div>
      {bucInfo && bucInfo.tags && bucInfo.tags.length > 0
        ? <div title={bucInfo.tags.join(', ')}>
          <Icons kind='problem' data-qa='BucHeader-ProblemCircle' className='a-buc-c-bucheader__tag' />
        </div> : null}
      {/*<SEDStatus t={t} status={buc.status} />*/}
    </div>
    <div className='col-3 a-buc-c-bucheader__actions'>
      <Nav.LenkepanelBase data-qa='BucHeader-LinkButton' onClick={(e) => requestHandleBUC(buc, e)} className='a-buc-c-bucheader__button smallerButton knapp' href={'#' + buc.type} border>{t('ui:processing')}</Nav.LenkepanelBase>
    </div>
  </div>
}

BUCHeader.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  bucInfo: PT.object,
  locale: PT.string.isRequired,
  onBUCEdit: PT.func
}

export default BUCHeader
