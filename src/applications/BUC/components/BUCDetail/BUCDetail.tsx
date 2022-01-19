import {
  bucsThatSupportAvdod,
  getBucTypeLabel,
  renderAvdodName
} from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString, RinaUrl } from 'declarations/app.d'
import { Buc, Institutions, ValidBuc } from 'declarations/buc'
import { BucPropType } from 'declarations/buc.pt'
import { PersonAvdod, PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import { Alert, Panel, Accordion, Link, Label, BodyLong, Heading } from '@navikt/ds-react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { useState } from 'react'

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

const InstitutionListDiv = styled.div`
  padding: 0.5rem;
`
const Properties = styled.dl`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .odd {
    background-color: var(--navds-semantic-color-component-background-alternate);
  }
`

export interface BUCDetailProps {
  buc: Buc
  className ?: string
  personAvdods: PersonAvdods | undefined
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
  buc, className, personAvdods
}: BUCDetailProps): JSX.Element => {
  const { locale, rinaUrl }: BUCDetailSelector = useSelector<State, BUCDetailSelector>(mapState)
  const { t } = useTranslation()
  const [_open, setOpen] = useState<boolean>(true)

  const avdod: PersonAvdod | undefined = _.find(personAvdods, p => {
    const avdodFnr = p.fnr
    const needleFnr = (buc as ValidBuc)?.addedParams?.subject?.avdod?.fnr
    return avdodFnr === needleFnr
  })

  return (
    <Panel border style={{ padding: '0px' }}>
      <Accordion
        style={{ borderRadius: '4px' }}
        className={className}
        data-test-id='a-buc-c-bucdetail__panel-id'
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
                data-test-id='a-buc-c-bucdetail__readonly'
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
                data-test-id='a-buc-c-bucdetail__status-id'
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
              <Dd data-test-id='a-buc-c-bucdetail__creator-id'>
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
                data-test-id='a-buc-c-bucdetail__startDate-id'
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
              <Dd data-test-id='a-buc-c-bucdetail__caseId-id'>
                {rinaUrl
                  ? (
                    <Link
                      data-amplitude='buc.edit.detail.rinaurl'
                      data-test-id='a-buc-c-bucdetail__gotorina-link-id'
                      href={rinaUrl + buc.caseId}
                      target='rinaWindow'
                      onClick={linkLogger}
                    >
                      {buc.caseId}
                    </Link>
                    )
                  : (
                    <WaitingPanel data-test-id='a-buc-c-bucdetail__gotorina-waiting-id' size='xsmall' />
                    )}
              </Dd>
              {bucsThatSupportAvdod(buc.type) && (
                <>
                  <Dt className='odd'>
                    <Label>
                      {t('buc:form-avdod')}:
                    </Label>
                  </Dt>
                  <Dd className='odd' data-test-id='a-buc-c-bucdetail__avdod-id'>
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
            <InstitutionListDiv data-test-id='a-buc-c-bucdetail__institutions-id'>
              <InstitutionList
                data-test-id='a-buc-c-bucdetail__institutionlist-id'
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

BUCDetail.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  personAvdods: PT.any.isRequired
}

export default BUCDetail
