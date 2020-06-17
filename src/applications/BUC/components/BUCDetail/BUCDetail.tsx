import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import classNames from 'classnames'
import { Buc, BucInfo, Institutions } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, RinaUrl } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
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
    <Ui.ExpandingPanel
      id='a-buc-c-bucdetail__panel-id'
      className={classNames('a-buc-c-bucdetail', 's-border', className)}
      open
      heading={
        <Ui.Nav.Systemtittel
          id='a-buc-c-bucdetail__header-id'
          className='a-buc-c-bucdetail__header'
        >
          {buc.type + ' - ' + getBucTypeLabel({
            type: buc.type!,
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
              locale={locale}
              type='joined'
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
            {rinaUrl ? (
              <Ui.Nav.Lenke
                data-amplitude='buc.edit.detail.rinaurl'
                id='a-buc-c-bucdetail__gotorina-link-id'
                className='a-buc-c-bucdetail__gotorina-link'
                href={rinaUrl + buc.caseId}
                target='rinaWindow'
                onClick={linkLogger}
              >
                {buc.caseId}
              </Ui.Nav.Lenke>
            ) : <Ui.WaitingPanel size='S' />}
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
            institutions={(buc.institusjon as Institutions)}
            locale={locale}
            type='joined'
          />
        </div>
      </div>
    </Ui.ExpandingPanel>
  )
}

BUCDetail.propTypes = {
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType,
  className: PT.string
}

export default BUCDetail
