import {
  bucsThatSupportAvdod,
  countrySorter,
  getBucTypeLabel,
  renderAvdodName,
  sedFilter
} from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import ProblemCircleIcon from 'assets/icons/report-problem-circle'
import classNames from 'classnames'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { WidthSize } from 'declarations/app'
import { AllowedLocaleString, RinaUrl } from 'declarations/app.d'
import { Buc, BucInfo, Institution, InstitutionListMap, InstitutionNames, ValidBuc } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { PersonAvdod, PersonAvdods } from 'declarations/person'
import { State } from 'declarations/reducers'
import { FlagItems, FlagList } from 'flagg-ikoner'
import _ from 'lodash'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import Lenke from 'nav-frontend-lenker'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import NavHighContrast, { Column, Row } from 'nav-hoykontrast'
import { themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import Tooltip from 'rc-tooltip'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export const BUCHeaderDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0rem;
  width: 100%;
  &.new .ekspanderbartPanel__hode {
    background: ${({ theme }) => theme.type === 'themeHighContrast'
    ? theme[themeKeys.NAVLIMEGRONNDARKEN80]
    : theme[themeKeys.NAVLIMEGRONNLIGHTEN80]};
  }
`
const FlexRow = styled(Row)`
  width: 100%;
  @media (min-width: 768px) {
   align-items: center;
  }
  align-items: flex-start;
  justify-content: space-between;
`
const FullWidthRow = styled(Row)`
  width: 100%;
`
export const IconsDiv = styled(Column)`
  margin: 0px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 2;
`
const LabelsDiv = styled(Column)`
  flex: 1;
`
const NumberOfSedsDiv = styled.div`
  border-width: ${(props: any) => props['data-icon-size'] === 'XL' ? '3' : '2'}px};
  border-style: solid;
  border-color: ${({ theme }) => theme[themeKeys.MAIN_FONT_COLOR]};
  border-radius: 50px;
  min-width: ${(props: any) => (props['data-icon-size'] === 'XL' ? 50 : 32) + 'px'};
  min-height: ${(props: any) => (props['data-icon-size'] === 'XL' ? 50 : 32) + 'px'};
  height: ${(props: any) => (props['data-icon-size'] === 'XL' ? 50 : 32) + 'px'};
  margin: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: ${(props: any) => props['data-icon-size'] === 'XL' ? 'bold' : 'normal'};
  font-size: 1.5rem;
`
const PropertyDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 0.2rem 0rem;
`
const RinaLink = styled(Lenke)`
  padding: 0.25rem 0.5rem 0.25rem 0.5rem !important;
  margin-bottom: 0px !important;
  color: ${({ theme }): any => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
`
const RowText = styled(Normaltekst)`
  white-space: nowrap !important;
  padding-right: 0.5rem;
`
const TagsDiv = styled.div`
  display: flex;
  justify-content:flex-start;
  align-items: center;
`
const UnderTitle = styled(Undertittel)`
  padding-bottom: 0.25rem;
  width: 100%;
`
export interface BUCHeaderProps {
  buc: Buc
  bucInfo?: BucInfo
  newBuc: boolean
}

export interface BUCHeaderSelector {
  gettingBucDeltakere: boolean
  highContrast: boolean
  institutionNames: InstitutionNames
  locale: AllowedLocaleString
  personAvdods: PersonAvdods | undefined
  rinaUrl: RinaUrl | undefined
  size: WidthSize | undefined
}

const mapState = /* istanbul ignore next */ (state: State): BUCHeaderSelector => ({
  gettingBucDeltakere: state.loading.gettingBucDeltakere,
  highContrast: state.ui.highContrast,
  institutionNames: state.buc.institutionNames,
  locale: state.ui.locale,
  personAvdods: state.app.personAvdods,
  rinaUrl: state.buc.rinaUrl,
  size: state.ui.size
})

const BUCHeader: React.FC<BUCHeaderProps> = ({
  buc, bucInfo, newBuc
}: BUCHeaderProps): JSX.Element => {
  const { highContrast, institutionNames, locale, personAvdods, rinaUrl, size }: BUCHeaderSelector =
    useSelector<State, BUCHeaderSelector>(mapState)
  const { t } = useTranslation()
  const [_flagSize, setFlagSize] = useState<string>('XL')
  const numberOfSeds: string | undefined = buc.seds ? '' + buc.seds.filter(sedFilter).length : undefined

  const generateFlagItems = (): FlagItems => {
    const institutionList: InstitutionListMap<string> = {}
    buc.deltakere!.forEach((institution: Institution) => {
      if (institution.country === 'NO' && institution.institution === 'NO:NAVAT06') {
        institution.country = 'DK'
      }
      if (institution.country === 'NO' && institution.institution === 'NO:NAVAT08') {
        institution.country = 'FI'
      }
      if (Object.prototype.hasOwnProperty.call(institutionList, institution.country)) {
        institutionList[institution.country].push(institution.institution)
      } else {
        institutionList[institution.country] = [institution.institution]
      }
    })

    return Object.keys(institutionList)
      .sort(countrySorter(locale) as (a: string, b: string) => number)
      .map((landkode: string) => ({
        country: landkode,
        label: institutionList[landkode].map((institutionId: string) => {
          return institutionNames &&
        Object.prototype.hasOwnProperty.call(institutionNames, institutionId)
            ? institutionNames[institutionId].name
            : institutionId
        }).join(', ')
      }))
  }

  const flagItems: FlagItems = _.isArray(buc.deltakere) ? generateFlagItems() : []

  const avdod: PersonAvdod | undefined = _.find(personAvdods, p => {
    const avdodFnr = p.fnr
    const needleFnr = (buc as ValidBuc)?.addedParams?.subject?.avdod?.fnr
    return avdodFnr === needleFnr
  })

  const onRinaLinkClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    linkLogger(e)
    e.stopPropagation()
    if (rinaUrl && buc.caseId) {
      window.open(rinaUrl + buc.caseId, 'rinaWindow')
    }
  }

  useEffect(() => {
    if (size !== 'sm') {
      setFlagSize('XL')
    } else {
      setFlagSize('M')
    }
  }, [size])

  return (
    <NavHighContrast highContrast={highContrast}>
      <BUCHeaderDiv
        className={classNames({ new: newBuc })}
        data-test-id={'a-buc-c-bucheader__' + buc.type + '-' + buc.caseId}
      >
        <FullWidthRow>
          <Column>
            <UnderTitle
              className='lenkepanel__heading'
              data-test-id='a-buc-c-bucheader__title-id'
            >
              {buc.type + ' - ' + getBucTypeLabel({
                t: t,
                locale: locale,
                type: buc.type!
              })}
            </UnderTitle>
          </Column>
        </FullWidthRow>
        <FlexRow>
          <LabelsDiv
            data-test-id='a-buc-c-bucheader__label-id'
          >
            <PropertyDiv
              data-test-id='a-buc-c-bucheader__label-date-id'
            >
              <Normaltekst>
                {t('ui:created')}: {moment(buc.startDate!).format('DD.MM.YYYY')}
              </Normaltekst>
            </PropertyDiv>
            <PropertyDiv
              data-test-id='a-buc-c-bucheader__label-owner-id'
            >
              <RowText>
                {t('buc:form-caseOwner') + ': '}
              </RowText>
              <InstitutionList
                className='noMargin'
                data-test-id='a-buc-c-bucheader__label-owner-institution-id'
                flagType='circle'
                institutions={[buc.creator!]}
                locale={locale}
                type='separated'
              />
            </PropertyDiv>
            {buc.caseId && (
              <PropertyDiv
                data-test-id='a-buc-c-bucheader__label-case-id'
              >
                {rinaUrl
                  ? (
                    <RowText>
                      {t('buc:form-caseNumberInRina') + ': '}
                      <RinaLink
                        data-amplitude='buc.list.buc.rinaUrl'
                        data-test-id='a-buc-c-bucheader__label-case-gotorina-link-id'
                        href={rinaUrl + buc.caseId}
                        onClick={onRinaLinkClick}
                        target='rinaWindow'
                      >
                        {buc.caseId}
                      </RinaLink>
                    </RowText>
                    )
                  : (
                    <WaitingPanel size='S' />
                    )}
              </PropertyDiv>
            )}
            {bucsThatSupportAvdod(buc.type) && (buc as ValidBuc)?.addedParams?.subject && (
              <PropertyDiv
                data-test-id='a-buc-c-bucheader__label-avdod-id'
              >
                <RowText>
                  {t('ui:deceased') + ': '}
                </RowText>
                <Normaltekst>
                  {avdod ? renderAvdodName(avdod, t) : (buc as ValidBuc)?.addedParams?.subject?.avdod?.fnr}
                </Normaltekst>
              </PropertyDiv>
            )}
          </LabelsDiv>
          <IconsDiv
            data-test-id='a-buc-c-bucheader__icon-id'
          >
            {!_.isEmpty(flagItems) && (
              <FlagList
                animate
                items={flagItems}
                locale={locale}
                type='circle'
                overflowLimit={8}
                size={_flagSize}
                wrapper={false}
              />
            )}
            {numberOfSeds && (
              <Tooltip
                overlay={(
                  <span>{t('buc:form-youhaveXseds', { seds: numberOfSeds })}</span>
                )}
                placement='top'
                trigger={['hover']}
              >
                <NumberOfSedsDiv
                  data-test-id='a-buc-c-bucheader__icon-numberofseds-id'
                  data-icon-size={_flagSize}
                >
                  {numberOfSeds}
                </NumberOfSedsDiv>
              </Tooltip>
            )}
            {bucInfo && bucInfo.tags && bucInfo.tags.length > 0 && (
              <Tooltip
                overlay={(
                  <span>{bucInfo.tags.map((tag: string) => t('buc:' + tag)).join(', ')}</span>
                )}
                placement='top'
                trigger={['hover']}
              >
                <TagsDiv data-test-id='a-buc-c-bucheader__icon-tags-id'>
                  <ProblemCircleIcon
                    width={_flagSize === 'XL' ? 50 : 32}
                    height={_flagSize === 'XL' ? 50 : 32}
                  />
                </TagsDiv>
              </Tooltip>
            )}
          </IconsDiv>
        </FlexRow>
      </BUCHeaderDiv>
    </NavHighContrast>
  )
}

BUCHeader.propTypes = {
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType,
  newBuc: PT.bool.isRequired
}

export default BUCHeader
