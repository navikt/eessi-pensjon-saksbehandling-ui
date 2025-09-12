import { useEffect, useRef, useState } from 'react'
import {
  XMarkOctagonFillIcon,
  ChevronRightIcon,
  CheckmarkCircleFillIcon
} from '@navikt/aksel-icons'
import {BodyLong, Box, HStack, VStack} from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'

import {PSED, Validation} from "src/declarations/app.d";
import classNames from 'classnames'
import { Option } from 'src/declarations/app'
import { ErrorElement } from 'src/declarations/app.d'
import { UpdateSedPayload } from 'src/declarations/types'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {useAppSelector} from "src/store";
import {State} from "src/declarations/reducers";
import WarningModal from "src/components/SaveAndSendSED/WarningModal";
import styles from "./MainForm.module.css";

const LeftDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`
const RightDiv = styled.div`
  flex: 3;
  overflow: visible;
`

const RightActiveDiv = styled.div`
  border-width: 1px;
  border-style: solid;
  border-color: var(--a-border-strong);
  border-left: 1px solid var(--a-bg-default);
  background-color: var(--a-bg-default);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  height: 100%;
  margin-left: 0px;
  overflow: visible;
`
const NameAndOptionsDiv = styled(VStack)`
 &.selected {
   border-right: 1px solid var(--a-bg-default);
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
   margin-right: -1px;
  }
`
const NameLabelDiv = styled(HStack)`
  align-items: center;
  padding-left: 0.5rem;
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
const RightBlankContent = styled(VStack)`
  border-width: 1px;
  border-style: solid;
  border-color: var(--a-border-strong);
  background-color: var(--a-bg-default);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  margin-left: -1px;
  height: 100%;
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
  editingItems?: any
}

export interface Form extends Option {
  component: any
  condition ?: () => void
  options?: any
}

export const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
  editingItems: state.app.editingItems
})

const MainForm = <T extends PSED>({
  forms,
  PSED,
  setPSED,
  updatePSED,
  namespace
}: MainFormFCProps<T>) => {
  const { t } = useTranslation()
  const { validation, editingItems }: any = useAppSelector(mapState)

  const initialMenu = forms.length === 1 ? forms[0].value : undefined
  const [currentMenu, _setCurrentMenu] = useState<string | undefined>(initialMenu)
  const [menuVisited, _setMenuVisited] = useState<Array<string>>([])

  const [_viewWarningModal, setViewWarningModal] = useState<boolean>(false)


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
          options={form.options ?? {}}
        />
      )
    }
    return null
  }

  const changeMenu = (menu: string) => {
    if(Object.keys(editingItems).length > 0){
      setViewWarningModal(true)
      return
    }
    if (currentMenu !== menu) {
      setCurrentMenu(menu)
    }
    menuRef.current = menu
    _setMenuVisited(visitedArr => [...visitedArr, menu])
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
              gap="1"
            >
              {!isValidated
                ? menuVisited.indexOf(form.value) >= 0 && <CheckmarkCircleFillIcon color='grey'/>
                : validationHasErrors
                  ? <XMarkOctagonFillIcon color='red' />
                  : menuVisited.indexOf(form.value) >= 0 && <CheckmarkCircleFillIcon color='grey'/>
              }

                <MenuLabelText className={classNames({ selected })}>
                  {form.label}
                </MenuLabelText>
            </NameLabelDiv>
            <MenuArrowDiv>
              <ChevronRightIcon fontSize="1.5rem" />
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

  const panelError = _.some(Object.keys(validation), k => k.startsWith(namespace) && validation[k]?.feilmelding !== 'ok')

  return (
    <VStack className='mainform'>
      <WarningModal open={_viewWarningModal} onModalClose={() => setViewWarningModal(false)} elementKeys={Object.keys(editingItems)}/>
      <Box
        className={classNames(styles.withErrorBox, { [styles.error]: panelError })}
      >
        <HStack>
          <LeftDiv className='left'>
            <>
              {renderOneLevelMenu(forms)}
              <LastDiv/>
            </>
          </LeftDiv>
          <RightDiv>
            {!currentMenu
              ? (
                <RightBlankContent justify="center" align="center">
                  {t('label:velg-meny')}
                </RightBlankContent>
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
        </HStack>
      </Box>
    </VStack>
  )
}

export default MainForm
