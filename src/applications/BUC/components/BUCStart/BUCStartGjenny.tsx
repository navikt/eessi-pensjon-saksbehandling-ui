import {Alert, BodyLong, Box, Button, HGrid, HStack, Loader} from '@navikt/ds-react'
import {
  cleanNewlyCreatedBuc,
  resetBuc
} from 'src/actions/buc'
import { bucsThatSupportAvdod, getBucTypeLabel, valueSorter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import Select from 'src/components/Select/Select'
import ValidationBox from 'src/components/ValidationBox/ValidationBox'
import {
  ErrorElement,
  Option,
  Validation
} from 'src/declarations/app.d'
import {
  NewBucPayload, SakTypeKey, SakTypeValueToKeyMap
} from 'src/declarations/buc.d'
import { PersonAvdod } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {createBucGjenny, getBucOptionsGjenny} from "src/actions/gjenny";
import {BUCStartIndexProps, BUCStartSelector, mapBUCStartState} from "./BUCStartIndex";

const BUCStartGjenny: React.FC<BUCStartIndexProps> = ({
  onBucChanged,
  onBucCreated,
  onBucCancelled
}: BUCStartIndexProps): JSX.Element | null => {
  const {
    bucOptions, bucParam,
    loading, locale, newlyCreatedBuc, personPdl, personAvdods,
    pesysContext, subjectAreaList, sakType, sakId
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapBUCStartState)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_avdod, setAvdod] = useState<PersonAvdod | undefined>(undefined)
  const [_buc, setBuc] = useState<string | null | undefined>(bucParam)
  const [_showWarningBucDeceased, setShowWarningBucDeceased] = useState<boolean>(false)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_validation, setValidation] = useState<Validation>({})

  const hasNoValidationErrors = (validation: Validation): boolean => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const updateValidation = (_key: string, validationError: ErrorElement | undefined) => {
    if (!validationError) {
      const newValidation = _.cloneDeep(_validation)
      newValidation[_key] = undefined
      setValidation(newValidation)
    }
  }

  const validateBuc = (buc: string | null | undefined): ErrorElement | undefined => {
    if (!buc) {
      return {
        skjemaelementId: 'a_buc_c_BUCStart--buc-select-id',
        feilmelding: t('message:validation-chooseBuc')
      } as ErrorElement
    }
    return undefined
  }

  const validateSubjectArea = (subjectArea: string): ErrorElement | undefined => {
    if (!subjectArea) {
      return {
        skjemaelementId: 'a_buc_c_BUCStart--subjectarea-select-id',
        feilmelding: t('message:validation-chooseSubjectArea')
      } as ErrorElement
    }
    return undefined
  }

  const performValidation = () :boolean => {
    const validation: Validation = {}
    validation.subjectArea = validateSubjectArea(_subjectArea)
    validation.buc = validateBuc(_buc)
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onForwardButtonClick = (): void => {
    setShowWarningBucDeceased(false)
    dispatch(cleanNewlyCreatedBuc())

    const valid: boolean = performValidation()
    if (valid) {
      const payload: NewBucPayload = {
        buc: _buc!,
        person: personPdl!
      }
      payload.avdod = _avdod
      payload.sakType =  SakTypeValueToKeyMap[sakType!] as SakTypeKey
      payload.sakId = sakId
      dispatch(createBucGjenny(payload))
    }
  }

  const onCancelButtonClick = (): void => {
    dispatch(resetBuc())
    setBuc(bucParam)
    setAvdod(undefined)
    onBucCancelled()
  }

  const onSubjectAreaChange = (option: unknown): void => {
    if (option) {
      const thisSubjectArea: string = (option as Option).value
      setSubjectArea(thisSubjectArea)
      updateValidation('sed', validateSubjectArea(thisSubjectArea))
    }
  }

  const onBucChange = (option: unknown): void => {
    if (option) {
      const thisBuc: string = (option as Option).value
      setBuc(thisBuc)
      updateValidation('buc', validateBuc(thisBuc))
      if (onBucChanged) {
        onBucChanged(option as Option)
      }
    }
  }

  const getOptionLabel = (value: string): string => {
    let label: string = value
    const description: string = getBucTypeLabel({
      t,
      locale,
      type: value
    })
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const renderOptions = (options: Array<Option | string> | undefined, sort?: (a: Option, b: Option) => number): Array<Option> => {
    return options
      ? options.map((el: Option | string) => {
          let label: string, value: string
          if (typeof el === 'string') {
            value = el
            label = el
          } else {
            value = el.value
            label = el.label
          }
          return {
            label: getOptionLabel(label),
            value
          }
        }).sort(sort)
      : []
  }

  const bucListOptions = renderOptions(bucOptions, valueSorter)

  useEffect(() => {
    if(bucOptions === undefined && !loading.gettingBucOptions){
      dispatch(getBucOptionsGjenny())
    }
  }, [bucOptions, loading.gettingBucOptions])

  useEffect(() => {
    if (bucsThatSupportAvdod(_buc) &&
      personAvdods &&
      personAvdods.length === 1 &&
      !_avdod
    ) {
      setAvdod(personAvdods[0])
    }
  }, [_buc, _avdod, pesysContext, personAvdods])

  useEffect(() => {
    if (newlyCreatedBuc) {
      setBuc(undefined)
      onBucCreated()
    }
  }, [newlyCreatedBuc])

  return (
    <div data-testid='a_buc_c_BUCStart'>
      <HGrid
        gap="8"
        columns={2}
        width="100%"
      >
        <Box
          paddingInline="0 2"
        >
          <Box paddingBlock="8 0">
            <label className='navds-text-field--label navds-label'>
              {t('buc:form-chooseSubjectArea')}
            </label>
            <Select
              data-testid='a_buc_c_BUCStart--subjectarea-select-id'
              defaultValue={{ label: _subjectArea, value: _subjectArea } as Option}
              error={_validation?.subjectArea?.feilmelding}
              id='a_buc_c_BUCStart--subjectarea-select-id'
              isSearchable
              menuPortalTarget={document.getElementById('main')}
              onChange={onSubjectAreaChange}
              options={renderOptions(subjectAreaList)}
            />
          </Box>
          <Box paddingBlock="4 0">
            <label className='navds-text-field--label navds-label'>
              {t(loading.gettingBucOptions ? 'message:loading-bucOptions' : 'buc:form-chooseBuc')}
            </label>
            <Select
              data-testid='a_buc_c_BUCStart--buc-select-id'
              error={_validation?.buc?.feilmelding}
              id='a_buc_c_BUCStart--buc-select-id'
              isLoading={loading.gettingBucOptions}
              isSearchable
              menuPortalTarget={document.getElementById('main')}
              onChange={onBucChange}
              options={bucListOptions}
              value={_.find(bucListOptions, (b: Option) => b.value === _buc)}
            />
          </Box>
        </Box>
        <Box
          paddingInline="2 0"
        />
      </HGrid>
      {_showWarningBucDeceased && (
        <>
          <Box paddingBlock="8 0">
            <HGrid columns={2}>
              <Box
                paddingInline="0 6"
              >
                <Alert
                  variant='warning'
                  data-testid='a_buc_c_BUCStart--warning-id'
                >
                  <BodyLong>
                    {t('message:alert-noDeceased')}
                  </BodyLong>
                </Alert>
              </Box>
              <Box
              />
            </HGrid>
          </Box>
        </>
      )}
      <Box paddingBlock="8 4">
        <div data-testid='a_buc_c_BUCStart--buttons-id'>
          <HStack gap="4">
            <Button
              variant='primary'
              data-testid='a_buc_c_BUCStart--forward-button-id'
              disabled={loading.creatingBuc}
              onClick={onForwardButtonClick}
            >
              {loading.creatingBUC && <Loader />}
              {loading.creatingBUC
                ? t('message:loading-creatingCaseinRINA')
                : t('buc:form-createCaseinRINA')}
            </Button>
            <Button
              variant='tertiary'
              data-testid='a_buc_c_BUCStart--cancel-button-id'
              onClick={onCancelButtonClick}
            >{t('ui:cancel')}
            </Button>
          </HStack>
        </div>
      </Box>
      {!hasNoValidationErrors(_validation) && (
        <HGrid
          paddingBlock="4 0"
          columns={2}
        >
          <ValidationBox heading={t('message:error-validationbox-bucstart')} validation={_validation} />
        </HGrid>
      )}
    </div>
  )
}

export default BUCStartGjenny
