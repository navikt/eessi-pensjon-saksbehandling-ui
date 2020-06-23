import { getBucTypeLabel, sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { Buc, BucInfo, Institution, InstitutionListMap, InstitutionNames } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, RinaUrl } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import { FlagList, FlagItems } from 'flagg-ikoner'
import _ from 'lodash'
import { buttonLogger, linkLogger } from 'metrics/loggers'
import moment from 'moment'
import PT from 'prop-types'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import './BUCHeader.css'

export interface BUCHeaderProps {
  buc: Buc;
  bucInfo?: BucInfo;
  onBUCEdit: Function;
}

export interface BUCHeaderSelector {
  institutionNames: InstitutionNames;
  locale: AllowedLocaleString;
  rinaUrl: RinaUrl | undefined;
  gettingBucDeltakere: boolean;
}

const mapState = /* istanbul ignore next */ (state: State): BUCHeaderSelector => ({
  institutionNames: state.buc.institutionNames,
  locale: state.ui.locale,
  rinaUrl: state.buc.rinaUrl,
  gettingBucDeltakere: state.loading.gettingBucDeltakere
})

const BUCHeader: React.FC<BUCHeaderProps> = ({
  buc, bucInfo, onBUCEdit
}: BUCHeaderProps): JSX.Element => {
  const numberOfSeds: string | undefined = buc.seds ? '' + buc.seds.filter(sedFilter).length : undefined
  const { institutionNames, locale, rinaUrl }: BUCHeaderSelector = useSelector<State, BUCHeaderSelector>(mapState)
  const { t } = useTranslation()
  const onBucHandle: Function = useCallback((buc, e) => {
    e.preventDefault()
    e.stopPropagation()
    onBUCEdit(buc)
  }, [onBUCEdit])

  const generateFlagItems = (): FlagItems => {
    const institutionList: InstitutionListMap<string> = {}
    buc.deltakere!.forEach((institution: Institution) => {
      if (Object.prototype.hasOwnProperty.call(institutionList, institution.country)) {
        institutionList[institution.country].push(institution.institution)
      } else {
        institutionList[institution.country] = [institution.institution]
      }
    })

    return Object.keys(institutionList).map(landkode => ({
      country: landkode,
      label: institutionList[landkode].map((institutionId) => {
        return institutionNames &&
        Object.prototype.hasOwnProperty.call(institutionNames, institutionId)
          ? institutionNames[institutionId]
          : institutionId
      }).join(', ')
    }))
  }

  const flagItems: FlagItems = _.isArray(buc.deltakere) ? generateFlagItems() : []

  return (
    <div
      id={'a-buc-c-bucheader__' + buc.type + '-' + buc.caseId}
      className='a-buc-c-bucheader p-0 w-100'
    >
      <Ui.Nav.Undertittel
        className='a-buc-c-bucheader__title pb-1 w-100'
      >
        {buc.type + ' - ' + getBucTypeLabel({
          t: t,
          locale: locale,
          type: buc.type!
        })}
      </Ui.Nav.Undertittel>
      <Ui.Nav.Row className='a-buc-c-bucheader__row no-gutters w-100'>
        <div className='a-buc-c-bucheader__label col-sm-4'>

          <Ui.Nav.Normaltekst
            id='a-buc-c-bucheader__description-id'
            className='a-buc-c-bucheader__description'
          >
            {t('ui:created')}: {moment(buc.startDate!).format('DD.MM.YYYY')}
          </Ui.Nav.Normaltekst>
          <div
            id='a-buc-c-bucheader__owner-id'
            className='a-buc-c-bucheader__owner'
          >
            <Ui.Nav.Normaltekst className='pr-2 text-nowrap'>
              {t('buc:form-caseOwner') + ': '}
            </Ui.Nav.Normaltekst>
            <InstitutionList
              className='a-buc-c-bucheader__owner-institutions'
              flagType='circle'
              locale={locale}
              type='separated'
              institutions={[buc.creator!]}
            />
          </div>
          {buc.caseId ? (
            <div
              id='a-buc-c-bucheader__case-id'
              className='a-buc-c-bucheader__case'
            >
              {rinaUrl ? (
                <Ui.Nav.Normaltekst className='pr-2 text-nowrap'>
                  {t('buc:form-caseNumberInRina') + ': '}
                  <Ui.Nav.Lenke
                    data-amplitude='buc.list.buc.rinaUrl'
                    className='a-buc-c-bucheader__gotorina-link'
                    href={rinaUrl + buc.caseId}
                    target='rinaWindow'
                    onClick={(e: MouseEvent) => {
                      linkLogger(e)
                      e.stopPropagation()
                      window.open(rinaUrl + buc.caseId, 'rinaWindow')
                    }}
                  >
                    {buc.caseId}
                  </Ui.Nav.Lenke>
                </Ui.Nav.Normaltekst>
              ) : <Ui.WaitingPanel size='S' />}
            </div>
          ) : null}
        </div>
        <div className='a-buc-c-bucheader__icons col-sm-4'>
          {!_.isEmpty(flagItems) ? (
            <FlagList
              animate
              locale={locale}
              type='circle'
              size='L'
              items={flagItems}
              overflowLimit={5}
              wrapper={false}
            />
          ) : <Ui.WaitingPanel message='' size='M' />}
          {numberOfSeds ? (
            <div
              className='a-buc-c-bucheader__icon-numberofseds'
              data-tip={t('buc:form-youhaveXseds', { seds: numberOfSeds })}
            >
              {numberOfSeds}
            </div>
          ) : null}
          {bucInfo && bucInfo.tags && bucInfo.tags.length > 0
            ? (
              <div
                className='a-buc-c-bucheader__icon-tags'
                data-tip={bucInfo.tags.map((tag: string) => t('buc:' + tag)).join(', ')}
              >
                <Ui.Icons kind='problem' size={32} />
              </div>
            ) : null}
        </div>
        <div className='a-buc-c-bucheader__actions col-sm-4'>
          <Ui.Nav.Lenke
            data-amplitude='buc.list.editbuc'
            id='a-buc-c-bucheader__bucedit-link-id'
            className='a-buc-c-bucheader__bucedit-link knapp text-decoration-none mr-3'
            onClick={(e: MouseEvent) => {
              buttonLogger(e)
              onBucHandle(buc, e)
            }}
            href={'#' + buc.type}
          >
            {t('ui:processing')}
          </Ui.Nav.Lenke>
        </div>
      </Ui.Nav.Row>
    </div>
  )
}

BUCHeader.propTypes = {
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType,
  onBUCEdit: PT.func.isRequired
}

export default BUCHeader
