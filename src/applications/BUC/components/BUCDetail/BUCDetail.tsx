import { bucsWithAvdod, getBucTypeLabel, renderAvdodName } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { slideInFromRight } from 'components/keyframes'
import { HighContrastExpandingPanel, HighContrastLink } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Buc, Institutions, ValidBuc } from 'declarations/buc'
import { BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, RinaUrl } from 'declarations/app.d'
import { PersonAvdod, PersonAvdods } from 'declarations/person.d'
import { PersonAvdodsPropType } from 'declarations/person.pt'
import _ from 'lodash'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import AlertStripe from 'nav-frontend-alertstriper'
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import { theme, themeHighContrast, themeKeys } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'

const BUCDetailPanel = styled(HighContrastExpandingPanel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight} 0.3s forwards;
`
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
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
`

export interface BUCDetailProps {
  buc: Buc
  className ?: string
  personAvdods: PersonAvdods | undefined
}

export interface BUCDetailSelector {
  highContrast: boolean
  locale: AllowedLocaleString
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCDetailSelector => ({
  highContrast: state.ui.highContrast,
  locale: state.ui.locale,
  rinaUrl: state.buc.rinaUrl
})

const BUCDetail: React.FC<BUCDetailProps> = ({
  buc, className, personAvdods
}: BUCDetailProps): JSX.Element => {
  const { highContrast, locale, rinaUrl }: BUCDetailSelector = useSelector<State, BUCDetailSelector>(mapState)
  const { t } = useTranslation()

  const avdod: PersonAvdod | undefined = _.find(personAvdods, (p: PersonAvdod) => (
    p.fnr === (buc as ValidBuc)?.subject?.avdod?.fnr
  ))

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCDetailPanel
        className={className}
        data-test-id='a-buc-c-bucdetail__panel-id'
        heading={(
          <Systemtittel>
            {buc.type + ' - ' + getBucTypeLabel({
              type: buc.type!,
              locale: locale,
              t: t
            })}
          </Systemtittel>
        )}
        highContrast={highContrast}
        open
      >
        <>
          {buc.readOnly && (
            <AlertStripe
              data-test-id='a-buc-c-bucdetail__readonly'
              type='advarsel'
            >
              {t('buc:alert-readOnlyBuc')}
            </AlertStripe>
          )}
          <Properties>
            <Dt className='odd'>
              <Element>
                {t('ui:status')}:
              </Element>
            </Dt>
            <Dd
              className='odd'
              data-test-id='a-buc-c-bucdetail__status-id'
            >
              <Normaltekst>
                {t('buc:status-' + buc.status)}
              </Normaltekst>
            </Dd>
            <Dt>
              <Element>
                {t('buc:form-caseOwner')}:
              </Element>
            </Dt>
            <Dd data-test-id='a-buc-c-bucdetail__creator-id'>
              <InstitutionList
                institutions={[buc.creator!]}
                locale={locale}
                type='joined'
              />
            </Dd>
            <Dt className='odd'>
              <Element>
                {t('ui:created')}:
              </Element>
            </Dt>
            <Dd
              className='odd'
              data-test-id='a-buc-c-bucdetail__startDate-id'
            >
              <Normaltekst>
                {moment(buc.startDate!).format('DD.MM.YYYY')}
              </Normaltekst>
            </Dd>
            <Dt>
              <Element>
                {t('buc:form-rinaCaseNumber')}:
              </Element>
            </Dt>
            <Dd data-test-id='a-buc-c-bucdetail__caseId-id'>
              {rinaUrl ? (
                <HighContrastLink
                  data-amplitude='buc.edit.detail.rinaurl'
                  data-test-id='a-buc-c-bucdetail__gotorina-link-id'
                  href={rinaUrl + buc.caseId}
                  target='rinaWindow'
                  onClick={linkLogger}
                >
                  {buc.caseId}
                </HighContrastLink>
              ) : (
                <WaitingPanel size='S' />
              )}
            </Dd>
            {bucsWithAvdod(buc.type) && (
              <>
                <Dt className='odd'>
                  <Element>
                    {t('buc:form-avdod')}:
                  </Element>
                </Dt>
                <Dd className='odd' data-test-id='a-buc-c-bucdetail__avdod-id'>
                  {avdod ? (
                    <Normaltekst>
                      {renderAvdodName(avdod, t)}
                    </Normaltekst>
                  ) : (
                    <Normaltekst>
                      {(buc as ValidBuc)?.subject?.avdod?.fnr}
                    </Normaltekst>
                  )}
                </Dd>
              </>
            )}
          </Properties>
          <Undertittel>
            {t('buc:form-involvedInstitutions')}:
          </Undertittel>
          <InstitutionListDiv data-test-id='a-buc-c-bucdetail__institutions-id'>
            <InstitutionList
              data-test-id='a-buc-c-bucdetail__institutionlist-id'
              institutions={(buc.institusjon as Institutions)}
              locale={locale}
              type='separated'
            />
          </InstitutionListDiv>
        </>
      </BUCDetailPanel>
    </ThemeProvider>
  )
}

BUCDetail.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string,
  personAvdods: PersonAvdodsPropType.isRequired
}

export default BUCDetail
