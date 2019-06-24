import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress, Normaltekst } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import _ from 'lodash'

import './BUCDetail.css'

const BUCDetail = (props) => {
  const { t, buc, bucInfo, className, locale } = props

  let institutionList = {}
  if (buc.institusjon) {
    buc.institusjon.forEach(item => {
      if (institutionList.hasOwnProperty(item.country)) {
        institutionList[item.country].push(item.institution)
      } else {
        institutionList[item.country] = [item.institution]
      }
    })
  }

  return <EkspanderbartpanelBase
    apen
    className={classNames('a-buc-c-bucdetail', className)}
    id='a-buc-c-bucdetail__panel-id'
    heading={<div
      className='a-buc-c-bucdetail__header'>
      <Ingress>{buc.type} {t('buc:buc-' + buc.type)}</Ingress>
    </div>}>
    <div className='a-buc-c-bucdetail__body'>
      <dl className='a-buc-c-bucdetail__props'>
        <dt>{t('ui:caseId')}:</dt>
        <dd>{buc.caseId}</dd>
        <dt class='odd'>{t('ui:aktoerId')}:</dt>
        <dd class='odd'>{buc.aktoerId}</dd>
        <dt>{t('ui:creator')}:</dt>
        <dd>{buc.creator.institution} ({buc.creator.country})</dd>
        <dt class='odd'>{t('ui:created')}:</dt>
        <dd class='odd'>{buc.startDate}</dd>
        <dt>{t('ui:lastUpdate')}:</dt>
        <dd>{buc.lastUpdate}</dd>
        <dt class='odd'>{t('ui:type')}:</dt>
        <dd class='odd'>{buc.sakType}</dd>
        <dt>{t('ui:status')}:</dt>
        <dd><SEDStatus t={t} status={buc.status} /></dd>
        <dt class='odd'>{t('ui:tags')}:</dt>
        <dd class='odd'>{bucInfo && bucInfo.tags ? bucInfo.tags.join(', ') : ''}</dd>
        <dt>{t('ui:comment')}:</dt>
        <dd>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</dd>
      </dl>
      <Ingress className='mb-2'>{t('buc:form-involvedInstitutions')}:</Ingress>
      {!_.isEmpty(institutionList) ? Object.keys(institutionList).map(landkode => {
        return <div
          key={landkode}
          className='a-buc-c-bucdetail__institutions'
          id='a-buc-c-bucdetail__institutions-id'>
          <FlagList locale={locale} items={[{ country: landkode }]} overflowLimit={1} />
          <Normaltekst>{institutionList[landkode].join(', ')}</Normaltekst>
        </div>
      }) : <Normaltekst>{t('buc:form-noInstitutionYet')}</Normaltekst>}
    </div>
  </EkspanderbartpanelBase>
}

BUCDetail.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  bucInfo: PT.object.isRequired,
  className: PT.string,
  locale: PT.string.isRequired
}

export default BUCDetail
