import {
  createReplySed,
  createSed,
  getCountryList, getInstitutionsListForBucAndCountry,
  getSedList,
  resetSed,
  resetSedAttachments,
  sendAttachmentToSed,
  setSedList
} from 'actions/buc'
import { getBucTypeLabel, sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDAttachments from 'applications/BUC/components/SEDAttachments/SEDAttachments'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import { BUCMode } from 'applications/BUC/index'
import Alert from 'components/Alert/Alert'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Select from 'components/Select/Select'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastHovedknapp, HighContrastInput,
  HorizontalSeparatorDiv, Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { IS_TEST } from 'constants/environment'
import {
  AttachedFiles,
  Buc,
  Bucs,
  InstitutionListMap,
  Institutions,
  RawInstitution,
  Sed, SedsWithAttachmentsMap,
  ValidBuc
} from 'declarations/buc'
import { AttachedFilesPropType, BucsPropType } from 'declarations/buc.pt'
import { JoarkFile, JoarkFiles } from 'declarations/joark'
import { State } from 'declarations/reducers'
import {
  AllowedLocaleString,
  Country,
  FeatureToggles,
  Loading,
  Option,
  PesysContext,
  Validation
} from 'declarations/types'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Input } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const SEDStartDiv = styled.div`
  display: flex;
  flex-direction: column;
`
const countrySort = (a: Country, b: Country) => a.label.localeCompare(b.label)

const FullWidthDiv = styled.div`
  width: 100%;
`
const AlertDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
const InstitutionsDiv = styled.div`
  & > div {
   margin-bottom: 0.35rem;
  }
`
export interface SEDStartProps {
  aktoerId?: string
  bucs: Bucs
  currentBuc: string
  initialAttachments ?: AttachedFiles
  initialSed ?: string | undefined
  onSedCreated: () => void
  onSedCancelled: () => void
  setMode: (mode: BUCMode, s: string, callback?: any) => void
}

export interface SEDStartSelector {
  attachments: AttachedFiles
  attachmentsError: boolean
  bucsInfoList: Array<string> | undefined
  countryList: Array<string> | undefined
  currentSed: string | undefined
  featureToggles: FeatureToggles
  highContrast: boolean
  institutionList: InstitutionListMap<RawInstitution> | undefined
  loading: Loading
  locale: AllowedLocaleString
  pesysContext: PesysContext | undefined,
  sakId?: string
  sed: Sed | undefined
  sedsWithAttachments: SedsWithAttachmentsMap
  sedList: Array<string> | undefined
  vedtakId: string | undefined
}

const mapState = /* istanbul ignore next */ (state: State): SEDStartSelector => ({
  attachments: state.buc.attachments,
  attachmentsError: state.buc.attachmentsError,
  bucsInfoList: state.buc.bucsInfoList,
  countryList: state.buc.countryList,
  currentSed: state.buc.currentSed,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  institutionList: state.buc.institutionList,
  loading: state.loading,
  locale: state.ui.locale,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sed: state.buc.sed,
  sedList: state.buc.sedList,
  sedsWithAttachments: state.buc.sedsWithAttachments,
  vedtakId: state.app.params.vedtakId
})

export const SEDStart: React.FC<SEDStartProps> = ({
  aktoerId, bucs, currentBuc, initialAttachments = {}, initialSed = undefined,
  onSedCreated, onSedCancelled, setMode
} : SEDStartProps): JSX.Element | null => {
  const {
    attachments, attachmentsError, bucsInfoList, currentSed, countryList,
    featureToggles, highContrast, institutionList, loading, locale, pesysContext,
    sakId, sed, sedsWithAttachments, sedList, vedtakId
  }: SEDStartSelector = useSelector<State, SEDStartSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const prefill: (prop: string) => Array<string> = (prop: string) => {
    const institutions: Array<any> = bucs[currentBuc!] && bucs[currentBuc!].institusjon
      ? bucs[currentBuc!]
        .seds!
        .filter(sedFilter)
        .map((sed: Sed) => {
          return sed.participants
            .filter(p => p.role === 'Sender')
            .map(p => {
              return _.get(p.organisation, prop)
            })
        })
      : []
    return Array.from(new Set(_.flatten(institutions))) // remove duplicates
  }

  const [_avdodfnr, setAvdodfnr] = /* istanbul ignore next */ useState<number | undefined>(undefined)
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [_institutions, setInstitutions] = useState<Array<string>>(
    featureToggles.SED_PREFILL_INSTITUTIONS ? prefill('id') : []
  )
  const [_countries, setCountries] = useState<Array<string>>(prefill('countryCode'))
  const [_vedtakId, setVedtakId] = /* istanbul ignore next */ useState<number | undefined>(vedtakId ? parseInt(vedtakId, 10) : undefined)
  const [_attachments, setAttachments] = useState<AttachedFiles>(initialAttachments)
  const [validation, setValidation] = useState<Validation>({})
  const [sedSent, setSedSent] = useState<boolean>(false)
  const [sendingAttachments, setSendingAttachments] = useState<boolean>(false)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const buc: Buc = _.cloneDeep(bucs[currentBuc!])
  const countryData = CountryData.getCountryInstance(locale)
  const [mounted, setMounted] = useState<boolean>(false)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState<boolean>(false)
  const countryObjectList = (!_.isEmpty(countryList) ? countryData.filterByValueOnArray(countryList).sort(countrySort) : [])
  const countryValueList = _countries ? countryData.filterByValueOnArray(_countries).sort(countrySort) : []
  const notHostInstitution = (institution: RawInstitution) => institution.id !== 'NO:DEMO001'
  const institutionObjectList: Array<{label: string, options: Array<Option>}> = []

  if (institutionList) {
    Object.keys(institutionList).forEach((landkode: string) => {
      if (_.includes(_countries, landkode)) {
        const label = countryData.findByValue(landkode)
        institutionObjectList.push({
          label: label.label,
          options: institutionList[landkode].filter(notHostInstitution).map((institution: RawInstitution) => {
            return {
              label: institution.navn,
              value: institution.id
            }
          })
        })
      }
    })
  }

  let institutionValueList: Array<Option> = []
  if (institutionList && _institutions) {
    institutionValueList = _institutions.map(item => {
      const [country, institution] = item.split(':')
      const found = _.find(institutionList[country], { id: item })
      if (found) {
        return {
          label: found.navn,
          value: found.id
        }
      } else {
        return {
          label: item,
          value: institution
        }
      }
    })
  }

  const resetValidationState = useCallback((_key: string): void => {
    setValidation(_.omitBy(validation, (value, key) => {
      return key === _key
    }))
  }, [setValidation, validation])

  const setValidationState = useCallback((key: string, value: string): void => {
    const newValidation = _.cloneDeep(validation)
    newValidation[key] = value
    setValidation(newValidation)
  }, [setValidation, validation])

  const validateCountries = useCallback((country: Array<string>): boolean => {
    if (_.isEmpty(country)) {
      setValidationState('countryFail', t('buc:validation-chooseCountry'))
      return false
    } else {
      resetValidationState('countryFail')
      return true
    }
  }, [resetValidationState, setValidationState, t])

  const fetchInstitutionsForSelectedCountries = useCallback(
    (countries: Array<Country>) => {
      if (!buc) {
        return
      }
      const newCountries: Array<string> = countries ? countries.map(item => {
        return item.value
      }) : []

      const oldCountriesList = _.cloneDeep(_countries)
      const addedCountries = newCountries.filter(country => !oldCountriesList.includes(country))
      const removedCountries = oldCountriesList.filter(country => !newCountries.includes(country))

      addedCountries.map(country => {
        return dispatch(getInstitutionsListForBucAndCountry(buc.type!, country))
      })
      removedCountries.forEach(country => {
        const newInstitutions = _institutions.filter(item => {
          const [_country] = item.split(':')
          return country !== _country
        })
        setInstitutions(newInstitutions)
      })
      setCountries(newCountries)
      validateCountries(newCountries)
    }, [_countries, dispatch, _institutions, buc, setCountries, setInstitutions, validateCountries])


  useEffect(() => {
    if (_.isEmpty(countryList) && buc && buc.type && !loading.gettingCountryList) {
      dispatch(getCountryList(buc.type))
    }
  }, [countryList, dispatch, loading, buc])

  useEffect(() => {
    if (!mounted) {
      if (!currentSed) {
        dispatch(getSedList(buc as ValidBuc))
      } else {
        dispatch(setSedList(
          bucs[currentBuc].seds!
            .filter(sed => sed.parentDocumentId === currentSed)
            .map(sed => sed.type)
        ))
      }
      setMounted(true)
    }
  }, [mounted, buc, bucs, currentBuc, currentSed, dispatch])

  useEffect(() => {
    // mark sed as sent
    if (sed && !sedSent) {
      setSedSent(true)
    }
  }, [sed, sedSent])

  useEffect(() => {
    // if sed is sent, we can start sending attachments
    if (sedSent && !attachmentsSent) {
      // no attachments to send - conclude
      if (_.isEmpty(_attachments) || !_attachments.joark || _.isEmpty(_attachments.joark)) {
        /* istanbul ignore next */ if (!IS_TEST) {
          console.log('SEDStart: No attachments to send, concluding')
        }
        setAttachmentsSent(true)
        return
      }
      // mark state as sending attachments
      setSendingAttachments(true)
      /* istanbul ignore next */ if (!IS_TEST) {
        console.log('SEDStart: Marking setSendingAttachments as true')
      }
    }
  }, [_attachments, attachmentsSent, sedSent])

  useEffect(() => {
    // cleanup after attachments sent
    if (sed && aktoerId && sedSent && attachmentsSent) {
      /* istanbul ignore next */ if (!IS_TEST) {
        console.log('SEDStart: Attachments sent, cleaning up')
      }
      dispatch(resetSed())
      setSed(undefined)
      dispatch(resetSedAttachments())
      onSedCreated()
    }
  }, [aktoerId, attachmentsSent, bucsInfoList, dispatch, pesysContext, onSedCreated, sedSent, sed, setMode, vedtakId])

  useEffect(() => {
    if (_.isArray(sedList) && sedList.length === 1 && !_sed) {
      setSed(sedList[0])
    }
  }, [sedList, _sed, setSed])

  useEffect(() => {
    if (!mounted && buc && buc.type !== null && !_.isEmpty(_countries)) {
      _countries.forEach(country => {
        if (!institutionList || !Object.keys(institutionList).includes(country)) {
          dispatch(getInstitutionsListForBucAndCountry(buc.type!, country))
        }
      })
      setMounted(true)
    }
  }, [mounted, buc, dispatch, fetchInstitutionsForSelectedCountries, institutionList, _countries])

  const validateSed = (sed: string): boolean => {
    if (!sed) {
      setValidationState('sedFail', t('buc:validation-chooseSed'))
      return false
    } else {
      resetValidationState('sedFail')
      return true
    }
  }

  const validateInstitutions = (institutions: Array<string>): boolean => {
    if (_.isEmpty(institutions)) {
      setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
      return false
    } else {
      resetValidationState('institutionFail')
      return true
    }
  }

  const validateVedtakId = (vedtakId: number | undefined): boolean => {
    if (sedNeedsVedtakId() && !_.isNumber(vedtakId)) {
      setValidationState('vedtakFail', t('buc:validation-chooseVedtakId'))
      return false
    } else {
      resetValidationState('vedtakFail')
      return true
    }
  }

  const validateAvdodfnr = (avdodfnr: number | undefined): boolean => {
    if (sedNeedsAvdodfnr() && !_.isNumber(avdodfnr)) {
      setValidationState('avdodfnrFail', t('buc:validation-chooseAvdodfnr'))
      return false
    } else {
      resetValidationState('avdodfnrFail')
      return true
    }
  }

  const onSedChange = (e: any) => {
    const thisSed = e.value
    setSed(thisSed)
    validateSed(thisSed)
  }

  const onInstitutionsChange = (institutions: Array<Option>) => {
    const newInstitutions = institutions ? institutions.map(institution => {
      return institution.value
    }) : []
    validateInstitutions(newInstitutions)
    setInstitutions(newInstitutions)
  }

  const onCountriesChange = (countries: Array<Country>) => {
    fetchInstitutionsForSelectedCountries(countries)
  }

  const onAvdodfnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let avdodfnr: number
    try {
      avdodfnr = parseInt(e.target.value, 10)
      validateAvdodfnr(avdodfnr)
      setAvdodfnr(avdodfnr)
    } catch (e) {}
  }

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let vedtakId: number
    try {
      vedtakId = parseInt(e.target.value, 10)
      validateVedtakId(vedtakId)
      setVedtakId(vedtakId)
    } catch (e) {}
  }

  const renderOptions = (options: Array<Option | string> | undefined) => {
    return options ? options.map((el: Option | string) => {
      let label, value
      if (typeof el === 'string') {
        label = el
        value = el
      } else {
        value = el.value || el.navn
        label = el.label || el.navn
      }
      return {
        label: getOptionLabel(label!),
        value: value
      }
    }) : []
  }

  const getOptionLabel = (value: string) => {
    let label = value
    const description = getBucTypeLabel({
      t: t,
      locale: locale,
      type: value
    })
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const getSpinner = (text: string) => {
    return (
      <WaitingPanel className='a-buc-c-sedstart__spinner' size='S' message={t(text)} oneLine />
    )
  }

  const setFiles = (files: AttachedFiles) => {
    standardLogger('sed.new.attachments.data', {
      numberOfJoarkAttachments: files.joark.length
    })
    setSeeAttachmentPanel(false)
    setAttachments(files)
  }

  const bucHasSedsWithAtLeastOneInstitution: Function = (): boolean => {
    if (buc.seds) {
      return _(buc.seds).find(sed => {
        return _.isArray(sed.participants) && !_.isEmpty(sed.participants)
      }) !== undefined
    }
    return false
  }

  const sedNeedsVedtakId = (): boolean => {
    return _sed === 'P6000' || _sed === 'P7000'
  }

  const sedNeedsAvdodfnr = (): boolean => {
    return _sed === 'P2100'
  }

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkFile): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const sedCanHaveAttachments = (): boolean => {
    return _sed !== undefined && sedsWithAttachments[_sed]
  }

  const convertInstitutionIDsToInstitutionObjects: Function = (): Institutions => {
    const institutions = [] as Institutions
    _institutions.forEach(item => {
      Object.keys(institutionList!).forEach((landkode: string) => {
        const found = _.find(institutionList![landkode], { id: item })
        if (found) {
          institutions.push({
            country: found.landkode,
            institution: found.id,
            name: found.navn
          })
        }
      })
    })
    return institutions
  }

  const onForwardButtonClick = (e: React.MouseEvent) => {
    if (_.isEmpty(validation)) {
      const institutions = convertInstitutionIDsToInstitutionObjects()
      const payload: any = {
        sakId: sakId,
        buc: buc.type,
        sed: _sed,
        institutions: institutions,
        aktoerId: aktoerId,
        euxCaseId: buc.caseId
      }

      if (sedNeedsVedtakId()) {
        payload.vedtakId = _vedtakId
      }
      if (sedNeedsAvdodfnr()) {
        payload.avdodfnr = _avdodfnr
      }
      if (currentSed) {
        dispatch(createReplySed(payload, currentSed))
      } else {
        dispatch(createSed(payload))
      }
      buttonLogger(e, payload)
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent) => {
    buttonLogger(e)
    setSed(undefined)
    dispatch(resetSed())
    onSedCancelled()
  }

  const allowedToForward = () => {
    return _sed && _.isEmpty(validation) &&
     (bucHasSedsWithAtLeastOneInstitution() || !_.isEmpty(_institutions)) &&
     !loading.creatingSed && !sendingAttachments &&
     (sedNeedsVedtakId() ? _.isNumber(_vedtakId) && !_.isNaN(_vedtakId) : true) &&
     (sedNeedsAvdodfnr() ? _.isNumber(_avdodfnr) && !_.isNaN(_avdodfnr) : true)
  }

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  return (
    <SEDStartDiv>
      <Systemtittel>
        {!currentSed ? t('buc:step-startSEDTitle', {
          buc: t(`buc:buc-${buc?.type}`),
          sed: _sed || t('buc:form-newSed')
        }) : t('buc:step-replySEDTitle', {
          buc: t(`buc:buc-${buc?.type}`),
          sed: buc.seds!.find((sed: Sed) => sed.id === currentSed)!.type
        })}
      </Systemtittel>
      <hr />
      {!vedtakId && _sed === 'P6000' && (
        <FullWidthDiv>
          <AlertDiv>
            <Alert type='client' fixed={false} status='WARNING' message={t('buc:alert-noVedtakId')} />
          </AlertDiv>
        </FullWidthDiv>
      )}
      <Row>
        <Column>
          <VerticalSeparatorDiv data-size='2' />
          <>
            <label className='skjemaelement__label'>
              {t('buc:form-sed')}
            </label>
            <Select
              highContrast={highContrast}
              data-testid='a-buc-c-sedstart__sed-select-id'
              disabled={loading.gettingSedList}
              isSearchable
              placeholder={t('buc:form-chooseSed')}
              onChange={onSedChange}
              options={renderOptions(sedList)}
            />

            {validation.sedFail && <Normaltekst>{t(validation.sedFail)}</Normaltekst>}
          </>
          <VerticalSeparatorDiv />
          {sedNeedsVedtakId() && (
            <>
              <VerticalSeparatorDiv />
              <Input
                disabled
                data-testid='a-buc-c-sedstart__vedtakid-input-id'
                label={t('buc:form-vedtakId')}
                bredde='fullbredde'
                value={vedtakId || ''}
                onChange={onVedtakIdChange}
                placeholder={t('buc:form-noVedtakId')}
                feil={validation.vedtakFail ? t(validation.vedtakFail) : null}
              />
              <VerticalSeparatorDiv />
            </>
          )}
          {sedNeedsAvdodfnr() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                id='a-buc-c-sedstart__fnr-input-id'
                label={t('buc:form-fnr')}
                bredde='fullbredde'
                value={_avdodfnr || ''}
                onChange={onAvdodfnrChange}
                placeholder={t('buc:form-noAvdodfnr')}
                feil={validation.fnrFail ? t(validation.fnrFail) : null}
              />
              <VerticalSeparatorDiv />
            </>
          )}
          {!currentSed && (
            <>
              <VerticalSeparatorDiv />
              <MultipleSelect
                highContrast={highContrast}
                ariaLabel={t('ui:country')}
                label={t('ui:country')}
                data-testid='a-buc-c-sedstart__country-select-id'
                disabled={loading.gettingCountryList}
                isLoading={loading.gettingCountryList}
                placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t('buc:form-chooseCountry')}
                aria-describedby='help-country'
                values={countryValueList}
                hideSelectedOptions={false}
                onSelect={onCountriesChange}
                options={countryObjectList}
              />
              <VerticalSeparatorDiv />
              <MultipleSelect
                highContrast={highContrast}
                ariaLabel={t('ui:institution')}
                label={t('ui:institution')}
                data-testid='a-buc-c-sedstart__institution-select-id'
                disabled={loading.gettingInstitutionList}
                isLoading={loading.gettingInstitutionList}
                placeholder={loading.gettingInstitutionList ? getSpinner('buc:loading-institution') : t('buc:form-chooseInstitution')}
                aria-describedby='help-institution'
                values={institutionValueList}
                onSelect={onInstitutionsChange}
                hideSelectedOptions={false}
                options={institutionObjectList}
              />
              <VerticalSeparatorDiv data-size='2' />
              <label className='skjemaelement__label'>
                {t('buc:form-chosenInstitutions')}
              </label>
              <VerticalSeparatorDiv />
              <InstitutionsDiv>
                <InstitutionList
                  institutions={_institutions.map(item => {
                    var [country, institution] = item.split(':')
                    return {
                      country: country,
                      institution: institution
                    }
                  })}
                  locale={locale}
                  type='joined'
                />
              </InstitutionsDiv>
            </>
          )}
          {sedCanHaveAttachments() && (
            <>
              <VerticalSeparatorDiv />
              <label className='skjemaelement__label'>
                {t('ui:attachments')}
              </label>
              <VerticalSeparatorDiv data-size='0.5' />
              <SEDAttachmentsTable highContrast={highContrast} attachments={_attachments} />
            </>
          )}
          <Column>
            {(sendingAttachments || attachmentsSent) && sed && (
              <SEDAttachmentSender
                attachmentsError={attachmentsError}
                sendAttachmentToSed={_sendAttachmentToSed}
                payload={{
                  aktoerId: aktoerId,
                  rinaId: buc.caseId,
                  rinaDokumentId: sed!.id
                } as SEDAttachmentPayload}
                allAttachments={_attachments.joark as JoarkFiles}
                savedAttachments={attachments.joark as JoarkFiles}
                onFinished={() => setAttachmentsSent(true)}
              />
            )}
          </Column>
          <Column>
            <VerticalSeparatorDiv data-size='1.5'/>
            <HighContrastHovedknapp
              data-amplitude='sed.new.create'
              data-testid='a-buc-c-sedstart__forward-button-id'
              disabled={!allowedToForward()}
              spinner={loading.creatingSed || sendingAttachments}
              onClick={onForwardButtonClick}

            >
              {loading.creatingSed ? t('buc:loading-creatingSED')
                : sendingAttachments ? t('buc:loading-sendingSEDattachments')
                  : t('buc:form-orderSED')}
            </HighContrastHovedknapp>
            <HorizontalSeparatorDiv/>
            <HighContrastFlatknapp
              data-amplitude='sed.new.cancel'
              data-testid='a-buc-c-sedstart__cancel-button-id'
              onClick={onCancelButtonClick}
            >
              {t('ui:cancel')}
            </HighContrastFlatknapp>
            <VerticalSeparatorDiv data-size='1.5'/>
          </Column>
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          {sedCanHaveAttachments() && (
            <>
              <VerticalSeparatorDiv data-size='2' />
              <label className='skjemaelement__label'>
                {t('ui:attachments')}
              </label>
              <VerticalSeparatorDiv />
              <SEDAttachments
                disableButtons={false}
                highContrast={highContrast}
                onSubmit={setFiles}
                files={_attachments}
                open={seeAttachmentPanel}
                onOpen={() => setSeeAttachmentPanel(true)}
              />
            </>
          )}
        </Column>
      </Row>
    </SEDStartDiv>
  )
}

SEDStart.propTypes = {
  aktoerId: PT.string.isRequired,
  bucs: BucsPropType.isRequired,
  initialAttachments: AttachedFilesPropType,
  onSedCreated: PT.func.isRequired,
  onSedCancelled: PT.func.isRequired,
  setMode: PT.func.isRequired
}

export default SEDStart
