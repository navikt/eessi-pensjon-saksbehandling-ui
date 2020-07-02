import {
  fetchBucsInfo,
  fetchSingleBuc,
  getInstitutionsListForBucAndCountry,
  setCurrentBuc,
  setCurrentSed
} from 'actions/buc'
import BUCFooter from 'applications/BUC/components/BUCFooter/BUCFooter'
import BUCHeader from 'applications/BUC/components/BUCHeader/BUCHeader'
import { bucFilter, bucSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDList from 'applications/BUC/components/SEDList/SEDList'
import { BUCMode } from 'applications/BUC/index'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { VerticalSeparatorDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as storage from 'constants/storage'
import {
  Buc,
  BucInfo,
  Bucs,
  BucsInfo,
  Institution,
  InstitutionListMap,
  Participant,
  RawInstitution,
  Sed
} from 'declarations/buc'
import { BucsPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, Loading } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger, timeDiffLogger, timeLogger } from 'metrics/loggers'
import Alertstripe from 'nav-frontend-alertstriper'
import Knapp from 'nav-frontend-knapper'
import { Element, Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { keyframes, ThemeProvider } from 'styled-components'

export interface BUCListProps {
  aktoerId: string;
  bucs: Bucs;
  setMode: (mode: BUCMode) => void;
}

export interface BUCListSelector {
  bucsInfo: BucsInfo | undefined
  bucsInfoList: Array<string> | undefined
  highContrast: boolean
  institutionList: InstitutionListMap<RawInstitution> | undefined
  loading: Loading
  locale: AllowedLocaleString
}

const mapState = (state: State): BUCListSelector => ({
  bucsInfo: state.buc.bucsInfo,
  bucsInfoList: state.buc.bucsInfoList,
  highContrast: state.ui.highContrast,
  institutionList: state.buc.institutionList,
  loading: state.loading,
  locale: state.ui.locale
})

type Country = {country: string, buc: string}
type CountryList = Array<Country>

const slideInFromLeft = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-20px);
}
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const BUCListDiv = styled.div``
const BUCListButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const FullWidthDiv = styled.div`
  width: 100%;
  padding: 0rem;
`
const BucExpandingPanel = styled(ExpandingPanel)`
 transform: translateX(-20px);
 opacity: 0;
 animation: ${slideInFromLeft} 0.2s forwards;
 border: 1px solid ${({ theme }: any) => theme.navGra40};
 margin-bottom: 1rem;
`
const Flex4Div = styled.div`
  flex: 4;
`
const Flex3Div = styled.div`
  flex: 3;
`
const Flex2Div = styled.div`
  flex: 2;
`
const SEDHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }: any) => theme.type === 'themeHighContrast' ? theme.white : theme.navGra40};
`

const BUCList: React.FC<BUCListProps> = ({
  aktoerId, bucs, setMode
}: BUCListProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(false)
  const { bucsInfo, bucsInfoList, highContrast, institutionList, loading } = useSelector<State, BUCListSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [loggedTime] = useState<Date>(new Date())
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)
  const [openBucs, setOpenBucs] = useState<{[k: string]: boolean}>({})

  useEffect(() => {
    standardLogger('buc.list.entrance')
    return () => {
      timeLogger('buc.list.view', loggedTime)
      timeDiffLogger('buc.list.mouseover', totalTimeWithMouseOver)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedTime])

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  const onBUCNew = (e: React.MouseEvent): void => {
    buttonLogger(e)
    setMode('bucnew')
  }

  const onSEDNew = (buc: Buc, sed: Sed): void => {
    dispatch(setCurrentBuc(buc ? buc.caseId! : undefined))
    dispatch(setCurrentSed(sed ? sed.id : undefined))
    setMode('sednew')
  }

  const onBUCEdit = (buc: Buc) => {
    getSeds(buc.caseId!)
    dispatch(setCurrentBuc(buc.caseId!))
    setMode('bucedit')
  }

  const onBucOpen = (bucId: string) => {
    getSeds(bucId)
  }

  const getSeds = (bucId: string) => {
    if (_.isNil(bucs[bucId].seds)) {
      dispatch(fetchSingleBuc(bucId))
    }
  }

  const logPanelClick = (bucId: string) => {
    const newOpenBucs = _.cloneDeep(openBucs)
    if (!openBucs[bucId]) {
      standardLogger('buc.list.buc.panel.open')
      newOpenBucs[bucId] = true
    } else {
      standardLogger('buc.list.buc.panel.close')
      newOpenBucs[bucId] = false
    }
    setOpenBucs(newOpenBucs)
  }

  useEffect(() => {
    if (!_.isEmpty(bucsInfoList) && bucsInfo === undefined && !loading.gettingBUCinfo &&
      bucsInfoList!.indexOf(aktoerId + '___' + storage.NAMESPACE_BUC + '___' + storage.FILE_BUCINFO) >= 0) {
      dispatch(fetchBucsInfo(aktoerId, storage.NAMESPACE_BUC, storage.FILE_BUCINFO))
    }
  }, [aktoerId, bucsInfo, bucsInfoList, dispatch, loading])

  useEffect(() => {
    if (!mounted && !_.isEmpty(bucs)) {
      const listOfCountries: CountryList = []
      Object.keys(bucs).forEach(key => {
        const buc: Buc = bucs[key]
        if (_.isArray(buc.institusjon)) {
          buc.institusjon.forEach((it: Institution) => {
            if (!_.find(listOfCountries, { country: it.country })) {
              listOfCountries.push({
                country: it.country,
                buc: buc.type!
              })
            }
          })
        }
        if (_.isArray(buc.seds)) {
          buc.seds.forEach((sed: Sed) => {
            if (_.isArray(sed.participants)) {
              sed.participants.forEach((participant: Participant) => {
                const country = participant.organisation.countryCode
                if (!_.find(listOfCountries, { country: country })) {
                  listOfCountries.push({
                    country: country,
                    buc: buc.type!
                  })
                }
              })
            }
          })
        }
      })

      listOfCountries.forEach((country: Country) => {
        if (institutionList && !_.find(Object.keys(institutionList), country.country)) {
          dispatch(getInstitutionsListForBucAndCountry(country.buc, country.country))
        }
      })

      standardLogger('buc.list.bucs.data', {
        numberOfBucs: Object.keys(bucs).length
      })
      setMounted(true)
    }
  }, [institutionList, bucs, dispatch, mounted])

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCListDiv
        className='a-buc-p-buclist'
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <BUCListButtons>
          <Knapp
            data-amplitude='buc.list.newbuc'
            id='a-buc-p-buclist__newbuc-button-id'
            className='a-buc-p-buclist__newbuc-button'
            onClick={onBUCNew}
          >
            {t('buc:form-createNewCase')}
          </Knapp>
        </BUCListButtons>
        <VerticalSeparatorDiv />
        {loading.gettingBUCs && (
          <>
            <VerticalSeparatorDiv data-size='2' />
            <WaitingPanel size='XL' message={t('buc:loading-bucs')} />
          </>
        )}
        {bucs === null && (
          <>
            <VerticalSeparatorDiv data-size='2' />
            <Normaltekst>
              {t('buc:error-noBucs')}
            </Normaltekst>
          </>
        )}
        {!loading.gettingBUCs && !_.isEmpty(bucs)
          ? Object.keys(bucs).map(key => bucs[key])
            .filter(bucFilter)
            .sort(bucSorter)
            .map((buc: Buc, index: number) => {
              if (buc.error) {
                return (
                  <FullWidthDiv key={index}>
                    <Alertstripe type='advarsel' style={{ width: '100%' }}>
                      {buc.error}
                    </Alertstripe>
                  </FullWidthDiv>
                )
              }
              const bucId: string = buc.caseId!
              const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo
              return (

                <BucExpandingPanel
                  data-testId={'a-buc-p-buclist__buc-' + bucId}
                  key={index}
                  collapseProps={{ id: 'a-buc-p-buclist__buc-' + bucId }}
                  style={{ animationDelay: (0.2 * index) + 's' }}
                  onClick={() => {
                    logPanelClick(bucId)
                    onBucOpen(bucId)
                  }}
                  heading={
                    <BUCHeader
                      buc={buc}
                      bucInfo={bucInfo}
                      onBUCEdit={onBUCEdit}
                    />
                  }
                >
                  <>
                    <SEDHeader data-testId='a-buc-p-buclist__seadheader-div-id'>
                      <Flex4Div>
                        <Element>{t('buc:form-name')}</Element>
                      </Flex4Div>
                      <Flex3Div>
                        <Element>{t('buc:form-status')}</Element>
                      </Flex3Div>
                      <Flex3Div>
                        <Element>{t('buc:form-senderreceiver')}</Element>
                      </Flex3Div>
                      <Flex2Div />
                    </SEDHeader>
                    {!_.isNil(buc.seds) ? (
                      <SEDList
                        seds={buc.seds}
                        buc={buc}
                        onSEDNew={onSEDNew}
                      />
                    ) : <WaitingPanel message={t('buc:loading-gettingSEDs')} size='L' />}
                    <VerticalSeparatorDiv data-size='0.25' />
                  </>
                </BucExpandingPanel>
              )
            }) : null}
        <BUCFooter />
      </BUCListDiv>
    </ThemeProvider>
  )
}

BUCList.propTypes = {
  aktoerId: PT.string.isRequired,
  bucs: BucsPropType.isRequired,
  setMode: PT.func.isRequired
}

export default BUCList
