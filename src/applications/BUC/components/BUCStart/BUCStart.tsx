import {Alert, BodyLong, Box, Button, HelpText, HGrid, HStack, Loader, TextField, VStack} from '@navikt/ds-react'
import {
  cleanNewlyCreatedBuc,
  createBuc,
  fetchKravDato,
  getBucOptions,
  getTagList,
  resetBuc,
  saveBucsInfo
} from 'src/actions/buc'
import { bucsThatSupportAvdod, getBucTypeLabel, valueSorter } from 'src/applications/BUC/components/BUCUtils/BUCUtils'
import MultipleSelect from 'src/components/MultipleSelect/MultipleSelect'
import Select from 'src/components/Select/Select'
import ValidationBox from 'src/components/ValidationBox/ValidationBox'
import WaitingPanel from 'src/components/WaitingPanel/WaitingPanel'
import * as constants from 'src/constants/constants'
import {
  ErrorElement,
  Option,
  PesysContext,
  Validation
} from 'src/declarations/app.d'
import {
  Buc,
  NewBucPayload,
  SakTypeMap,
  SakTypeValue,
  SaveBucsInfoProps,
  Tag,
  Tags
} from 'src/declarations/buc.d'
import { PersonAvdod, PersonAvdods } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import moment from 'moment'
import React, {JSX, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { BUCStartIndexProps, BUCStartSelector, mapBUCStartState } from "./BUCStartIndex";
import styles from './BUCStart.module.css'

export interface BUCStartProps {
  aktoerId: string | null | undefined
  initialCreatingBucInfo?: boolean
  initialIsCreatingBuc?: boolean
  onBucChanged?: (option: Option) => void
  onBucCreated: () => void
  onBucCancelled: () => void
}

const BUCStart: React.FC<BUCStartIndexProps> = ({
  aktoerId,
  initialIsCreatingBuc = false,
  initialCreatingBucInfo = false,
  onBucChanged,
  onBucCreated,
  onBucCancelled
}: BUCStartIndexProps): JSX.Element | null => {
  const {
    bucOptions, bucParam, bucs, bucsInfo, currentBuc, featureToggles,
    kravDato, kravId, loading, locale, newlyCreatedBuc, personPdl, personAvdods,
    pesysContext, sakId, sakType, subjectAreaList, tagList
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapBUCStartState)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_avdod, setAvdod] = useState<PersonAvdod | undefined>(undefined)
  const [_avdodFnr, setAvdodFnr] = useState<string | undefined>('')
  const [_buc, setBuc] = useState<string | null | undefined>(bucParam)
  const [_kravDato, setKravDato] = useState<string>(kravDato || '')
  const [_isCreatingBuc, setIsCreatingBuc] = useState<boolean>(initialIsCreatingBuc)
  const [_isCreatingBucInfo, setIsCreatingBucInfo] = useState<boolean>(initialCreatingBucInfo)
  const [_showWarningBuc01, setShowWarningBuc01] = useState<boolean>(false)
  const [_showWarningBucDeceased, setShowWarningBucDeceased] = useState<boolean>(false)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_tags, setTags] = useState<Tags>([])
  const [_validation, setValidation] = useState<Validation>({})

  // BEGIN QUESTIONS

  const avdodExists = (): boolean => (personAvdods ? personAvdods.length > 0 : false)

  // show avdod select for P_BUC_02, P_BUC_05, P_BUC_06, P_BUC_10 and when there are avdods
  const bucNeedsAvdod = (): boolean => {
    return (
      bucsThatSupportAvdod(_buc) && avdodExists() &&
      (_buc === 'P_BUC_10'
        ? pesysContext === constants.VEDTAKSKONTEKST && (
            sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
          sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP)
        : true
      )
    )
  }

  // when for some reason bucNeedsAvdod fails but we are still in P_BUC_10 (like having no avdød and in other contexts)
  // then we can punch in the avdods fnr
  const bucNeedsAvdodButWeHaveNone = (): boolean => {
    return (
      !bucNeedsAvdod() &&
      (_buc === 'P_BUC_10' && (
        sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
          sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP
      )
      )
    )
  }

  // fetch krav dato for P_BUC_10 criteria
  const bucNeedsKravDatoAndCanFetchIt = (buc: string | null | undefined): boolean => {
    return !!(buc === 'P_BUC_10' &&
        sakId && aktoerId && kravId &&
        pesysContext === constants.VEDTAKSKONTEKST &&
        (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
          sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP)
    )
  }

  // show krav dato for P_BUC_10
  const bucNeedsKravDato = (buc: string | null | undefined): boolean => {
    return !!(buc === 'P_BUC_10' && sakId && aktoerId &&
      (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
        sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP)
    )
  }

  // END QUESTIONS

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

  const validateAvdod = (avdod: PersonAvdod | undefined): ErrorElement | undefined => {
    if (!avdod) {
      return {
        skjemaelementId: 'a_buc_c_BUCStart--avdod-select-id',
        feilmelding: t('message:validation-chooseAvdod')
      } as ErrorElement
    }
    return undefined
  }

  const validateAvdodFnr = (avdodFnr: string | undefined): ErrorElement | undefined => {
    if (avdodFnr && !(avdodFnr.length === 11 && avdodFnr.match(/\d{11}/))) {
      return {
        skjemaelementId: 'a_buc_c_BUCStart--avdod-input-id',
        feilmelding: t('message:validation-badAvdodFnr')
      } as ErrorElement
    }
    return undefined
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

  const validateKravDato = (kravDato: string | undefined): ErrorElement | undefined => {
    if (kravDato && !kravDato.match(/\d{2}-\d{2}-\d{4}/)) {
      return {
        skjemaelementId: 'a_buc_c_sedstart--kravDato-input-id',
        feilmelding: t('message:validation-badKravDato')
      } as ErrorElement
    }
    if (kravDato && !moment(kravDato, 'DD-MM-ÅÅÅÅ').isValid()) {
      return {
        feilmelding: t('message:validation-invalidKravDato'),
        skjemaelementId: 'a_buc_c_sedstart--kravDato-input-id'
      } as ErrorElement
    }
    return undefined
  }

  const performValidation = () :boolean => {
    const validation: Validation = {}
    validation.subjectArea = validateSubjectArea(_subjectArea)
    validation.buc = validateBuc(_buc)
    if (bucNeedsAvdod()) {
      validation.avdod = validateAvdod(_avdod)
    }
    if (bucNeedsAvdodButWeHaveNone()) {
      validation.avdodFnr = validateAvdodFnr(_avdodFnr)
    }
    if (bucNeedsKravDato(_buc)) {
      validation.kravDato = validateKravDato(_kravDato)
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onForwardButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setShowWarningBucDeceased(false)
    dispatch(cleanNewlyCreatedBuc())
    if (_buc === 'P_BUC_02' && pesysContext === constants.VEDTAKSKONTEKST && personAvdods && personAvdods.length === 0) {
      setShowWarningBucDeceased(true)
      return
    }
    const valid: boolean = performValidation()
    if (valid) {
      setIsCreatingBuc(true)
      const payload: NewBucPayload = {
        buc: _buc!,
        person: personPdl!
      }
      if (bucNeedsAvdod()) {
        payload.avdod = _avdod
      }
      if (bucNeedsAvdodButWeHaveNone() && _avdodFnr) {
        payload.avdodfnr = _avdodFnr
      }
      if (bucNeedsKravDato(_buc) && _kravDato) {
        // change 15-12-2020 to 2020-12-15
        payload.kravDato = _kravDato.split('-').reverse().join('-')
      }
      dispatch(createBuc(payload))
    }
  }

  const onCancelButtonClick = (): void => {
    dispatch(resetBuc())
    setBuc(bucParam)
    setKravDato('')
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
      if (bucNeedsKravDatoAndCanFetchIt(thisBuc)) {
        setKravDato('')
        dispatch(fetchKravDato({
          sakId,
          aktoerId,
          kravId
        }))
      }
      if (thisBuc === 'P_BUC_01' && sakType === SakTypeMap.UFOREP) {
        setShowWarningBuc01(true)
      } else {
        setShowWarningBuc01(false)
      }
      if (onBucChanged) {
        onBucChanged(option as Option)
      }
    }
  }

  const onTagsChange = (tagsList: unknown): void => {
    setTags(tagsList as Tags)
  }

  const onKravDatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKravDato = e.target.value
    updateValidation('kravDato', undefined)
    setKravDato(newKravDato)
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

  const tagObjectList: Array<Option> = tagList
    ? tagList.map(tag => {
        return {
          value: tag,
          label: t('buc:' + tag)
        } as Tag
      })
    : []

  const onAvdodChange = (option: unknown): void => {
    if (option) {
      const thisAvdod: PersonAvdod | undefined = _.find(personAvdods,
        (avdod: PersonAvdod) => {
          const id: string | undefined = avdod.fnr
          return id === (option as Option).value
        }
      )
      setAvdod(thisAvdod)
      updateValidation('avdod', validateAvdod(thisAvdod))
    }
  }

  const onAvdodFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const avdodFnr = e.target.value
    setAvdodFnr(avdodFnr)
    updateValidation('avdodFnr', validateAvdodFnr(avdodFnr))
  }

  const renderAvdodOptions = (personAvdods: PersonAvdods | undefined): Array<Option> => {
    return personAvdods?.map((avdod: PersonAvdod) => {
      const fnr: string | undefined = avdod.fnr
      return {
        label: avdod.fulltNavn + ' (' + fnr + ')',
        value: fnr!
      }
    }) || []
  }

  const avdodOptions: Array<Option> = renderAvdodOptions(personAvdods)

  useEffect(() => {
    if (bucOptions === undefined && !loading.gettingBucOptions) {
      dispatch(getBucOptions(featureToggles, pesysContext as PesysContext, sakType as SakTypeValue))
    }
  }, [bucOptions, dispatch, loading.gettingBucOptions, pesysContext, sakType])

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [dispatch, loading.gettingTagList, tagList])

  useEffect(() => {
    if (bucsThatSupportAvdod(_buc) &&
      pesysContext === constants.VEDTAKSKONTEKST &&
      personAvdods &&
      personAvdods.length === 1 &&
      !_avdod
    ) {
      setAvdod(personAvdods[0])
    }
  }, [_buc, _avdod, pesysContext, personAvdods])

  useEffect(() => {
    if (_isCreatingBuc && newlyCreatedBuc && !_isCreatingBucInfo) {
      const buc: Buc = bucs![currentBuc!]
      const payload: SaveBucsInfoProps = {
        aktoerId,
        bucsInfo,
        tags: _tags.map((t: Tag) => t.value),
        buc
      } as SaveBucsInfoProps
      if (bucNeedsAvdod() && _avdod) {
        payload.avdod = _avdod.fnr
      }
      if (bucNeedsKravDato(newlyCreatedBuc.type)) {
        payload.kravDato = _kravDato
      }
      dispatch(saveBucsInfo(payload))
      setIsCreatingBucInfo(true)
    }
  }, [aktoerId, _avdod, bucs, bucsInfo, currentBuc, dispatch, _isCreatingBuc, _isCreatingBucInfo, newlyCreatedBuc, _tags])

  useEffect(() => {
    if (_isCreatingBucInfo && newlyCreatedBuc && !loading.savingBucsInfo) {
      setBuc(undefined)
      setTags([])
      setIsCreatingBucInfo(false)
      setIsCreatingBuc(false)
      onBucCreated()
    }
  }, [_isCreatingBucInfo, newlyCreatedBuc, onBucCreated, loading.savingBucsInfo])

  useEffect(() => {
    if (kravDato) {
      const bucKravDato = kravDato.split('-').reverse().join('-')
      setKravDato(bucKravDato)
    }
  }, [kravDato])

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
            <>
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
            </>
          </Box>
          <Box paddingBlock="4 0">
            <>
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
            </>
          </Box>
          {bucNeedsAvdod() && (
            <>
              <Box paddingBlock="4 0">
                <label className='navds-text-field--label navds-label'>
                  {t('buc:form-chooseAvdod')}
                </label>
                <Select
                  data-testid='a_buc_c_BUCStart--avdod-select-id'
                  error={_validation.avdod ? t(_validation.avdod.feilmelding) : undefined}
                  id='a_buc_c_BUCStart--avdod-select-id'
                  isSearchable
                  menuPortalTarget={document.getElementById('main')}
                  onChange={onAvdodChange}
                  options={avdodOptions}
                  value={_.find(avdodOptions, (f: any) => _avdod?.fnr === f.value) || null}
                />
              </Box>
            </>
          )}
          {bucNeedsAvdodButWeHaveNone() && (
            <>
              <Box paddingBlock="4 0">
                <div className={styles.flexDiv}>
                  <Box
                    paddingInline="0 2"
                    width="100%"
                  >
                    <TextField
                      className='flex-2'
                      data-testid='a_buc_c_BUCStart--avdod-input-id'
                      id='a_buc_c_BUCStart--avdod-input-id'
                      label={t('buc:form-avdod')}
                      value={_avdodFnr}
                      onChange={onAvdodFnrChange}
                      description={t('buc:form-fnrdnr')}
                      error={_validation.avdodFnr ? t(_validation.avdodFnr.feilmelding) : undefined}
                    />
                  </Box>
                  <HelpText>
                    {t('message:help-avdodFnr')}
                  </HelpText>
                </div>
              </Box>
            </>
          )}
          {bucNeedsKravDato(_buc) && (
            <>
              <Box paddingBlock="4 0">
                <div className={styles.flexDiv}>
                  <TextField
                    data-testid='a_buc_c_BUCStart--kravDato-input-id'
                    id='a_buc_c_BUCStart--kravDato-input-id'
                    label={t('buc:form-kravDato') + '(' + t('buc:form-kravDatoPlaceholder') + ')'}
                    value={_kravDato}
                    onChange={onKravDatoChange}
                    error={_validation.kravDato ? t(_validation.kravDato.feilmelding) : undefined}
                  />
                  {loading.gettingKravDato
                    ? (
                      <>
                        <Box paddingInline="4 0">
                          <WaitingPanel size='xsmall' oneLine />
                        </Box>
                      </>
                      )
                    : undefined}
                </div>
              </Box>
            </>
          )}
        </Box>
        <Box
          paddingInline="2 0"
        >
          <Box paddingBlock="8 0">
            <MultipleSelect<Option>
              ariaLabel={t('buc:form-tagsForBUC')}
              aria-describedby='help-tags'
              data-testid='a_buc_c_BUCStart--tags-select-id'
              hideSelectedOptions={false}
              id='a_buc_c_BUCStart--tags-select-id'
              isLoading={loading.gettingTagList}
              label={(
                <>
                  <VStack gap="4">
                    <label className='navds-text-field--label navds-label'>
                      {t(loading.gettingTagList ? 'message:loading-tagList' : 'buc:form-tagsForBUC')}
                    </label>
                    <BodyLong>
                      {t('buc:form-tagsForBUC-description')}
                    </BodyLong>
                  </VStack>
                </>
                )}
              onSelect={onTagsChange}
              options={tagObjectList}
              menuPortalTarget={document.getElementById('main')}
              values={_tags}
            />
          </Box>
        </Box>
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
      {_showWarningBuc01 && (
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
                    {t('message:warning-P_BUC_01-uføretrygd')}
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
              disabled={_isCreatingBuc || _showWarningBuc01}
              onClick={onForwardButtonClick}
            >
              {_isCreatingBuc && <Loader />}
              {loading.creatingBUC
                ? t('message:loading-creatingCaseinRINA')
                : loading.savingBucsInfo
                  ? t('message:loading-savingBucInfo')
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

export default BUCStart
