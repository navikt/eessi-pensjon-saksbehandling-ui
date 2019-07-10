import React from 'react'
import PT from 'prop-types'
import { LenkepanelBase, Normaltekst, Undertittel } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import Icons from 'components/ui/Icons'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'

import './BUCHeader.css'

const BUCHeader = (props) => {
  const { buc, bucInfo, locale, onBUCEdit, style, t } = props

  const onBUChandle = (buc, e) => {
    e.preventDefault()
    e.stopPropagation()
    onBUCEdit(buc)
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

  const numberOfSeds = buc.seds ? buc.seds.filter(sed => sed.status !== 'empty').length : 0

  let attachments = []
  if (buc.seds) {
    buc.seds.forEach(sed => {
      sed.attachments.forEach(att => {
        attachments.push(att)
      })
    })
  }

  return <div
    id={'a-buc-c-bucheader__' + buc.type + '-' + buc.caseId}
    className='a-buc-c-bucheader'
    style={style}>
    <div className='a-buc-c-bucheader__label col-4'>
      <Undertittel className='a-buc-c-bucheader__title'>
        {buc.type + ' - ' + t('buc:buc-' + buc.type)}
      </Undertittel>
      <Normaltekst className='a-buc-c-bucheader__description'>
        {new Date(buc.startDate).toLocaleDateString() + ' - ' + new Date(buc.lastUpdate).toLocaleDateString()}
      </Normaltekst>
      <div className='a-buc-c-bucheader__owner'>
        <Normaltekst className='pr-2'>
          {t('buc:form-caseOwner') + ': '}
        </Normaltekst>
        <InstitutionList className='a-buc-c-bucheader__owner-institutions'
        t={t} locale={locale} type='separated' institutions={[buc.creator]} />
      </div>
    </div>
    <div className='a-buc-c-bucheader__flags col-2'>
      <FlagList
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
    <div className='col-3 a-buc-c-bucheader__icons'>
      <div
        className='a-buc-c-bucheader__icon-numberofseds'
        title={t('buc:form-youhaveXseds', { seds: numberOfSeds })}>
        {numberOfSeds}
      </div>
      {bucInfo && bucInfo.tags && bucInfo.tags.length > 0
        ? <div
          className='a-buc-c-bucheader__icon-tags'
          title={bucInfo.tags.join(', ')}>
          <Icons kind='problem' />
        </div> : null}
      {attachments.length > 0
        ? <div
          className='a-buc-c-bucheader__icon-vedlegg pl-2 pr-2'
          title={t('buc:form-youHaveXAttachmentsInBuc', { attachments: attachments.length })}>
          <Icons kind='paperclip' />
        </div> : null}
    </div>
    <div className='a-buc-c-bucheader__actions col-3'>
      <LenkepanelBase
        id='a-buc-c-bucheader__bucedit-link'
        className='a-buc-c-bucheader__bucedit-link smallerButton knapp mr-5'
        onClick={(e) => onBUChandle(buc, e)}
        href={'#' + buc.type}
        border>
        {t('ui:processing')}
      </LenkepanelBase>
    </div>
  </div>
}

BUCHeader.propTypes = {
  buc: PT.object.isRequired,
  bucInfo: PT.object,
  locale: PT.string.isRequired,
  onBUCEdit: PT.func.isRequired,
  style: PT.object,
  t: PT.func.isRequired
}

export default BUCHeader
