import { getPersonAvdodInfo, getPersonInfo } from 'actions/app'
import classNames from 'classnames'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { WidgetPropType } from 'declarations/Dashboard.pt'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, PesysContext } from 'declarations/types'
import _ from 'lodash'
import { standardLogger, timeDiffLogger } from 'metrics/loggers'
import { Widget } from 'nav-dashboard'
import Alertstripe from 'nav-frontend-alertstriper'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled, { ThemeProvider } from 'styled-components'
import PersonPanel from './PersonPanel'
import PersonTitle from './PersonTitle'

const mapState = (state: State): OverviewSelector => ({
  /* istanbul ignore next */
  aktoerId: state.app.params.aktoerId,
  featureToggles: state.app.featureToggles,
  gettingPersonInfo: state.loading.gettingPersonInfo,
  locale: state.ui.locale,
  person: state.app.person,
  personAvdod: state.app.personAvdod,
  pesysContext: state.app.pesysContext,
  vedtakId: state.app.params.vedtakId
})

export interface OverviewSelector {
  aktoerId: string
  featureToggles: FeatureToggles
  gettingPersonInfo: boolean
  locale: AllowedLocaleString
  person: any,
  personAvdod: any,
  pesysContext: PesysContext | undefined,
  vedtakId: string
}

export interface OverviewProps {
  highContrast: boolean
  onUpdate?: (w: Widget) => void
  skipMount?: boolean
  widget: Widget
}

export const OverviewPanel = styled(ExpandingPanel)`
  border: 1px solid ${({ theme }: any) => theme.navGra40};
  .ekspanderbartPanel {
    background: ${({ theme }: any) => theme['main-background-color']};
  }
  .ekspanderbartPanel__hode {
    background:  ${({ theme }: any) => theme['main-background-color']};
  }
`

export const Overview: React.FC<OverviewProps> = ({
  highContrast,
  onUpdate,
  skipMount = false,
  widget
}: OverviewProps): JSX.Element => {
  const [mounted, setMounted] = useState<boolean>(skipMount)
  const { aktoerId, featureToggles, gettingPersonInfo, locale, person, personAvdod, pesysContext, vedtakId }: OverviewSelector =
    useSelector<State, OverviewSelector>(mapState)
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('overview.mouseover', totalTimeWithMouseOver)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (!mounted && aktoerId && pesysContext) {
      if (!person) {
        dispatch(getPersonInfo(aktoerId))
        if (featureToggles.v2_ENABLED === true && pesysContext === 'vedtakskontekst') {
          dispatch(getPersonAvdodInfo(aktoerId, vedtakId))
        }
      }
      setMounted(true)
    }
  }, [featureToggles, mounted, dispatch, aktoerId, person, pesysContext, vedtakId])

  const onExpandablePanelChange = (): void => {
    const newWidget = _.cloneDeep(widget)
    newWidget.options.collapsed = !newWidget.options.collapsed
    standardLogger('overview.ekspandpanel.' + (newWidget.options.collapsed ? 'close' : 'open'))
    if (onUpdate) {
      onUpdate(newWidget)
    }
  }

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  if (!aktoerId) {
    return (
      <Alertstripe type='advarsel' className='w-overview__alert w-100'>
        {t('buc:validation-noAktoerId')}
      </Alertstripe>
    )
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <OverviewPanel
          highContrast={highContrast}
          collapseProps={{ id: 'w-overview-id' }}
          className={classNames({ highContrast: highContrast })}
          open={!widget.options.collapsed}
          onClick={onExpandablePanelChange}
          heading={(
            <PersonTitle
              gettingPersonInfo={gettingPersonInfo}
              person={person}
              personAvdod={personAvdod}
            />
          )}
        >
          <PersonPanel
            highContrast={highContrast}
            locale={locale}
            person={person}
          />
        </OverviewPanel>
      </div>
    </ThemeProvider>
  )
}

Overview.propTypes = {
  onUpdate: PT.func,
  skipMount: PT.bool,
  widget: WidgetPropType.isRequired
}

export default Overview
