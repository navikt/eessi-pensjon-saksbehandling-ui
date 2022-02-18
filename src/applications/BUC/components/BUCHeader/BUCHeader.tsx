import {
  countrySorter,
  getBucTypeLabel,
  sedFilter
} from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { Warning } from '@navikt/ds-icons'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { WidthSize } from 'declarations/app'
import { AllowedLocaleString, RinaUrl } from 'declarations/app.d'
import { Buc, BucInfo, Institution, InstitutionListMap, InstitutionNames } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { FlagItems, FlagList } from '@navikt/flagg-ikoner'
import _ from 'lodash'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import { LinkPanel, BodyLong, Link, Heading } from '@navikt/ds-react'
import { Column, Row } from '@navikt/hoykontrast'
import Tooltip from '@navikt/tooltip'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const FlexRow = styled(Row)`
  width: 100%;
  @media (min-width: 768px) {
   align-items: center;
  }
  align-items: flex-start;
  justify-content: space-between;
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
  border-color: var(--navds-color-text-primary);
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
const RinaLink = styled(Link)`
  padding: 0.25rem 0.5rem 0.25rem 0.5rem !important;
  margin-bottom: 0px !important;
  color: var(--navds-semantic-color-interaction-primary) !important;
`
const RowText = styled(BodyLong)`
  white-space: nowrap !important;
  padding-right: 0.5rem;
`
const TagsDiv = styled.div`
  display: flex;
  justify-content:flex-start;
  align-items: center;
`

export interface BUCHeaderProps {
  buc: Buc
  bucInfo?: BucInfo
}

export interface BUCHeaderSelector {
  gettingBucDeltakere: boolean
  institutionNames: InstitutionNames
  locale: AllowedLocaleString
  rinaUrl: RinaUrl | undefined
  size: WidthSize | undefined
}

const mapState = /* istanbul ignore next */ (state: State): BUCHeaderSelector => ({
  gettingBucDeltakere: state.loading.gettingBucDeltakere,
  institutionNames: state.buc.institutionNames,
  locale: state.ui.locale,
  rinaUrl: state.buc.rinaUrl,
  size: state.ui.size
})

const BUCHeader: React.FC<BUCHeaderProps> = ({
  buc, bucInfo
}: BUCHeaderProps): JSX.Element => {
  const { institutionNames, locale, rinaUrl, size }: BUCHeaderSelector =
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
    <>
      <LinkPanel.Title>
        <Heading
          size='small'
          className='lenkepanel__heading'
          data-test-id='a-buc-c-bucheader__title-id'
        >
          {buc.type + ' - ' + getBucTypeLabel({
            t,
            locale,
            type: buc.type!
          })}
        </Heading>
      </LinkPanel.Title>
      <LinkPanel.Description>
        <FlexRow>
          <LabelsDiv
            data-test-id='a-buc-c-bucheader__label-id'
          >
            <PropertyDiv
              data-test-id='a-buc-c-bucheader__label-date-id'
            >
              <BodyLong>
                {t('ui:created')}: {moment(buc.startDate!).format('DD.MM.YYYY')}
              </BodyLong>
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
                oneLine
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
                    <WaitingPanel size='xsmall' oneLine />
                    )}
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
                wave={false}
                wrapper={false}
              />
            )}
            {numberOfSeds && (
              <Tooltip
                label={(
                  <span>{t('buc:form-youhaveXseds', { seds: numberOfSeds })}</span>
                )}
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
                label={(
                  <span>{bucInfo.tags.map((tag: string) => t('buc:' + tag)).join(', ')}</span>
                )}
              >
                <TagsDiv data-test-id='a-buc-c-bucheader__icon-tags-id'>
                  <Warning
                    width={_flagSize === 'XL' ? 50 : 32}
                    height={_flagSize === 'XL' ? 50 : 32}
                  />
                </TagsDiv>
              </Tooltip>
            )}
          </IconsDiv>
        </FlexRow>
      </LinkPanel.Description>
    </>
  )
}

BUCHeader.propTypes = {
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType
}

export default BUCHeader
