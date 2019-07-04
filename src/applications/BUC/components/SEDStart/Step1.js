import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Flatknapp, Hovedknapp, NavFrontendSpinner, Row, Select, Undertittel } from 'components/ui/Nav'
import CountryData from 'components/ui/CountryData/CountryData'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import SEDAttachments from '../SEDAttachments/SEDAttachments'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'

const placeholders = {
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry'
}

const Step1 = (props) => {

  const [ _countries, setCountries ] = useState([])
  const [ _institutions, setInstitutions ] = useState([])
  const [ _attachments, setAttachments ] = useState({})
  const [ validation, setValidation ] = useState({})
  const [ sedSent, setSedSent ] = useState(false)
  const [ sendingAttachments, setSendingAttachments ] = useState(false)
  const [ attachmentsSent, setAttachmentsSent ] = useState(false)

  const { actions, aktoerId, attachments, buc, countryList, institutionList } = props
  const { layout = 'row', loading, locale, nextStep, sakId, sed, _sed, sedList, setSed, t } = props

  useEffect(() => {
    if (_.isEmpty(countryList) && !loading.gettingCountryList) {
      actions.getCountryList()
    }
  }, [actions, countryList, loading])

  useEffect(() => {
    if (_.isEmpty(sedList) && !loading.gettingSedList) {
      actions.getSedList(buc)
    }
  }, [actions, loading, sedList, buc])

  useEffect(() => {
    if (sed && !sedSent) {
      setSedSent(true)
    }
  }, [sed, sedSent])

  useEffect(() => {
    if (sedSent && !attachmentsSent) {
      if (!sendingAttachments) {
        setSendingAttachments(true)
        if (_.isEmpty(_attachments) || !_attachments.joark || _.isEmpty(_attachments.joark) ) {
          setAttachmentsSent(true)
          setSendingAttachments(false)
          return
        }
        _attachments.joark.forEach(attachment => {
          const params = {
            aktoerId: aktoerId,
            rinaId : buc.caseId,
            rinaDokumentId: sed.id,
            joarkJournalpostId: attachment.journalpostId,
            joarkDokumentInfoId: attachment.dokumentInfoId,
            variantFormat: attachment.variant,
          }
          console.log('sending ', params)
          actions.sendAttachmentToSed(params)
        })
        return
      }
      if (attachments && _attachments.joark.length === attachments.length) {
        setAttachmentsSent(true)
        setSendingAttachments(false)
        return
      }
    }
  }, [_attachments, actions, aktoerId, attachments, attachmentsSent, buc, sed, sedSent, sendingAttachments])

  useEffect(() => {
    if (sedSent && attachmentsSent) {
      actions.resetBuc()
      actions.fetchBucs(aktoerId)
      actions.fetchBucsInfo(aktoerId + '___BUC___INFO')
      actions.setMode('list')
    }
  }, [attachmentsSent, aktoerId, actions, sedSent])

  const convertInstitutionIDsToInstitutionObjects = () => {
    let institutions = []
    _institutions.forEach(item => {
      Object.keys(institutionList).forEach(landkode => {
        let found = _.find(institutionList[landkode], { id: item })
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

  const onForwardButtonClick = () => {
    validateSed(_sed)
    validateInstitutions(_institutions)
    if (hasNoValidationErrors()) {
      const institutions = convertInstitutionIDsToInstitutionObjects()
      actions.createSed({
        sakId: sakId,
        buc: buc.type,
        sed: _sed,
        institutions: institutions,
        aktoerId: aktoerId,
        euxCaseId: buc.caseId
      })
    }
  }

  const onNextButtonClick = () => {
    nextStep()
  }

  const onCancelButtonClick = () => {
    actions.resetBuc()
    actions.setMode('list')
  }

  const validateSed = (sed) => {
    if (!sed || sed === placeholders.sed) {
      setValidationState('sedFail', t('buc:validation-chooseSed'))
    } else {
      resetValidationState('sedFail')
    }
  }

  const validateInstitutions = (institutions) => {
    if (_.isEmpty(institutions)) {
      setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
    } else {
      resetValidationState('institutionFail')
    }
  }

  const validateCountries = (country) => {
    if (_.isEmpty(country)) {
      setValidationState('countryFail', t('buc:validation-chooseCountry'))
    } else {
      resetValidationState('countryFail')
    }
  }

  const resetValidationState = (_key) => {
    setValidation(_.omitBy(validation, (value, key) => {
      return key === _key
    }))
  }

  const hasNoValidationErrors = () => {
    return _.isEmpty(validation)
  }

  const setValidationState = (key, value) => {
    setValidation({
      ...validation,
      [key]: value
    })
  }

  const onSedChange = (e) => {
    const thisSed = e.target.value
    setSed(thisSed)
    validateSed(thisSed)
  }

  const onInstitutionsChange = (institutions) => {
    let newInstitutions = institutions ? institutions.map(item => {
      return item.value
    }) : []
    validateInstitutions(newInstitutions)
    setInstitutions(newInstitutions)
  }

  const onCountriesChange = (countries) => {
    let newCountries = countries ? countries.map(item => {
      return item.value
    }) : []
    validateCountries(newCountries)
    if (!validation.countryFail) {
      let oldCountriesList = _.cloneDeep(_countries)
      setCountries(newCountries)
      let addedCountries = newCountries.filter(country => !oldCountriesList.includes(country))
      let removedCountries = oldCountriesList.filter(country => !newCountries.includes(country))
      addedCountries.map(country => {
        return actions.getInstitutionsListForBucAndCountry(buc.type, country)
      })
      removedCountries.forEach(country => {
        const newInstitutions = _.cloneDeep(_institutions)
        setInstitutions(newInstitutions.filter(item => {
          var [ _country ] = item.split(':')
          return country !== _country
        }))
      })
    }
  }

  const renderOptions = (options, type) => {
    if (typeof options === 'string') {
      options = [options]
    }
    if (!options || Object.keys(options).length === 0) {
      options = [{
        key: placeholders[type],
        value: t(placeholders[type])
      }]
    }

    if (!options[0].key || (options[0].key && options[0].key !== placeholders[type])) {
      options.unshift({
        key: placeholders[type],
        value: t(placeholders[type])
      })
    }
    return options.map(el => {
      let key, value
      if (typeof el === 'string') {
        key = el
        value = el
      } else {
        key = el.key || el.navn
        value = el.value || el.navn
      }
      return <option value={key} key={key}>{getOptionLabel(value)}</option>
    })
  }

  const getOptionLabel = (value) => {
    let label = value
    let description = t('buc:buc-' + value.replace(':', '.'))
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const countryObjectList = countryList ? CountryData.filterByValueOnArray(locale, countryList) : []

  const countryValueList = _countries ? CountryData.filterByValueOnArray(locale, _countries) : []

  const renderCountry = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:country')}</label>
      <MultipleSelect
        className='a-buc-c-sedstart__country-select'
        id='a-buc-c-sedstart__country-select-id'
        placeholder={t(placeholders.country)}
        aria-describedby='help-country'
        locale={locale}
        values={countryValueList}
        hideSelectedOptions={false}
        onChange={onCountriesChange}
        optionList={countryObjectList} />
    </div>
  }

  let institutionObjectList = []
  if (institutionList) {
    Object.keys(institutionList).forEach(landkode => {
      if (_countries.indexOf(landkode) >= 0) {
        let label = CountryData.findByValue(locale, landkode)
        institutionObjectList.push({
          label: label.label,
          options: institutionList[landkode].map(institution => {
            return {
              label: institution.navn,
              value: institution.id
            }
          })
        })
      }
    })
  }

  let institutionValueList = []
  if (institutionList && _institutions) {
    institutionValueList = _institutions.map(item => {
      const [country ] = item.split(':')
      const found = _.find(institutionList[country], { id: item })
      return {
        label: found.navn,
        value: found.id
      }
    })
  }

  const renderInstitution = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:institution')}</label>
      <MultipleSelect
        className='a-buc-c-sedstart__institution-select'
        id='a-buc-c-sedstart__institution-select-id'
        placeholder={t(placeholders.institution)}
        aria-describedby='help-institution'
        locale={locale}
        values={institutionValueList}
        onChange={onInstitutionsChange}
        hideSelectedOptions={false}
        optionList={institutionObjectList} />
    </div>
  }

  const renderSed = () => {
    return <Select
      className='a-buc-c-sedstart__sed-select flex-fill'
      id='a-buc-c-sedstart__sed-select-id'
      placeholder={t(placeholders.institution)}
      aria-describedby='help-sed'
      bredde='fullbredde'
      feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
      label={t('buc:form-sed')}
      value={_sed || placeholders.buc}
      onChange={onSedChange}>
      {renderOptions(sedList, 'sed')}
    </Select>
  }

  const getSpinner = (text) => {
    return <div className='a-buc-c-sedstart__spinner ml-2'>
      <NavFrontendSpinner type='S' />
      <div className='float-right ml-2'>{t(text)}</div>
    </div>
  }

  const renderInstitutions = () => {
    return <React.Fragment>
      <Undertittel className='mb-2'>{t('buc:form-chosenInstitutions')}</Undertittel>
      <InstitutionList t={t} institutions={_institutions.map(item => {
        var [ country, institution ] = item.split(':')
        return {
          country: country,
          institution: institution
        }
      })} locale={locale} type='joined' />
    </React.Fragment>
  }

  const setFiles = (files) => {
    setAttachments(files)
  }

  const renderAttachments = () => {
    return <div className='mt-4'>
      <Undertittel className='mb-2'>{t('ui:attachments')}</Undertittel>
      {_attachments ? Object.keys(_attachments).map((key, index1) => {
        return _attachments[key].map((att, index2) => {
          return <div key={index1 + '-' + index2}>
            {t('ui:' + key)}: {att.tittel || att.name} ({att.variant})
          </div>
        })
      }) : null}
    </div>
  }

  const allowedToForward = () => {
    return _sed && hasNoValidationErrors() && !_.isEmpty(_institutions)
     && !loading.creatingSed && !sendingAttachments
  }

  const createSEDneedsMoreSteps = () => {
    return _sed === 'P4000'
  }

  return <Row className='a-buc-c-sedstart'>
    <div className={layout === 'row' ? 'col-md-4' : 'col-md-12'}>
      {renderSed()}
      {renderCountry()}
      {renderInstitution()}
      {renderInstitutions()}
      {renderAttachments()}
      <div className='selectBoxMessage'>{!loading ? null
        : loading.gettingSedList ? getSpinner('buc:loading-sed')
          : loading.institutionList ? getSpinner('buc:loading-institution')
            : loading.gettingCountryList ? getSpinner('buc:loading-country') : null}
      </div>
    </div>
    <div className={layout === 'row' ? 'col-md-8' : 'col-md-12'}>
      <SEDAttachments t={t} setFiles={setFiles} files={_attachments} />
    </div>
    <div className='col-md-12'>
      <Hovedknapp
        id='a-buc-c-sedstart__forward-button-id'
        className='a-buc-c-sedstart__forward-button'
        disabled={!allowedToForward()}
        spinner={loading.creatingSed || sendingAttachments}
        onClick={ createSEDneedsMoreSteps() ? onNextButtonClick : onForwardButtonClick }>
        {loading.creatingSed ? t('buc:loading-creatingSED') :
          sendingAttachments ? t('buc:loading-sendingSEDattachments') :
            createSEDneedsMoreSteps() ? t('ui:next') :
              t('buc:form-orderSED')}
      </Hovedknapp>
      <Flatknapp
        id='a-buc-c-sedstart__cancel-button-id'
        className='a-buc-c-sedstart__cancel-button'
        onClick={onCancelButtonClick}>{t('ui:cancel')}</Flatknapp>
    </div>
  </Row>
}

Step1.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string.isRequired,
  attachments: PT.array,
  buc: PT.object.isRequired,
  countryList: PT.array,
  institutionList: PT.object,
  layout: PT.string,
  loading: PT.object.isRequired,
  locale: PT.string.isRequired,
  sakId: PT.string.isRequired,
  sed: PT.object,
  _sed: PT.object,
  sedList: PT.array,
  setSed: PT.func.isRequired,
  t: PT.func.isRequired
}

export default Step1
