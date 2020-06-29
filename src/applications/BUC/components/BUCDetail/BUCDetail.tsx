import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import classNames from 'classnames'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Buc, BucInfo, Institutions } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, RinaUrl } from 'declarations/types'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import Lenke from 'nav-frontend-lenker'
import './BUCDetail.css'

export interface BUCDetailProps {
  buc: Buc;
  bucInfo?: BucInfo;
  className ?: string;
}

export interface BUCDetailSelector {
  locale: AllowedLocaleString;
  rinaUrl: RinaUrl | undefined;
}

const mapState = (state: State): BUCDetailSelector => ({
  locale: state.ui.locale,
  rinaUrl: state.buc.rinaUrl
})

const BUCDetail: React.FC<BUCDetailProps> = ({
  buc, bucInfo, className
}: BUCDetailProps): JSX.Element => {
  const { locale, rinaUrl }: BUCDetailSelector = useSelector<State, BUCDetailSelector>(mapState)
  const { t } = useTranslation()

  return (
    <ExpandingPanel
      id='a-buc-c-bucdetail__panel-id'
      className={classNames('a-buc-c-bucdetail', 's-border', className)}
      open
      heading={
        <Systemtittel
          id='a-buc-c-bucdetail__header-id'
          className='a-buc-c-bucdetail__header'
        >
          {buc.type + ' - ' + getBucTypeLabel({
            type: buc.type!,
            locale: locale,
            t: t
          })}
        </Systemtittel>
      }
    >
      <div className='a-buc-c-bucdetail__body'>
        <dl className='a-buc-c-bucdetail__props'>
          <dt className='odd'>
            <Element>{t('ui:status')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-status-id'>
            <Normaltekst>{t('ui:' + buc.status)}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('buc:form-caseOwner')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-creator-id'>
            <InstitutionList
              institutions={[buc.creator!]}
              locale={locale}
              type='joined'
            />
          </dd>
          <dt className='odd'>
            <Element>{t('ui:created')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-startDate-id'>
            <Normaltekst>{moment(buc.startDate!).format('DD.MM.YYYY')}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('buc:form-rinaCaseNumber')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-caseId-id'>
            {rinaUrl ? (
              <Lenke
                data-amplitude='buc.edit.detail.rinaurl'
                id='a-buc-c-bucdetail__gotorina-link-id'
                className='a-buc-c-bucdetail__gotorina-link'
                href={rinaUrl + buc.caseId}
                target='rinaWindow'
                onClick={linkLogger}
              >
                {buc.caseId}
              </Lenke>
            ) : <WaitingPanel size='S' />}
          </dd>
          <dt className='odd'>
            <Element>{t('ui:tags')}:</Element>
          </dt>
          <dd className='odd' id='a-buc-c-bucdetail__props-tags-id'>
            <Normaltekst>{bucInfo && bucInfo.tags ? bucInfo.tags.map((tag: string) => t('buc:' + tag)).join(', ') : ''}</Normaltekst>
          </dd>
          <dt>
            <Element>{t('ui:comment')}:</Element>
          </dt>
          <dd id='a-buc-c-bucdetail__props-comment-id'>
            <Normaltekst>{bucInfo && bucInfo.comment ? bucInfo.comment : ''}</Normaltekst>
          </dd>
        </dl>
        <Undertittel
          id='a-buc-c-bucdetail__institutions-title-id'
          className='a-buc-c-bucdetail__institutions-title mb-2'
        >
          {t('buc:form-involvedInstitutions')}:
        </Undertittel>
        <div className='a-buc-c-bucdetail__institutions'>
          <InstitutionList
            institutions={(buc.institusjon as Institutions)}
            locale={locale}
            type='joined'
          />
        </div>
      </div>
    </ExpandingPanel>
  )
}

BUCDetail.propTypes = {
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType,
  className: PT.string
}

export default BUCDetail
