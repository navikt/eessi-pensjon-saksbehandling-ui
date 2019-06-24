import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Normaltekst, Undertittel, Systemtittel, Element } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import SEDStatus from 'applications/BUC/components/SEDStatus/SEDStatus'
import countries from 'components/ui/CountrySelect/CountrySelectData'
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
    heading={<Systemtittel className='a-buc-c-bucdetail__header'>{t('buc:buc-' + buc.type)}</Systemtittel>}>
    <div className='a-buc-c-bucdetail__body'>
      <dl className='a-buc-c-bucdetail__props'>
        <dt class='odd'><Element>{t('ui:type')}:</Element></dt>
        <dd class='odd'><Normaltekst>{buc.type}</Normaltekst></dd>
        <dt><Element>{t('ui:caseId')}:</Element></dt>
        <dd><Normaltekst>{buc.caseId}</Normaltekst></dd>
        <dt class='odd'><Element>{t('ui:aktoerId')}:</Element></dt>
        <dd class='odd'><Normaltekst>{buc.aktoerId}</Normaltekst></dd>
        <dt><Element>{t('ui:creator')}:</Element></dt>
        <dd><Normaltekst>{buc.creator.institution} ({buc.creator.country})</Normaltekst></dd>
        <dt class='odd'><Element>{t('ui:created')}:</Element></dt>
        <dd class='odd'><Normaltekst>{buc.startDate}</Normaltekst></dd>
        <dt><Element>{t('ui:lastUpdate')}:</Element></dt>
        <dd><Normaltekst>{buc.lastUpdate}</Normaltekst></dd>
        <dt class='odd'><Element>{t('ui:type')}:</Element></dt>
        <dd class='odd'><Normaltekst>{buc.sakType}</Normaltekst></dd>
        <dt><Element>{t('ui:status')}:</Element></dt>
        <dd><SEDStatus t={t} status={buc.status} /></dd>
        <dt class='odd'><Element>{t('ui:tags')}:</Element></dt>
        <dd class='odd'><Normaltekst>{bucInfo && bucInfo.tags ? bucInfo.tags.join(', ') : ''}</Normaltekst></dd>
        <dt><Element>{t('ui:comment')}:</Element></dt>
        <dd><Normaltekst>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</Normaltekst></dd>
      </dl>
      <Undertittel className='mb-2'>{t('buc:form-involvedInstitutions')}:</Undertittel>
      {!_.isEmpty(institutionList) ? Object.keys(institutionList).map(landkode => {
        const country = _.find(countries[locale], {value: landkode})
        return <div
          key={landkode}
          className='a-buc-c-bucdetail__institutions'
          id='a-buc-c-bucdetail__institutions-id'>
          <FlagList locale={locale} items={[{ country: landkode }]} overflowLimit={1} />
          <Element className='pr-2'>{country.label}: </Element>
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
