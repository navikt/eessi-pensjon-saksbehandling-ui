import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { HighContrastExpandingPanel, HighContrastLink } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Buc, Institutions, PersonAvdods, ValidBuc } from 'declarations/buc'
import { BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, RinaUrl } from 'declarations/types'
import _ from 'lodash'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import AlertStripe from 'nav-frontend-alertstriper'
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { keyframes, ThemeProvider } from 'styled-components'

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

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`
const BUCDetailPanel = styled(HighContrastExpandingPanel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight} 0.3s forwards;
`
const Properties = styled.dl`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .odd {
    background-color: ${({ theme }) => theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]};
  }
`
const Dt = styled.dt`
  width: 50%;
  padding-bottom: .25rem;
  padding-top: .25rem;
  .typo-element {
    margin-left: 0.5rem;
  }
`
const Dd = styled.dd`
  width: 50%;
  padding-bottom: .25rem;
  padding-top: .25rem;
  margin-bottom: 0;
`
const InstitutionListDiv = styled.div`
  padding: 0.5rem;
`
const BUCDetail: React.FC<BUCDetailProps> = ({
  buc, className, personAvdods
}: BUCDetailProps): JSX.Element => {
  const { highContrast, locale, rinaUrl }: BUCDetailSelector = useSelector<State, BUCDetailSelector>(mapState)
  const { t } = useTranslation()

  const avdod = _.find(personAvdods, p =>
    p.fnr === (buc as ValidBuc)?.subject?.avdod?.fnr
  )
  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <BUCDetailPanel
        highContrast={highContrast}
        data-testid='a-buc-c-bucdetail__panel-id'
        className={className}
        open
        heading={
          <Systemtittel>
            {buc.type + ' - ' + getBucTypeLabel({
              type: buc.type!,
              locale: locale,
              t: t
            })}
          </Systemtittel>
        }
      >
        <>
          {buc.readOnly && (
            <AlertStripe type='advarsel'>
              {t('buc:alert-readOnlyBuc')}
            </AlertStripe>
          )}
          <Properties>
            <Dt className='odd'>
              <Element>
                {t('ui:status')}:
              </Element>
            </Dt>
            <Dd className='odd' id='a-buc-c-bucdetail__props-status-id'>
              <Normaltekst>
                {t('buc:status-' + buc.status)}
              </Normaltekst>
            </Dd>
            <Dt>
              <Element>
                {t('buc:form-caseOwner')}:
              </Element>
            </Dt>
            <Dd id='a-buc-c-bucdetail__props-creator-id'>
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
            <Dd className='odd' id='a-buc-c-bucdetail__props-startDate-id'>
              <Normaltekst>
                {moment(buc.startDate!).format('DD.MM.YYYY')}
              </Normaltekst>
            </Dd>
            <Dt>
              <Element>
                {t('buc:form-rinaCaseNumber')}:
              </Element>
            </Dt>
            <Dd id='a-buc-c-bucdetail__props-caseId-id'>
              {rinaUrl ? (
                <HighContrastLink
                  data-amplitude='buc.edit.detail.rinaurl'
                  data-testid='a-buc-c-bucdetail__gotorina-link-id'
                  href={rinaUrl + buc.caseId}
                  target='rinaWindow'
                  onClick={linkLogger}
                >
                  {buc.caseId}
                </HighContrastLink>
              ) : <WaitingPanel size='S' />}
            </Dd>
            {buc.type === 'P_BUC_02' && (
              <>
                <Dt className='odd'>
                  <Element>
                    {t('buc:form-avdod')}:
                  </Element>
                </Dt>
                <Dd className='odd' id='a-buc-c-bucdetail__props-avdod-id'>
                  {avdod ? (
                    <Normaltekst>
                      {avdod?.fornavn +
                    (avdod?.mellomnavn ? ' ' + avdod?.mellomnavn : '') +
                    (avdod?.etternavn ? ' ' + avdod?.etternavn : '') +
                    ' - ' + avdod?.fnr + ' (' + t('buc:relasjon-' + avdod.relasjon) + ')'}
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
          <Undertittel
            id='a-buc-c-bucdetail__institutions-title-id'
            className='a-buc-c-bucdetail__institutions-title mb-2'
          >
            {t('buc:form-involvedInstitutions')}:
          </Undertittel>
          <div className='a-buc-c-bucdetail__institutions'>
            <InstitutionListDiv>
              <InstitutionList
                institutions={(buc.institusjon as Institutions)}
                locale={locale}
                type='separated'
              />
            </InstitutionListDiv>
          </div>
        </>
      </BUCDetailPanel>
    </ThemeProvider>
  )
}

BUCDetail.propTypes = {
  buc: BucPropType.isRequired,
  className: PT.string
}

export default BUCDetail
