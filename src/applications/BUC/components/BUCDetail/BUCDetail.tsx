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
import { Alert, Panel, Accordion, Link, Label, BodyLong, Heading } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import styled from 'styled-components'
import { useState } from 'react'
import {copyToClipboard} from "../../../../actions/app";
import {FilesFillIcon, FilesIcon} from "@navikt/aksel-icons";
import styles from 'src/assets/css/common.module.css'

const Dd = styled.dd`
  width: 50%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  margin-bottom: 0;
`
const Dt = styled.dt`
  width: 50%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  .typo-element {
    margin-left: 0.5rem;
  }
`

const DdTwoColumn = styled.dd`
  width: 100%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  margin-bottom: 0;
`
const DtTwoColumn = styled.dt`
  width: 100%;
  padding-bottom: 0.25rem;
  padding-top: 0.25rem;
  .typo-element {
    margin-left: 0.5rem;
  }
`

const InstitutionListDiv = styled.div`
  padding: 0.5rem;
`
const Properties = styled.dl`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .odd {
    background-color: var(--a-surface-subtle);
  }
`

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
    <Panel
      border
      data-testid='a_buc_c_BUCDetail'
      style={{ padding: '0px' }}
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
            <Properties>
              <Dt className='odd'>
                <Label>
                  {t('ui:status')}:
                </Label>
              </Dt>
              <Dd
                className='odd'
                data-testid='a_buc_c_BUCDetail--status_id'
              >
                <BodyLong>
                  {t('buc:status-' + buc.status)}
                </BodyLong>
              </Dd>
              <Dt>
                <Label>
                  {t('buc:form-caseOwner')}:
                </Label>
              </Dt>
              <Dd data-testid='a_buc_c_BUCDetail--creator_id'>
                <InstitutionList
                  institutions={[buc.creator!]}
                  locale={locale}
                  type='joined'
                />
              </Dd>
              <Dt className='odd'>
                <Label>
                  {t('ui:created')}:
                </Label>
              </Dt>
              <Dd
                className='odd'
                data-testid='a_buc_c_BUCDetail--startDate_id'
              >
                <BodyLong>
                  {moment(buc.startDate!).format('DD.MM.YYYY')}
                </BodyLong>
              </Dd>
              <Dt>
                <Label>
                  {t('buc:form-rinaCaseNumber')}:
                </Label>
              </Dt>
              <Dd data-testid='a_buc_c_BUCDetail--caseId_id'>
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
              </Dd>
              {!!buc.internationalId && (
                <>
                  <DtTwoColumn className='odd'>
                    <Label>
                      {t('buc:form-internationalId')}:
                    </Label>
                  </DtTwoColumn>
                  <DdTwoColumn className='odd' data-testid='a_buc_c_BUCDetail--internationalId_id'>
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
                  </DdTwoColumn>
                </>
              )}
              {bucsThatSupportAvdod(buc.type) && (
                <>
                  <Dt>
                    <Label>
                      {t('buc:form-avdod')}:
                    </Label>
                  </Dt>
                  <Dd data-testid='a_buc_c_BUCDetail--avdod_id'>
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
                  </Dd>
                </>
              )}
            </Properties>
            <Heading size='small'>
              {t('buc:form-involvedInstitutions')}:
            </Heading>
            <InstitutionListDiv data-testid='a_buc_c_BUCDetail--institutions_id'>
              <InstitutionList
                data-testid='a_buc_c_BUCDetail--institutionlist_id'
                institutions={(buc.institusjon as Institutions)}
                locale={locale}
                type='separated'
              />
            </InstitutionListDiv>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Panel>
  )
}

export default BUCDetail
