import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress, Normaltekst } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import _ from 'lodash'

import './BUCDetail.css'

const BUCDetail = (props) => {
  const { t, buc, className, locale } = props

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
      <Ingress>{buc.buc} {t('buc:buc-' + buc.buc)}</Ingress>
    </div>}>
    <div className='a-buc-c-bucdetail__body'>
      <dl className='a-buc-c-bucdetail__props'>
        <dt>{t('ui:caseId')}:</dt>
        <dd>{buc.caseId}</dd>
        <dt>{t('ui:aktoerId')}:</dt>
        <dd>{buc.aktoerId}</dd>
        <dt>{t('ui:creator')}:</dt>
        <dd>{buc.creator.institution} ({buc.creator.country})</dd>
        <dt>{t('ui:type')}:</dt>
        <dd>{buc.sakType}</dd>
        <dt>{t('ui:status')}:</dt>
        <dd><SEDStatus t={t} status={buc.status} /></dd>
      </dl>
      <Ingress className='mb-2'>{t('buc:form-involvedInstitutions')}:</Ingress>
      {!_.isEmpty(institutionList) ? Object.keys(institutionList).map(landkode => {
        return <div
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
  className: PT.string,
  locale: PT.string.isRequired
}

export default BUCDetail
