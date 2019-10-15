import React, { useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { FlagList, Icons, Nav } from 'eessi-pensjon-ui'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import './BUCHeader.css'

const BUCHeader = ({ buc, bucInfo, institutionNames, locale, onBUCEdit, t }) => {
  const institutionList = {}
  const attachments = []
  const numberOfSeds = buc.seds ? buc.seds.filter(sed => sed.status !== 'empty').length : 0

  const onBucHandle = useCallback((buc, e) => {
    e.preventDefault()
    e.stopPropagation()
    onBUCEdit(buc)
  }, [onBUCEdit])

  if (_.isArray(buc.institusjon)) {
    buc.institusjon.forEach(institution => {
      if (Object.prototype.hasOwnProperty.call(institutionList, institution.country)) {
        institutionList[institution.country].push(institution.institution)
      } else {
        institutionList[institution.country] = [institution.institution]
      }
    })
  }

  if (_.isArray(buc.seds)) {
    buc.seds.forEach(sed => {
      sed.attachments.forEach(att => {
        attachments.push(att)
      })
    })
  }

  return (
    <div
      id={'a-buc-c-bucheader__' + buc.type + '-' + buc.caseId}
      className='a-buc-c-bucheader'
    >
      <Nav.Undertittel
        className='a-buc-c-bucheader__title w-100 pl-3 pb-1'
      >
        {buc.type + ' - ' + t('buc:buc-' + buc.type)}
      </Nav.Undertittel>
      <Nav.Row className='a-buc-c-bucheader__row w-100'>
        <div className='a-buc-c-bucheader__label col-sm-4'>

          <Nav.Normaltekst
            id='a-buc-c-bucheader__description-id'
            className='a-buc-c-bucheader__description'
          >
            {new Date(buc.startDate).toLocaleDateString() + ' - ' + new Date(buc.lastUpdate).toLocaleDateString()}
          </Nav.Normaltekst>
          <div
            id='a-buc-c-bucheader__owner-id'
            className='a-buc-c-bucheader__owner'
          >
            <Nav.Normaltekst className='pr-2 text-nowrap'>
              {t('buc:form-caseOwner') + ': '}
            </Nav.Normaltekst>
            <InstitutionList
              t={t}
              flagType='circle'
              id='a-buc-c-bucheader__owner-institutions-id'
              className='a-buc-c-bucheader__owner-institutions'
              institutionNames={institutionNames}
              locale={locale}
              type='separated'
              institutions={[buc.creator]}
            />
          </div>
        </div>
        <div className='a-buc-c-bucheader__flags col-sm-2'>
          <FlagList
            locale={locale}
            type='circle'
            size='L'
            items={Object.keys(institutionList).map(landkode => {
              return {
                country: landkode,
                label: institutionList[landkode].join(', ')
              }
            })}
            overflowLimit={5}
          />
        </div>
        <div className='a-buc-c-bucheader__icons col-sm-3'>
          <div
            className='a-buc-c-bucheader__icon-numberofseds'
            title={t('buc:form-youhaveXseds', { seds: numberOfSeds })}
          >
            {numberOfSeds}
          </div>
          {bucInfo && bucInfo.tags && bucInfo.tags.length > 0
            ? (
              <div
                className='a-buc-c-bucheader__icon-tags'
                title={bucInfo.tags.join(', ')}
              >
                <Icons kind='problem' />
              </div>
            ) : null}
          {attachments.length > 0
            ? (
              <div
                className='a-buc-c-bucheader__icon-vedlegg pl-2 pr-2'
                title={t('buc:form-youHaveXAttachmentsInBuc', { attachments: attachments.length })}
              >
                <Icons kind='paperclip' />
              </div>
            ) : null}
        </div>
        <div className='a-buc-c-bucheader__actions col-sm-3'>
          <Nav.LenkepanelBase
            id='a-buc-c-bucheader__bucedit-link'
            className='a-buc-c-bucheader__bucedit-link knapp'
            onClick={(e) => onBucHandle(buc, e)}
            href={'#' + buc.type}
            border
          >
            {t('ui:processing')}
          </Nav.LenkepanelBase>
        </div>
      </Nav.Row>
    </div>
  )
}

BUCHeader.propTypes = {
  buc: PT.object.isRequired,
  bucInfo: PT.object,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  onBUCEdit: PT.func.isRequired,
  t: PT.func.isRequired
}

export default BUCHeader
