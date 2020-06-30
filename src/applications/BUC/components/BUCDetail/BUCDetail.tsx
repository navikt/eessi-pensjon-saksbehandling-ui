import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Buc, BucInfo, Institutions } from 'declarations/buc'
import { BucInfoPropType, BucPropType } from 'declarations/buc.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, RinaUrl } from 'declarations/types'
import { linkLogger } from 'metrics/loggers'
import moment from 'moment'
import Lenke from 'nav-frontend-lenker'
import { Element, Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled, { keyframes, ThemeProvider } from 'styled-components'

export interface BUCDetailProps {
  buc: Buc
  bucInfo?: BucInfo
  className ?: string
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
const BUCDetailPanel = styled(ExpandingPanel)`
  opacity: 0;
  transform: translateX(20px);
  animation: ${slideInFromRight} 0.3s forwards;
  background ${({theme}): any => theme['main-background-color']};
  border: 1px solid ${({theme}): any => theme['main-disabled-color']};
  border-radius: 4px;
  .ekspanderbartPanel__hode {
    background ${({theme}): any => theme['main-background-color']};
  }
`
const Properties = styled.dl`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .odd {
    background-color: ${({theme}): any => theme['main-background-other-color']};
  }
`
const DT = styled.dt`
  width: 50%;
  padding-bottom: .25rem;
  padding-top: .25rem;
  .typo-element {
    margin-left: 0.5rem;
  }
`
const DD = styled.dd`
  width: 50%;
  padding-bottom: .25rem;
  padding-top: .25rem;
  margin-bottom: 0;
`

const BUCDetail: React.FC<BUCDetailProps> = ({
  buc, bucInfo, className
}: BUCDetailProps): JSX.Element => {
  const { highContrast, locale, rinaUrl }: BUCDetailSelector = useSelector<State, BUCDetailSelector>(mapState)
  const { t } = useTranslation()

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast: theme}>
      <BUCDetailPanel
      id='a-buc-c-bucdetail__panel-id'
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
        <Properties>
          <DT className='odd'>
            <Element>
              {t('ui:status')}:
            </Element>
          </DT>
          <DD className='odd' id='a-buc-c-bucdetail__props-status-id'>
            <Normaltekst>
              {t('ui:' + buc.status)}
            </Normaltekst>
          </DD>
          <DT>
            <Element>
              {t('buc:form-caseOwner')}:
            </Element>
          </DT>
          <DD id='a-buc-c-bucdetail__props-creator-id'>
            <InstitutionList
              institutions={[buc.creator!]}
              locale={locale}
              type='joined'
            />
          </DD>
          <DT className='odd'>
            <Element>
              {t('ui:created')}:
            </Element>
          </DT>
          <DD className='odd' id='a-buc-c-bucdetail__props-startDate-id'>
            <Normaltekst>
              {moment(buc.startDate!).format('DD.MM.YYYY')}
            </Normaltekst>
          </DD>
          <DT>
            <Element>
              {t('buc:form-rinaCaseNumber')}:
            </Element>
          </DT>
          <DD id='a-buc-c-bucdetail__props-caseId-id'>
            {rinaUrl ? (
              <Lenke
                data-amplitude='buc.edit.detail.rinaurl'
                id='a-buc-c-bucdetail__gotorina-link-id'
                className='a-buc-c-bucdetail__gotorina-link'
                href={rinaUrl + buc.caseId}
                target='rinaWindow'
                onClick={linkLogger}
              >
                {buc.caseId}
              </Lenke>
            ) : <WaitingPanel size='S' />}
          </DD>
          <DT className='odd'>
            <Element>
              {t('ui:tags')}:
            </Element>
          </DT>
          <DD className='odd' id='a-buc-c-bucdetail__props-tags-id'>
            <Normaltekst>
              {bucInfo && bucInfo.tags ? bucInfo.tags.map((tag: string) => t('buc:' + tag)).join(', ') : ''}
            </Normaltekst>
          </DD>
          <DT>
            <Element>
              {t('ui:comment')}:
            </Element>
          </DT>
          <DD id='a-buc-c-bucdetail__props-comment-id'>
            <Normaltekst>
              {bucInfo && bucInfo.comment ? bucInfo.comment : ''}
            </Normaltekst>
          </DD>
        </Properties>
        <Undertittel
          id='a-buc-c-bucdetail__institutions-title-id'
          className='a-buc-c-bucdetail__institutions-title mb-2'
        >
          {t('buc:form-involvedInstitutions')}:
        </Undertittel>
        <div className='a-buc-c-bucdetail__institutions'>
          <InstitutionList
            institutions={(buc.institusjon as Institutions)}
            locale={locale}
            type='joined'
          />
        </div>
      </>
    </BUCDetailPanel>
    </ThemeProvider>
  )
}

BUCDetail.propTypes = {
  buc: BucPropType.isRequired,
  bucInfo: BucInfoPropType,
  className: PT.string
}

export default BUCDetail
