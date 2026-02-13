import { JSX, useEffect, useRef, useState } from 'react'
import {
  XMarkOctagonFillIcon,
  ChevronRightIcon,
  CheckmarkCircleFillIcon
} from '@navikt/aksel-icons'
import {BodyLong, Box, HStack, VStack} from '@navikt/ds-react'
import { ActionWithPayload } from '@navikt/fetch'
import {createSelector} from "@reduxjs/toolkit"

import {PSED, Validation} from "src/declarations/app.d";
import classNames from 'classnames'
import { Option } from 'src/declarations/app'
import { ErrorElement } from 'src/declarations/app.d'
import { UpdateSedPayload } from 'src/declarations/types'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import {useAppSelector} from "src/store";
import {State} from "src/declarations/reducers";
import WarningModal from "src/components/SaveAndSendSED/WarningModal";
import styles from "./MainForm.module.css";

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

const mapState = createSelector(
  (state: State) => state.validation.status,
  (state: State) => state.app.editingItems,
  (validation, editingItems): MainFormSelector => ({
    validation,
    editingItems
  })
)

const MainForm = <T extends PSED>({
  forms,
  PSED,
  setPSED,
  updatePSED,
  namespace
}: MainFormFCProps<T>) => {
  const { t } = useTranslation()
  const { validation, editingItems = {} }: any = useAppSelector(mapState)

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
        <VStack
          key={form.value}
          className={classNames(styles.nameAndOptionsVStack, {[styles.selected] : selected})}
        >
          <div
            className={styles.nameDiv}
            onClick={() => {
              changeMenu(form.value)
              return false
            }}
          >
            <HStack
              className={classNames({ selected },styles.nameLabelHStack)}
              gap="1"
            >
              {!isValidated
                ? menuVisited.indexOf(form.value) >= 0 && <CheckmarkCircleFillIcon color='grey'/>
                : validationHasErrors
                  ? <XMarkOctagonFillIcon color='red' />
                  : menuVisited.indexOf(form.value) >= 0 && <CheckmarkCircleFillIcon color='grey'/>
              }

                <BodyLong className={classNames({ selected }, styles.menuLabelText)}>
                  {form.label}
                </BodyLong>
            </HStack>
            <div className={styles.menuArrowDiv}>
              <ChevronRightIcon fontSize="1.5rem" />
            </div>
          </div>
        </VStack>
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
          <div className={classNames("left", styles.leftDiv)}>
            <>
              {renderOneLevelMenu(forms)}
              <div className={styles.lastDiv} />
            </>
          </div>
          <div className={styles.rightDiv}>
            {!currentMenu
              ? (
                <VStack
                  className={styles.rightBlankContent}
                  justify="center"
                  align="center"
                >
                  {t('label:velg-meny')}
                </VStack>
                )
              : (
                <div
                  key={`active-${currentMenu}`}
                  className={classNames(`active-${currentMenu}`, 'right', styles.rightActiveDiv)}
                >
                  {getForm(currentMenu)}
                </div>
                )}
          </div>
        </HStack>
      </Box>
    </VStack>
  )
}

export default MainForm
