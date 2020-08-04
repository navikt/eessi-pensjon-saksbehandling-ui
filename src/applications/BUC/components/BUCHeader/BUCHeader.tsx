import { getBucTypeLabel, sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import ProblemCircleIcon from 'assets/icons/report-problem-circle'
import classNames from 'classnames'
import { Column, HorizontalSeparatorDiv, Row } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Buc, BucInfo, Institution, InstitutionListMap, InstitutionNames } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, RinaUrl } from 'declarations/types'
import { FlagItems, FlagList } from 'flagg-ikoner'
import _ from 'lodash'
import { buttonLogger, linkLogger } from 'metrics/loggers'
import moment from 'moment'
import Lenke from 'nav-frontend-lenker'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Tooltip from 'rc-tooltip'
import ReactResizeDetector from 'react-resize-detector'
import styled, { ThemeProvider } from 'styled-components'

export const BUCHeaderDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0rem;
  width: 100%;
  &.new .ekspanderbartPanel__hode {
    background: ${({theme}) => theme.type === 'themeHighContrast' ? '' : 'lightgoldenrodyellow'};
  }
`
const UnderTitle = styled(Undertittel)`
  padding-bottom: 0.25rem;
  width: 100%;
`
const FlexRow = styled(Row)`
  width: 100%;
  @media (min-width: 768px) {
   align-items: center;
  }
  align-items: flex-start;
  justify-content: space-between;
`
const LabelsDiv = styled(Column)`
  flex: 1;
`
const IconsDiv = styled(Column)`
  margin: 0px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: ${(props: any) => props['data-v2enabled'] === true ? '2' : '1'};
`
const ActionsDiv = styled(Column)`
  display: flex;
  justify-content:flex-end;
  align-self: baseline;
  padding: 0px;
  flex: 1;
`
const OwnerDiv = styled.div`
  display: flex;
  align-items: center;
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
const RinaLink = styled(Lenke)`
  padding: 0.25rem 0.5rem 0.25rem 0.5rem !important;
  margin-bottom: 0px !important;
  color: ${({ theme }): any => theme[themeKeys.MAIN_INTERACTIVE_COLOR]} !important;
`
const BucEditLink = styled(Lenke)`
  text-decoration: none;
`
const FullWidthRow = styled(Row)`
  width: 100%;
`
export interface BUCHeaderProps {
  buc: Buc
  bucInfo?: BucInfo
  newBuc: boolean
  onBUCEdit: Function
}

export interface BUCHeaderSelector {
  featureToggles: FeatureToggles
  highContrast: boolean
  institutionNames: InstitutionNames
  locale: AllowedLocaleString
  rinaUrl: RinaUrl | undefined
  gettingBucDeltakere: boolean
}

const mapState = /* istanbul ignore next */ (state: State): BUCHeaderSelector => ({
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  institutionNames: state.buc.institutionNames,
  locale: state.ui.locale,
  rinaUrl: state.buc.rinaUrl,
  gettingBucDeltakere: state.loading.gettingBucDeltakere
})

const BUCHeader: React.FC<BUCHeaderProps> = ({
  buc, bucInfo, newBuc, onBUCEdit
}: BUCHeaderProps): JSX.Element => {
  const numberOfSeds: string | undefined = buc.seds ? '' + buc.seds.filter(sedFilter).length : undefined
  const { featureToggles, highContrast, institutionNames, locale, rinaUrl }: BUCHeaderSelector =
    useSelector<State, BUCHeaderSelector>(mapState)
  const { t } = useTranslation()
  const [flagSize, setFlagSize] = useState<string>('XL')
  const onBucEditClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    buttonLogger(e)
    e.preventDefault()
    e.stopPropagation()
    onBUCEdit(buc)
  }, [buc, onBUCEdit])

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

  const onRinaLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    linkLogger(e)
    e.stopPropagation()
    if (rinaUrl && buc.caseId) {
      window.open(rinaUrl + buc.caseId, 'rinaWindow')
    }
  }

  const onResize = (width: number) => {
    if (width > 768) {
      if (flagSize !== 'XL') {
        setFlagSize('XL')
      }
    } else {
      if (flagSize === 'XL') {
        setFlagSize('M')
      }
    }
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <ReactResizeDetector
        handleWidth
        onResize={onResize}
      />
      <BUCHeaderDiv
        data-testid={'a-buc-c-bucheader__' + buc.type + '-' + buc.caseId}
        className={classNames({ new: newBuc })}
      >
        <FullWidthRow>
          <Column>
            <UnderTitle
              data-testid='a-buc-c-header__title'
              className='lenkepanel__heading'
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
            data-testid='a-buc-c-header__labels'
          >
            <Normaltekst>
              {t('ui:created')}: {moment(buc.startDate!).format('DD.MM.YYYY')}
            </Normaltekst>
            <OwnerDiv
              data-testid='a-buc-c-header__owner'
            >
              <RowText>
                {t('buc:form-caseOwner') + ': '}
              </RowText>
              <InstitutionList
                data-testid='a-buc-c-bucheader__owner-institutions'
                flagType='circle'
                locale={locale}
                type='separated'
                institutions={[buc.creator!]}
              />
            </OwnerDiv>
            {buc.caseId && (
              <div
                data-testid='a-buc-c-bucheader__case'
              >
                {rinaUrl ? (
                  <RowText>
                    {t('buc:form-caseNumberInRina') + ': '}
                    <RinaLink
                      data-amplitude='buc.list.buc.rinaUrl'
                      data-testid='a-buc-c-bucheader__gotorina-link'
                      href={rinaUrl + buc.caseId}
                      target='rinaWindow'
                      onClick={onRinaLinkClick}
                    >
                      {buc.caseId}
                    </RinaLink>
                  </RowText>
                ) : <WaitingPanel size='S' />}
              </div>
            )}
          </LabelsDiv>
          <IconsDiv
            data-testid='a-buc-c-bucheader__icons'
            data-v2enabled={featureToggles.v2_ENABLED}
          >
            {!_.isEmpty(flagItems) && (
              <FlagList
                animate
                locale={locale}
                type='circle'
                size={flagSize}
                items={flagItems}
                overflowLimit={8}
                wrapper={false}
              />
            )}
            {numberOfSeds && (
              <Tooltip
                placement='top' trigger={['hover']} overlay={(
                  <span>{t('buc:form-youhaveXseds', { seds: numberOfSeds })}</span>
                )}
              >
                <NumberOfSedsDiv
                  data-testid='a-buc-c-bucheader__icon-numberofseds'
                  data-icon-size={flagSize}
                >
                  {numberOfSeds}
                </NumberOfSedsDiv>
              </Tooltip>
            )}
            {bucInfo && bucInfo.tags && bucInfo.tags.length > 0 && (
              <Tooltip
                placement='top' trigger={['hover']} overlay={(
                  <span>{bucInfo.tags.map((tag: string) => t('buc:' + tag)).join(', ')}</span>
                )}
              >
                <TagsDiv data-testid='a-buc-c-bucheader__icon-tags'>
                  <ProblemCircleIcon width={flagSize === 'XL' ? 50 : 32} height={flagSize === 'XL' ? 50 : 32} />
                </TagsDiv>
              </Tooltip>
            )}
          </IconsDiv>
          {featureToggles.v2_ENABLED !== true && (
            <ActionsDiv test-id='a-buc-c-bucheader__actions'>
              <BucEditLink
                data-amplitude='buc.list.editbuc'
                data-testid='a-buc-c-bucheader__bucedit-link-id'
                className='knapp knapp--kompakt'
                onClick={onBucEditClick}
                href={'#' + buc.type}
              >
                {t('ui:processing')}
              </BucEditLink>
              <HorizontalSeparatorDiv />
            </ActionsDiv>
          )}
        </FlexRow>
      </BUCHeaderDiv>
    </ThemeProvider>
  )
}

BUCHeader.propTypes = {
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType,
  onBUCEdit: PT.func.isRequired
}

export default BUCHeader
