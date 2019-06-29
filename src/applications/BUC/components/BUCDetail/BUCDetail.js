import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

import { EkspanderbartpanelBase, Element, EtikettLiten, Normaltekst, Systemtittel, Undertittel } from 'components/ui/Nav'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'

import './BUCDetail.css'

const BUCDetail = (props) => {
  const { buc, bucInfo, className, locale, t } = props

  return <EkspanderbartpanelBase
    id='a-buc-c-bucdetail__panel-id'
    className={classNames('a-buc-c-bucdetail', className)}
    apen
    heading={<Systemtittel
      id='a-buc-c-bucdetail__header-id'
      className='a-buc-c-bucdetail__header'>
      {t('buc:buc-' + buc.type)}
    </Systemtittel>}>
    <div className='a-buc-c-bucdetail__body'>
      <dl className='a-buc-c-bucdetail__props'>
        <dt className='odd'>
          <Element>{t('ui:type')}:</Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-type'>
          <Normaltekst>{buc.type}</Normaltekst>
        </dd>
        <dt>
          <Element>{t('ui:caseId')}:</Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-caseId'>
          <Normaltekst>{buc.caseId}</Normaltekst>
        </dd>
        <dt className='odd'>
          <Element>{t('ui:aktoerId')}:</Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-aktoerId'>
          <Normaltekst>{buc.aktoerId}</Normaltekst>
        </dd>
        <dt>
          <Element>{t('ui:creator')}:</Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-creator'>
          <Normaltekst>{buc.creator.institution} ({buc.creator.country})</Normaltekst>
        </dd>
        <dt className='odd'>
          <Element>{t('ui:created')}:</Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-startDate'>
          <Normaltekst>{buc.startDate}</Normaltekst>
        </dd>
        <dt>
          <Element>{t('ui:lastUpdate')}:</Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-lastUpdate'>
          <Normaltekst>{buc.lastUpdate}</Normaltekst>
        </dd>
        <dt className='odd'>
          <Element>{t('ui:type')}:</Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-sakType'>
          <Normaltekst>{buc.sakType || '-'}</Normaltekst>
        </dd>
        <dt>
          <Element>{t('ui:status')}:</Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-status'>
          <Normaltekst>{t('ui:' + buc.status)}</Normaltekst>
        </dd>
        <dt className='odd'>
          <Element>{t('ui:tags')}:</Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-tags'>
          <EtikettLiten>{bucInfo && bucInfo.tags ? bucInfo.tags.join(', ') : ''}</EtikettLiten>
        </dd>
        <dt>
          <Element>{t('ui:comment')}:</Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-comment'>
          <Normaltekst>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</Normaltekst>
        </dd>
      </dl>
      <Undertittel
        id='a-buc-c-bucdetail__institutions-id'
        className='mb-2'>
        {t('buc:form-involvedInstitutions')}:
      </Undertittel>
      <InstitutionList t={t} institutions={buc.institusjon} locale={locale} type='joined' />
    </div>
  </EkspanderbartpanelBase>
}

BUCDetail.propTypes = {
  buc: PT.object.isRequired,
  bucInfo: PT.object.isRequired,
  className: PT.string,
  locale: PT.string.isRequired,
  t: PT.func.isRequired
}

export default BUCDetail
