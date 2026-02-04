import {
  countrySorter,
  getBucTypeLabel,
  sedFilter
} from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'src/applications/BUC/components/InstitutionList/InstitutionList'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString, RinaUrl } from 'src/declarations/app.d'
import { Buc, BucInfo, Institution, InstitutionListMap, InstitutionNames, JoarkBuc } from 'src/declarations/buc'
import { State } from 'src/declarations/reducers'
import { FlagItems, FlagList } from '@navikt/flagg-ikoner'
import _ from 'lodash'
import {LinkPanel, BodyLong, Link, Heading, Tag, Box, HGrid, HStack} from '@navikt/ds-react'
import React, {JSX} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import PopoverCustomized from "src/components/Tooltip/PopoverCustomized";
import styles from './BUCHeader.module.css'
import dayjs from "dayjs";

export interface BUCHeaderProps {
  buc: Buc | JoarkBuc
  bucInfo?: BucInfo
}

export interface BUCHeaderSelector {
  institutionNames: InstitutionNames
  locale: AllowedLocaleString
  rinaUrl: RinaUrl | undefined
}

const mapState = /* istanbul ignore next */ (state: State): BUCHeaderSelector => ({
  institutionNames: state.buc.institutionNames,
  locale: state.ui.locale,
  rinaUrl: state.buc.rinaUrl,
})

const BUCHeader: React.FC<BUCHeaderProps> = ({
  buc, bucInfo
}: BUCHeaderProps): JSX.Element => {
  const { institutionNames, locale, rinaUrl }: BUCHeaderSelector = useSelector<State, BUCHeaderSelector>(mapState)
  const { t } = useTranslation()
  const _flagSize = 'XL'
  const numberOfSeds: string | undefined =  ("seds" in buc) && buc.seds
    ? '' + buc.seds.filter(sedFilter).length :
    ("numberOfSeds" in buc) && buc.numberOfSeds ? '' + buc.numberOfSeds : undefined

  const generateFlagItems = (): FlagItems => {
    const institutionList: InstitutionListMap<string> = {}
    buc.deltakere!.forEach((institution: Institution) => {
      // Used for simulating sending to/from Norway to/from DK/FI (Q2-->Q1/Q1-->Q2)
      /*
      if (institution.country === 'NO' && institution.institution === 'NO:NAVAT06') {
        institution.country = 'DK'
      }
      if (institution.country === 'NO' && institution.institution === 'NO:NAVAT08') {
        institution.country = 'FI'
      }
      */
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
    e.stopPropagation()
    if (rinaUrl && buc.caseId) {
      window.open(rinaUrl + buc.caseId, 'rinaWindow')
    }
  }

  return (
    <>
      <LinkPanel.Title>
        <Heading
          size='small'
          className='lenkepanel--heading'
          data-testid='a_buc_c_BUCHeader--title_id'
        >
          {buc.type + ' - ' + getBucTypeLabel({
            t,
            locale,
            type: buc.type!
          })}
        </Heading>
      </LinkPanel.Title>
      <LinkPanel.Description>
        <HGrid
          columns={{ xs: 1, sm: 1, md: 2, lg: 3 }}
          align="center"
        >
          <div
            data-testid='a_buc_c_BUCHeader--label_id'
          >
            <HStack
              align="center"
              data-testid='a_buc_c_BUCHeader--label_date_id'
            >
              <BodyLong>
                {t('ui:created')}: {dayjs(buc.startDate!).format('DD.MM.YYYY')}
              </BodyLong>
            </HStack>
            <HStack
              align="center"
              data-testid='a_buc_c_BUCHeader--label_owner_id'
            >
              <BodyLong className={styles.rowText}>
                {t('buc:form-caseOwner') + ': '}
              </BodyLong>
              <InstitutionList
                data-testid='a_buc_c_BUCHeader--label_owner_institution_id'
                flagType='circle'
                institutions={[buc.creator!]}
                locale={locale}
                type='separated'
              />
            </HStack>
            {buc.caseId && (
              <HStack
                data-testid='a_buc_c_BUCHeader--label_case_id'
              >
                {rinaUrl
                  ? (
                    <BodyLong className={styles.rowText}>
                      {t('buc:form-caseNumberInRina') + ':  '}

                      {/*OBJECT hack - wrap inner link in <object> to get rid of nested links error*/}
                      {/*https://kizu.dev/nested-links/*/}
                      <object type="owo/uwu">
                        <Link
                          className={styles.rinaLink}
                          data-testid='a_buc_c_BUCHeader--label_case_gotorina_link_id'
                          href={rinaUrl + buc.caseId}
                          onClick={onRinaLinkClick}
                          target='rinaWindow'
                        >
                          {buc.caseId}
                        </Link>
                      </object>
                    </BodyLong>
                    )
                  : (
                    <WaitingPanel size='xsmall' oneLine />
                    )}
              </HStack>
            )}
          </div>
          <HStack
            align="center"
            data-testid='a_buc_c_BUCHeader--icon_id'
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
              <PopoverCustomized
                label={(
                  <span>{t('buc:form-youhaveXseds', { seds: numberOfSeds })}</span>
                )}
              >
                <div
                  className = {_flagSize === 'XL' ? styles.numberOfSedsDivFlagSizeXL : styles.numberOfSedsDivFlagSizeMd}
                  data-testid='a_buc_c_BUCHeader--icon_numberofseds_id'
                  data-icon-size={_flagSize}
                >
                  {numberOfSeds}
                </div>
              </PopoverCustomized>
            )}
          </HStack>
          <HStack
            marginInline="12 0"
            align="center"
            justify="start"
          >
            {bucInfo?.tags?.map((tag: string) => (
              <div key={tag}>
                <Box paddingInline="0 2">
                  <Tag variant='info' size='small'>{t('buc:' + tag)}</Tag>
                </Box>
              </div>
            ))}
          </HStack>
        </HGrid>
      </LinkPanel.Description>
    </>
  )
}

export default BUCHeader
