import BUCDetail from 'applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'applications/BUC/components/BUCTools/BUCTools'
import { getBucTypeLabel, sedFilter, sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDPanel from 'applications/BUC/components/SEDPanel/SEDPanel'
import SEDPanelHeader from 'applications/BUC/components/SEDPanelHeader/SEDPanelHeader'
import SEDSearch from 'applications/BUC/components/SEDSearch/SEDSearch'
import {
  AttachedFiles,
  Buc,
  BucInfo,
  Bucs,
  BucsInfo,
  InstitutionNames,
  Sed,
  Tags
} from 'declarations/buc'
import { AllowedLocaleString, Loading, RinaUrl, T } from 'declarations/types'
import { AllowedLocaleStringPropType, RinaUrlPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { ActionCreators } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useState } from 'react'
import './BUCEdit.css'

export interface BUCEditProps {
  actions: ActionCreators;
  aktoerId?: string;
  attachments: AttachedFiles;
  attachmentsError ?: boolean;
  bucs: Bucs;
  bucsInfo?: BucsInfo;
  currentBuc?: string | undefined;
  initialSearch ?: string;
  initialStatusSearch ?: Tags;
  institutionNames: InstitutionNames;
  loading: Loading;
  locale: AllowedLocaleString;
  rinaUrl?: RinaUrl;
  setMode: (s: string) => void;
  t: T;
  tagList?: Array<string>;
}

const BUCEdit = ({
  actions, aktoerId, attachments, attachmentsError = false, bucs, bucsInfo, currentBuc, initialSearch, initialStatusSearch,
  institutionNames, loading, locale, rinaUrl, setMode, t, tagList
}: BUCEditProps) => {
  const [search, setSearch] = useState<string | undefined>(initialSearch)
  const [statusSearch, setStatusSearch] = useState<Tags | undefined>(initialStatusSearch)

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  const onSEDNew = (sed: Sed | undefined): void => {
    actions.setCurrentSed(sed ? sed.id : undefined)
    setMode('sednew')
  }

  const onStatusSearch = (statusSearch: Tags): void => {
    setStatusSearch(statusSearch)
  }

  const onSearch = (search: string): void => {
    setSearch(search)
  }

  const sedSearchFilter = (sed: Sed): boolean => {
    let match: boolean = true
    if (match && search) {
      const _search: string = search.toLowerCase()
      const bucType: string = getBucTypeLabel({
        t: t,
        locale: locale,
        type: sed.type
      })
      match = !!sed.type.toLowerCase().match(_search) ||
        !!bucType.toLowerCase().match(_search) ||
        _.find(sed.participants, (it) => {
          const organizationId = it.organisation.id.toLowerCase()
          const organizationName = it.organisation.name.toLowerCase()
          const countryCode = it.organisation.countryCode.toLowerCase()
          const countryName = Ui.CountryData.getCountryInstance(locale).findByValue(countryCode.toUpperCase()).label.toLowerCase()
          const creationDate = moment(sed.creationDate).format('DD.MM.YYYY')
          const lastUpdate = moment(sed.lastUpdate).format('DD.MM.YYYY')
          const status = t('ui:' + sed.status).toLowerCase()
          return organizationId.match(_search) || organizationName.match(_search) ||
          countryCode.match(_search) || countryName.match(_search) || creationDate.match(_search) ||
          lastUpdate.match(_search) || status.match(_search)
        }) !== undefined
    }
    if (match && !_.isEmpty(statusSearch)) {
      match = _.find(statusSearch, { value: sed.status }) !== undefined
    }
    return match
  }

  const buc: Buc = bucs[currentBuc]
  const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs ? bucsInfo.bucs[buc.caseId!] : {} as BucInfo

  return (
    <div className='a-buc-p-bucedit'>
      <div className='a-buc-p-bucedit__buttons mb-3'>
        <Ui.Nav.Knapp
          id='a-buc-p-bucedit__new-sed-button-id'
          className='a-buc-p-bucedit__new-sed-button'
          onClick={() => onSEDNew(undefined)}
        >{t('buc:form-orderNewSED')}
        </Ui.Nav.Knapp>
      </div>
      <Ui.Nav.Row>
        <div className='col-md-8'>
          <SEDSearch
            className='mb-2'
            t={t}
            value={search}
            onSearch={onSearch}
            onStatusSearch={onStatusSearch}
          />
          <SEDPanelHeader t={t} />
          {buc.seds ? buc.seds
            .filter(sedFilter)
            .filter(sedSearchFilter)
            .sort(sedSorter as (a: Sed, b: Sed) => number)
            .map((sed, index) => {
              return (
                <SEDPanel
                  className='mt-2'
                  actions={actions}
                  aktoerId={aktoerId!}
                  attachments={attachments}
                  attachmentsError={attachmentsError}
                  style={{ animationDelay: (0.2 * index) + 's' }}
                  buc={buc}
                  locale={locale!}
                  t={t}
                  key={index}
                  sed={sed}
                  followUpSeds={buc.seds.filter(_seds => _seds.parentDocumentId === sed.id)}
                  onSEDNew={() => onSEDNew(sed)}
                  institutionNames={institutionNames}
                />
              )
            }) : null}
        </div>
        <div className='col-md-4'>
          <BUCDetail
            className='mb-3'
            t={t}
            buc={buc}
            bucInfo={bucInfo}
            locale={locale!}
            rinaUrl={rinaUrl!}
            institutionNames={institutionNames}
          />
          <BUCTools
            className='mb-3'
            t={t}
            actions={actions}
            aktoerId={aktoerId!}
            buc={buc}
            bucInfo={bucInfo}
            bucsInfo={bucsInfo}
            loading={loading}
            tagList={tagList}
          />
        </div>
      </Ui.Nav.Row>
    </div>
  )
}

BUCEdit.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  attachments: PT.array,
  attachmentsError: PT.bool,
  bucs: PT.object.isRequired,
  bucsInfo: PT.object,
  currentBuc: PT.string,
  initialSearch: PT.string,
  initialStatusSearch: PT.array,
  institutionNames: PT.object,
  loading: PT.object,
  locale: AllowedLocaleStringPropType.isRequired,
  rinaUrl: RinaUrlPropType,
  t: PT.func.isRequired,
  tagList: PT.array
}

export default BUCEdit
