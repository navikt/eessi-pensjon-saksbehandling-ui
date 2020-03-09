import { setCurrentSed } from 'actions/buc'
import BUCDetail from 'applications/BUC/components/BUCDetail/BUCDetail'
import BUCTools from 'applications/BUC/components/BUCTools/BUCTools'
import { getBucTypeLabel, sedFilter, sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDPanel from 'applications/BUC/components/SEDPanel/SEDPanel'
import SEDPanelHeader from 'applications/BUC/components/SEDPanelHeader/SEDPanelHeader'
import SEDSearch from 'applications/BUC/components/SEDSearch/SEDSearch'
import { Buc, BucInfo, Bucs, BucsInfo, Sed, Tags } from 'declarations/buc'
import { BucsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './BUCEdit.css'

export interface BUCEditProps {
  aktoerId: string;
  bucs: Bucs;
  currentBuc?: string | undefined;
  initialSearch ?: string;
  initialStatusSearch ?: Tags;
  setMode: (s: string) => void;
}

export interface BUCEditSelector {
  bucsInfo?: BucsInfo;
  locale: AllowedLocaleString
}

const mapState = (state: State): BUCEditSelector => ({
  bucsInfo: state.buc.bucsInfo,
  locale: state.ui.locale
})

const BUCEdit: React.FC<BUCEditProps> = ({
  aktoerId, bucs, currentBuc, initialSearch, initialStatusSearch, setMode
}: BUCEditProps): JSX.Element | null => {
  const [search, setSearch] = useState<string | undefined>(initialSearch)
  const [statusSearch, setStatusSearch] = useState<Tags | undefined>(initialStatusSearch)
  const { bucsInfo, locale }: BUCEditSelector = useSelector<State, BUCEditSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  const onSEDNew = (sed: Sed | undefined): void => {
    dispatch(setCurrentSed(sed ? sed.id : undefined))
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
            value={search}
            onSearch={onSearch}
            onStatusSearch={onStatusSearch}
          />
          <SEDPanelHeader />
          {buc.seds ? buc.seds
            .filter(sedFilter)
            .filter(sedSearchFilter)
            .sort(sedSorter as (a: Sed, b: Sed) => number)
            .map((sed, index) => {
              return (
                <SEDPanel
                  className='mt-2'
                  aktoerId={aktoerId!}
                  style={{ animationDelay: (0.2 * index) + 's' }}
                  buc={buc}
                  key={index}
                  sed={sed}
                  followUpSeds={buc.seds.filter(_seds => _seds.parentDocumentId === sed.id)}
                  onSEDNew={() => onSEDNew(sed)}
                />
              )
            }) : null}
        </div>
        <div className='col-md-4'>
          <BUCDetail
            className='mb-3'
            buc={buc}
            bucInfo={bucInfo}
          />
          <BUCTools
            className='mb-3'
            aktoerId={aktoerId!}
            buc={buc}
            bucInfo={bucInfo}
          />
        </div>
      </Ui.Nav.Row>
    </div>
  )
}

BUCEdit.propTypes = {
  aktoerId: PT.string.isRequired,
  bucs: BucsPropType.isRequired,
  currentBuc: PT.string,
  initialSearch: PT.string,
  initialStatusSearch: PT.array
}

export default BUCEdit
