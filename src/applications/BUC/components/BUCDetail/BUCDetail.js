import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import { Nav } from 'eessi-pensjon-ui'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import './BUCDetail.css'

const BUCDetail = ({ buc, bucInfo, className, institutionNames, locale, rinaUrl, t }) => {
  return (
    <Nav.EkspanderbartpanelBase
      id='a-buc-c-bucdetail__panel-id'
      className={classNames('a-buc-c-bucdetail', 's-border', className)}
      apen
      heading={
        <Nav.Systemtittel
          id='a-buc-c-bucdetail__header-id'
          className='a-buc-c-bucdetail__header'
        >
          {buc.type + ' - ' + t('buc:buc-' + buc.type)}
        </Nav.Systemtittel>
      }
    >
      <div className='a-buc-c-bucdetail__body'>
        <dl className='a-buc-c-bucdetail__props'>
          <dt className='odd'>
            <Nav.Element>{t('ui:status')}:</Nav.Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-status-id'>
            <Nav.Normaltekst>{t('ui:' + buc.status)}</Nav.Normaltekst>
          </dd>
          <dt>
            <Nav.Element>{t('buc:form-caseOwner')}:</Nav.Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-creator-id'>
            <InstitutionList
              t={t}
              institutions={[buc.creator]}
              institutionNames={institutionNames}
              locale={locale}
              type='joined'
            />
          </dd>
          <dt className='odd'>
            <Nav.Element>{t('ui:created')}:</Nav.Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-startDate-id'>
            <Nav.Normaltekst>{moment(buc.startDate).format('DD.MM.YYYY')}</Nav.Normaltekst>
          </dd>
          <dt>
            <Nav.Element>{t('buc:form-rinaCaseNumber')}:</Nav.Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-caseId-id'>
            <Nav.Lenke
              id='a-buc-c-bucdetail__gotorina-link-id'
              className='a-buc-c-bucdetail__gotorina-link'
              href={rinaUrl + buc.caseId}
              target='rinaWindow'
            >
              {buc.caseId}
            </Nav.Lenke>
          </dd>
          <dt className='odd'>
            <Nav.Element>{t('ui:tags')}:</Nav.Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-tags-id'>
            <Nav.EtikettLiten>{bucInfo && bucInfo.tags ? bucInfo.tags.map(tag => t('buc:' + tag)).join(', ') : ''}</Nav.EtikettLiten>
          </dd>
          <dt>
            <Nav.Element>{t('ui:comment')}:</Nav.Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-comment-id'>
            <Nav.Normaltekst>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</Nav.Normaltekst>
          </dd>
        </dl>
        <Nav.Undertittel
          id='a-buc-c-bucdetail__institutions-title-id'
          className='a-buc-c-bucdetail__institutions-title mb-2'
        >
          {t('buc:form-involvedInstitutions')}:
        </Nav.Undertittel>
        <div className='a-buc-c-bucdetail__institutions'>
          <InstitutionList
            t={t}
            institutions={buc.institusjon}
            institutionNames={institutionNames}
            locale={locale}
            type='joined'
          />
        </div>
      </div>
    </Nav.EkspanderbartpanelBase>
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
