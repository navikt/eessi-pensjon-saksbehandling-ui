import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { Buc, BucInfo, Institution, InstitutionNames } from 'applications/BUC/declarations/buc'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'
import { AllowedLocaleString, RinaUrl, T } from 'types'
import './BUCDetail.css'

export interface BUCDetailProps {
  buc: Buc;
  bucInfo: BucInfo;
  className ?: string;
  institutionNames: InstitutionNames;
  locale: AllowedLocaleString;
  rinaUrl: RinaUrl;
  t: T;
}

const BUCDetail = ({
  buc, bucInfo, className, institutionNames, locale, rinaUrl, t
}: BUCDetailProps) => (
  <Ui.Nav.EkspanderbartpanelBase
    id='a-buc-c-bucdetail__panel-id'
    className={classNames('a-buc-c-bucdetail', 's-border', className)}
    apen
    heading={
      <Ui.Nav.Systemtittel
        id='a-buc-c-bucdetail__header-id'
        className='a-buc-c-bucdetail__header'
      >
        {buc.type + ' - ' + getBucTypeLabel({
          type: buc.type,
          locale: locale,
          t: t
        })}
      </Ui.Nav.Systemtittel>
    }
  >
    <div className='a-buc-c-bucdetail__body'>
      <dl className='a-buc-c-bucdetail__props'>
        <dt className='odd'>
          <Ui.Nav.Element>{t('ui:status')}:</Ui.Nav.Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-status-id'>
          <Ui.Nav.Normaltekst>{t('ui:' + buc.status)}</Ui.Nav.Normaltekst>
        </dd>
        <dt>
          <Ui.Nav.Element>{t('buc:form-caseOwner')}:</Ui.Nav.Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-creator-id'>
          <InstitutionList
            institutions={[buc.creator!]}
            institutionNames={institutionNames}
            locale={locale}
            type='joined'
            t={t}
          />
        </dd>
        <dt className='odd'>
          <Ui.Nav.Element>{t('ui:created')}:</Ui.Nav.Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-startDate-id'>
          <Ui.Nav.Normaltekst>{moment(buc.startDate!).format('DD.MM.YYYY')}</Ui.Nav.Normaltekst>
        </dd>
        <dt>
          <Ui.Nav.Element>{t('buc:form-rinaCaseNumber')}:</Ui.Nav.Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-caseId-id'>
          <Ui.Nav.Lenke
            id='a-buc-c-bucdetail__gotorina-link-id'
            className='a-buc-c-bucdetail__gotorina-link'
            href={rinaUrl + buc.caseId}
            target='rinaWindow'
          >
            {buc.caseId}
          </Ui.Nav.Lenke>
        </dd>
        <dt className='odd'>
          <Ui.Nav.Element>{t('ui:tags')}:</Ui.Nav.Element>
        </dt>
        <dd className='odd' id='a-buc-c-bucdetail__props-tags-id'>
          <Ui.Nav.Normaltekst>{bucInfo && bucInfo.tags ? bucInfo.tags.map((tag: string) => t('buc:' + tag)).join(', ') : ''}</Ui.Nav.Normaltekst>
        </dd>
        <dt>
          <Ui.Nav.Element>{t('ui:comment')}:</Ui.Nav.Element>
        </dt>
        <dd id='a-buc-c-bucdetail__props-comment-id'>
          <Ui.Nav.Normaltekst>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</Ui.Nav.Normaltekst>
        </dd>
      </dl>
      <Ui.Nav.Undertittel
        id='a-buc-c-bucdetail__institutions-title-id'
        className='a-buc-c-bucdetail__institutions-title mb-2'
      >
        {t('buc:form-involvedInstitutions')}:
      </Ui.Nav.Undertittel>
      <div className='a-buc-c-bucdetail__institutions'>
        <InstitutionList
          t={t}
          institutions={(buc.institusjon as Array<Institution>)}
          institutionNames={institutionNames}
          locale={locale}
          type='joined'
        />
      </div>
    </div>
  </Ui.Nav.EkspanderbartpanelBase>
)

BUCDetail.propTypes = {
  buc: PT.object.isRequired,
  bucInfo: PT.object,
  className: PT.string,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  rinaUrl: PT.string.isRequired,
  t: PT.func.isRequired
}

export default BUCDetail
