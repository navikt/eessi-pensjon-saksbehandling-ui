import React from 'react'
import PT from 'prop-types'

import { LenkepanelBase, Normaltekst, Undertittel } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import Icons from 'components/ui/Icons'

import './BUCHeader.css'

const BUCHeader = (props) => {
  const { buc, bucInfo, locale, onBUCEdit, style, t } = props

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

  const numberOfSeds = buc.seds ? buc.seds.filter(sed => {
    return sed.status !== 'empty'
  }).length : 0

  return <div
    id={'a-buc-c-bucheader__' + buc.type}
    className='a-buc-c-bucheader'
    style={style}
  >
    <div
      id='a-buc-c-bucheader__label-id'
      className='a-buc-c-bucheader__label col-4'>
      <Undertittel data-qa='BucHeader-type-name'>{buc.type + ' - ' + t('buc:buc-' + buc.type)}</Undertittel>
      <Normaltekst style={{ color: 'grey' }} data-qa='BucHeader-type-dates'>
        {new Date(buc.startDate).toLocaleDateString() + ' - ' + new Date(buc.lastUpdate).toLocaleDateString()}
      </Normaltekst>
    </div>
    <div className='a-buc-c-bucheader__flags col-2'>
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
      <div title={t('buc:form-youhaveXseds', { seds: numberOfSeds })} className='a-buc-c-bucheader__numberofseds'>{numberOfSeds}</div>
      {bucInfo && bucInfo.tags && bucInfo.tags.length > 0
        ? <div title={bucInfo.tags.join(', ')}>
          <Icons kind='problem' data-qa='BucHeader-ProblemCircle' className='a-buc-c-bucheader__tag' />
        </div> : null}
    </div>
    <div className='col-3 a-buc-c-bucheader__actions'>
      <LenkepanelBase data-qa='BucHeader-LinkButton' onClick={(e) => requestHandleBUC(buc, e)} className='a-buc-c-bucheader__button smallerButton knapp' href={'#' + buc.type} border>{t('ui:processing')}</LenkepanelBase>
    </div>
  </div>
}

BUCHeader.propTypes = {
  buc: PT.object.isRequired,
  bucInfo: PT.object,
  locale: PT.string.isRequired,
  onBUCEdit: PT.func,
  style: PT.object,
  t: PT.func.isRequired
}

export default BUCHeader
