import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { EkspanderbartpanelBase, Element, EtikettLiten, Lenke, Normaltekst, Systemtittel, Undertittel } from 'components/Nav'
import './BUCDetail.css'

const BUCDetail = ({ buc, bucInfo, className, institutionNames, locale, rinaUrl, t }) => {
  return (
    <EkspanderbartpanelBase
      id='a-buc-c-bucdetail__panel-id'
      className={classNames('a-buc-c-bucdetail', 's-border', className)}
      apen
      heading={
        <Systemtittel
          id='a-buc-c-bucdetail__header-id'
          className='a-buc-c-bucdetail__header'
        >
          {t('buc:buc-' + buc.type)}
        </Systemtittel>
      }
    >
      <div className='a-buc-c-bucdetail__body'>
        <dl className='a-buc-c-bucdetail__props'>
          <dt className='odd'>
            <Element>{t('buc:form-buc-type')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-type-id'>
            <Normaltekst>{buc.type}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:caseIdInRina')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-caseId-id'>
            <Lenke
              id='a-buc-c-bucdetail__gotorina-link-id'
              className='a-buc-c-bucdetail__gotorina-link'
              href={rinaUrl + buc.caseId}
              target='rinaWindow'
            >
              {buc.caseId}
            </Lenke>
          </dd>
          <dt className='odd'>
            <Element>{t('ui:aktoerId')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-aktoerId-id'>
            <Normaltekst>{buc.aktoerId}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:creator')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-creator-id'>
            <Normaltekst>{buc.creator.institution} ({buc.creator.country})</Normaltekst>
          </dd>
          <dt className='odd'>
            <Element>{t('ui:created')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-startDate-id'>
            <Normaltekst>{moment(buc.startDate).format('Y-M-D')}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:lastUpdate')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-lastUpdate-id'>
            <Normaltekst>{moment(buc.lastUpdate).format('Y-M-D')}</Normaltekst>
          </dd>
          <dt className='odd'>
            <Element>{t('buc:form-buc-saktype')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-sakType-id'>
            <Normaltekst>{buc.sakType || '-'}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:status')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-status-id'>
            <Normaltekst>{t('ui:' + buc.status)}</Normaltekst>
          </dd>
          <dt className='odd'>
            <Element>{t('ui:tags')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-tags-id'>
            <EtikettLiten>{bucInfo && bucInfo.tags ? bucInfo.tags.join(', ') : ''}</EtikettLiten>
          </dd>
          <dt>
            <Element>{t('ui:comment')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-comment-id'>
            <Normaltekst>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</Normaltekst>
          </dd>
        </dl>
        <Undertittel
          id='a-buc-c-bucdetail__institutions-id'
          className='a-buc-c-bucdetail__institutions mb-2'
        >
          {t('buc:form-involvedInstitutions')}:
        </Undertittel>
        <InstitutionList
          t={t}
          institutions={buc.institusjon}
          institutionNames={institutionNames}
          locale={locale}
          type='joined'
        />
      </div>
    </EkspanderbartpanelBase>
  )
}

BUCDetail.propTypes = {
  buc: PT.object.isRequired,
  bucInfo: PT.object.isRequired,
  className: PT.string,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  rinaUrl: PT.string.isRequired,
  t: PT.func.isRequired
}

export default BUCDetail
