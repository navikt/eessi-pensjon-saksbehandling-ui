import React, { useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { FlagList, Icons, Nav } from 'eessi-pensjon-ui'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import './BUCHeader.css'

const BUCHeader = ({ buc, bucInfo, institutionNames, locale, onBUCEdit, rinaUrl, t }) => {
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

  if (buc.error) {
    return (
      <div className='a-buc-c-bucheader'>
        <Nav.AlertStripe type='advarsel' className='w-100'>{buc.error}</Nav.AlertStripe>
      </div>
    )
  }

  return (
    <div
      id={'a-buc-c-bucheader__' + buc.type + '-' + buc.caseId}
      className='a-buc-c-bucheader'
    >
      <Nav.Undertittel
        className='a-buc-c-bucheader__title w-100 pb-1'
      >
        {buc.type + ' - ' + getBucTypeLabel({
          t: t,
          locale: locale,
          type: buc.type
        })}
      </Nav.Undertittel>
      <Nav.Row className='a-buc-c-bucheader__row no-gutters w-100'>
        <div className='a-buc-c-bucheader__label col-sm-4'>

          <Nav.Normaltekst
            id='a-buc-c-bucheader__description-id'
            className='a-buc-c-bucheader__description'
          >
            {t('ui:created')}: {moment(buc.startDate).format('DD.MM.YYYY')}
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
          {buc.caseId ? (
            <div
              id='a-buc-c-bucheader__case-id'
              className='a-buc-c-bucheader__case'
            >
              <Nav.Normaltekst className='pr-2 text-nowrap'>
                {t('buc:form-caseNumberInRina') + ': '}
                <Nav.Lenke
                  className='a-buc-c-bucheader__gotorina-link'
                  href={rinaUrl + buc.caseId}
                  target='rinaWindow'
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(rinaUrl + buc.caseId, 'rinaWindow')
                  }}
                >
                  {buc.caseId}
                </Nav.Lenke>
              </Nav.Normaltekst>
            </div>
          ) : null}
        </div>
        <div className='a-buc-c-bucheader__icons col-sm-4'>
          <FlagList
            locale={locale}
            type='circle'
            size='L'
            items={Object.keys(institutionList).map(landkode => ({
              country: landkode,
              label: institutionList[landkode].map((institutionId) => {
                return institutionNames &&
                Object.prototype.hasOwnProperty.call(institutionNames, institutionId)
                  ? institutionNames[institutionId]
                  : institutionId
              }).join(', ')
            }))}
            overflowLimit={5}
          />
          <div
            className='a-buc-c-bucheader__icon-numberofseds'
            data-tip={t('buc:form-youhaveXseds', { seds: numberOfSeds })}
          >
            {numberOfSeds}
          </div>
          {bucInfo && bucInfo.tags && bucInfo.tags.length > 0
            ? (
              <div
                className='a-buc-c-bucheader__icon-tags'
                data-tip={bucInfo.tags.map(tag => t('buc:' + tag)).join(', ')}
              >
                <Icons kind='problem' size={32} />
              </div>
            ) : null}
        </div>
        <div className='a-buc-c-bucheader__actions col-sm-4'>
          <Nav.Lenke
            id='a-buc-c-bucheader__bucedit-link-id'
            className='a-buc-c-bucheader__bucedit-link knapp text-decoration-none mr-3'
            onClick={(e) => onBucHandle(buc, e)}
            href={'#' + buc.type}
          >
            {t('ui:processing')}
          </Nav.Lenke>
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
  rinaUrl: PT.string,
  t: PT.func.isRequired
}

export default BUCHeader
