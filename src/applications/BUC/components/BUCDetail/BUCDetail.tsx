import {
  bucsThatSupportAvdod,
  getBucTypeLabel,
  renderAvdodName
} from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'src/applications/BUC/components/InstitutionList/InstitutionList'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString, RinaUrl } from 'src/declarations/app.d'
import { Buc, Institutions, ValidBuc } from 'src/declarations/buc'
import { PersonAvdod, PersonAvdods } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import moment from 'moment'
import {Alert, Accordion, Link, Label, BodyLong, Heading, Box} from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import { useState } from 'react'
import {copyToClipboard} from "src/actions/app";
import {FilesFillIcon, FilesIcon} from "@navikt/aksel-icons";
import styles from './BUCDetail.module.css'
import classNames from "classnames";

export interface BUCDetailProps {
  buc: Buc
  className ?: string
  personAvdods?: PersonAvdods
}

export interface BUCDetailSelector {
  locale: AllowedLocaleString
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCDetailSelector => ({
  locale: state.ui.locale,
  rinaUrl: state.buc.rinaUrl
})

const BUCDetail: React.FC<BUCDetailProps> = ({
  buc, className, personAvdods, ...props
}: BUCDetailProps): JSX.Element => {
  const { locale, rinaUrl }: BUCDetailSelector = useSelector<State, BUCDetailSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_open, setOpen] = useState<boolean>(true)
  const [hover, isHover] = useState<boolean>(false);

  const avdod: PersonAvdod | undefined = _.find(personAvdods, p => {
    const avdodFnr = p.fnr
    const needleFnr = (buc as ValidBuc)?.addedParams?.subject?.avdod?.fnr
    if(needleFnr){
      return avdodFnr === needleFnr
    } else {
      return true
    }
  })

  return (
    <Box
      padding="0"
      borderWidth="1"
      borderRadius="small"
      background= "bg-default"
      data-testid='a_buc_c_BUCDetail'
      {...props}
    >
      <Accordion
        style={{ borderRadius: '4px' }}
        className={className}
        data-testid='a_buc_c_BUCDetail--panel_id'
        indent={false}
      >
        <Accordion.Item open={_open}>
          <Accordion.Header onClick={() => setOpen(!_open)} style={{ borderBottom: 'none' }}>
            <Heading size='medium'>
              {buc.type + ' - ' + getBucTypeLabel({
                type: buc.type!,
                locale,
                t
              })}
            </Heading>
          </Accordion.Header>
          <Accordion.Content>
            {buc.readOnly && (
              <Alert
                data-testid='a_buc_c_BUCDetail--readonly'
                variant='warning'
              >
                {t('message:alert-readOnlyBuc')}
              </Alert>
            )}
            <dl className={classNames(styles.properties, styles.odd)}>
              <dt
                className={classNames(styles.odd, styles.Dt)}
              >
                <Label>
                  {t('ui:status')}:
                </Label>
              </dt>
              <dd
                className={classNames(styles.odd, styles.Dd)}
                data-testid='a_buc_c_BUCDetail--status_id'
              >
                <BodyLong>
                  {t('buc:status-' + buc.status)}
                </BodyLong>
              </dd>
              <dt
                className={styles.Dt}
              >
                <Label>
                  {t('buc:form-caseOwner')}:
                </Label>
              </dt>
              <dd
                className={styles.Dd}
                data-testid='a_buc_c_BUCDetail--creator_id'
              >
                <InstitutionList
                  institutions={[buc.creator!]}
                  locale={locale}
                  type='joined'
                />
              </dd>
              <dt
                className={classNames(styles.odd, styles.Dt)}
              >
                <Label>
                  {t('ui:created')}:
                </Label>
              </dt>
              <dd
                className={classNames(styles.odd, styles.Dd)}
                data-testid='a_buc_c_BUCDetail--startDate_id'
              >
                <BodyLong>
                  {moment(buc.startDate!).format('DD.MM.YYYY')}
                </BodyLong>
              </dd>
              <dt
                className={styles.Dt}
              >
                <Label>
                  {t('buc:form-rinaCaseNumber')}:
                </Label>
              </dt>
              <dd
                className={styles.Dd}
                data-testid='a_buc_c_BUCDetail--caseId_id'
              >
                {rinaUrl
                  ? (
                    <Link
                      data-testid='a_buc_c_BUCDetail--gotorina_link_id'
                      href={rinaUrl + buc.caseId}
                      target='rinaWindow'
                    >
                      {buc.caseId}
                    </Link>
                    )
                  : (
                    <WaitingPanel data-testid='a_buc_c_BUCDetail--gotorina_waiting_id' size='xsmall' />
                    )}
              </dd>
              {!!buc.internationalId && (
                <>
                  <dt className={classNames(styles.odd, styles.DtTwoColumn)}>
                    <Label>
                      {t('buc:form-internationalId')}:
                    </Label>
                  </dt>
                  <dd
                    className={classNames(styles.odd, styles.DdTwoColumn)}
                    data-testid='a_buc_c_BUCDetail--internationalId_id'
                  >
                    {buc.internationalId}
                    <Link
                      onMouseEnter={() => isHover(true)}
                      onMouseLeave={() => isHover(false)}
                      title={t('buc:form-kopier-internasjonal-id')} onClick={(e: any) => {
                        e.preventDefault()
                        e.stopPropagation()
                        dispatch(copyToClipboard(buc.internationalId ? buc.internationalId : ""))
                      }}
                    >
                      {hover ?
                        <FilesFillIcon className={styles.copyFilledWithMargin} fontSize="1.5rem"/> :
                        <FilesIcon className={styles.copyWithMargin} fontSize="1.5rem"/>
                      }
                    </Link>
                  </dd>
                </>
              )}
              {bucsThatSupportAvdod(buc.type) && (
                <>
                  <dt
                    className={styles.Dt}
                  >
                    <Label>
                      {t('buc:form-avdod')}:
                    </Label>
                  </dt>
                  <dd
                    className={styles.Dd}
                    data-testid='a_buc_c_BUCDetail--avdod_id'
                  >
                    {avdod
                      ? (
                        <BodyLong>
                          {renderAvdodName(avdod, t)}
                        </BodyLong>
                        )
                      : (
                        <BodyLong>
                          {(buc as ValidBuc)?.addedParams?.subject?.avdod?.fnr || t('buc:form-noAvdod')}
                        </BodyLong>
                        )}
                  </dd>
                </>
              )}
            </dl>
            <Heading size='small'>
              {t('buc:form-involvedInstitutions')}:
            </Heading>
            <Box
              padding="2"
              data-testid='a_buc_c_BUCDetail--institutions_id'
            >
              <InstitutionList
                data-testid='a_buc_c_BUCDetail--institutionlist_id'
                institutions={(buc.institusjon as Institutions)}
                locale={locale}
                type='separated'
              />
            </Box>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Box>
  )
}

export default BUCDetail
