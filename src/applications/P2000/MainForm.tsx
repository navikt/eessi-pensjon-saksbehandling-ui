import { useEffect, useRef, useState } from 'react'
import {
  ErrorFilled,
  NextFilled,
  SuccessFilled
} from '@navikt/ds-icons'
import { BodyLong } from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import {
  FlexCenterDiv,
  FlexCenterSpacedDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  PileDiv
} from '@navikt/hoykontrast'

import {PSED, Validation} from "declarations/app.d";
import classNames from 'classnames'
import { WithErrorPanel } from 'components/StyledComponents'
import { Option } from 'declarations/app'
import { ErrorElement } from 'declarations/app.d'
import { UpdateSedPayload } from 'declarations/types'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {useAppSelector} from "../../store";
import {State} from "../../declarations/reducers";

const LeftDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  min-width: 300px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`
const RightDiv = styled.div`
  flex: 3;
  align-self: stretch;
  position: relative;
  overflow: hidden;
  width: 780px;
`
const RightActiveDiv = styled.div`
  border-width: 1px;
  border-style: solid;
  border-color: var(--a-border-strong);
  background-color: var(--a-bg-default);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  height: 100%;
  margin-left: -1px;
`
const NameAndOptionsDiv = styled(PileDiv)`
 &.selected {
   border-right: 1px solid var(--navds-panel-color-background);
   background-image: linear-gradient(to right, var(--a-bg-subtle), var(--a-bg-default));
 }
 background-color: var(--a-bg-default);
 border-top: 1px solid var(--a-border-strong);
 border-right: 1px solid var(--a-border-strong);
 border-width: 1px;
 border-bottom-width: 0px;
 border-style: solid;
 border-color: var(--a-border-strong);
`

const NameDiv = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 1rem 0.5rem;
  transition: all 0.2s ease-in-out;
  &:hover {
   color: var(--a-text-on-inverted);
   background-color: var(--a-surface-action-hover);
  }
`
const NameLabelDiv = styled(FlexCenterDiv)`
  flex: 1;
`
const LastDiv = styled.div`
  flex: 1;
  border-top: 1px solid var(--a-border-strong);
  border-right: 1px solid var(--a-border-strong);
`
const MenuLabelText = styled(BodyLong)`
  font-weight: bold;
`
const MenuArrowDiv = styled.div`
 padding: 0rem 0.5rem;
`
const BlankDiv = styled(PileCenterDiv)`
  border-width: 1px;
  border-style: solid;
  border-color: var(--a-border-strong);
  background-color: var(--a-bg-default);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-left: -1px;
  height: 100%;
`
const BlankContentDiv = styled(FlexCenterDiv)`
  flex: 1;
  align-self: center;
  background-color: var(--a-bg-default);
`
export interface MainFormFCProps<T> {
  forms: Array<Form>
  firstForm?: string
  PSED: T | null | undefined
  setPSED: (PSED: T) => ActionWithPayload<T>
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace: string
}

export interface MainFormProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  personID?: string | undefined
  personName?: string
  label?: string
  setPSED: (PSED: PSED ) => ActionWithPayload<PSED>
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  options ?: any
}

export interface MainFormSelector {
  validation: Validation
}

export interface Form extends Option {
  component: any
  condition ?: () => void
}

export const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

const MainForm = <T extends PSED>({
  forms,
  PSED,
  setPSED,
  updatePSED,
  namespace,
}: MainFormFCProps<T>) => {
  const { t } = useTranslation()
  const { validation }: any = useAppSelector(mapState)

  const initialMenu = forms.length === 1 ? forms[0].value : undefined
  const [currentMenu, _setCurrentMenu] = useState<string | undefined>(initialMenu)


  const setCurrentMenu = (newMenu: string | undefined) => {
    _setCurrentMenu(newMenu)
  }

  const menuRef = useRef(currentMenu)

  const getForm = (menu: string): JSX.Element | null => {
    let form: Form | undefined = _.find(forms, o => o.value === menu)
    if (form) {
      const Component = form.component
      return (
        <Component
          parentNamespace={namespace}
          personID={currentMenu!}
          label={form.label}
          PSED={PSED}
          setPSED={setPSED}
          updatePSED={updatePSED}
        />
      )
    }
    return null
  }

  const changeMenu = (menu: string) => {
    if (currentMenu !== menu) {
      setCurrentMenu(menu)
    }
    menuRef.current = menu
    return
  }

  const handleFeilLenke = (e: any) => {
    const error: ErrorElement = e.detail
    const namespaceBits = error.skjemaelementId.split('-')
    if (namespaceBits[0] === namespace) {
      const newMenu = namespaceBits[1]
      const currentMenu = menuRef.current
      if (!(newMenu === currentMenu)) {
        changeMenu(newMenu)
      }
      setTimeout(() => {
        const element = document.getElementById(error.skjemaelementId)
        if (element) {
          element?.focus()
          element?.closest('.mainform')?.scrollIntoView({
            block: 'start',
            inline: 'start',
            behavior: 'smooth'
          })
          element?.focus()
        }
      }, 200)
    }
  }

  const renderOneLevelMenu = (forms: Array<Form>) => {
    return forms.filter(o => _.isFunction(o.condition) ? o.condition() : true).map((form) => {
      const selected: boolean = currentMenu === form.value
      const validationKeys = Object.keys(validation).filter(k => k.startsWith(namespace + '-' + form.value))
      const isValidated = validationKeys.length > 0
      const validationHasErrors = isValidated && _.some(validationKeys, v => validation[v]?.feilmelding !== 'ok')
      return (
        <NameAndOptionsDiv
          key={form.value}
          className={classNames({ selected })}
        >
          <NameDiv
            onClick={() => {
              changeMenu(form.value)
              return false
            }}
          >
            <NameLabelDiv
              className={classNames({ selected })}
            >
              {!isValidated
                ? null
                : validationHasErrors
                  ? <ErrorFilled height={20} color='red' />
                  : <SuccessFilled color='green' height={20} />
              }
              <>
                <HorizontalSeparatorDiv size='0.5' />
                <MenuLabelText className={classNames({ selected })}>
                  {form.label}
                </MenuLabelText>
              </>
            </NameLabelDiv>
            <MenuArrowDiv>
              <NextFilled />
            </MenuArrowDiv>
          </NameDiv>
        </NameAndOptionsDiv>
      )
    })
  }

  useEffect(() => {
    document.addEventListener('feillenke', handleFeilLenke)
    return () => {
      document.removeEventListener('feillenke', handleFeilLenke)
    }
  }, [])

  return (
    <PileDiv className='mainform'>
      <WithErrorPanel
        border
        className={classNames({ error: null })}
      >
        <FlexCenterSpacedDiv>
          <LeftDiv className='left'>
            <>
              {renderOneLevelMenu(forms)}
              <LastDiv />
            </>
          </LeftDiv>
          <RightDiv>
            {!currentMenu
              ? (
                <BlankDiv>
                  <BlankContentDiv>
                    {t('label:velg-meny')}
                  </BlankContentDiv>
                </BlankDiv>
                )
              : (
                <RightActiveDiv
                  key={`active-${currentMenu}`}
                  className={classNames(`active-${currentMenu}`, 'right')}
                >
                  {getForm(currentMenu)}
                </RightActiveDiv>
                )}
          </RightDiv>
        </FlexCenterSpacedDiv>
      </WithErrorPanel>
    </PileDiv>
  )
}

export default MainForm
