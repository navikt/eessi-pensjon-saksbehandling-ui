import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { NavFrontendSpinner, Select, Systemtittel, Undertittel } from 'components/ui/Nav'
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
  const { actions, _attachments, buc, _countries, countryList, _institutions, institutionList } = props
  const { layout = 'row', loading, locale, _sed, setAttachments, setCountries, setInstitutions } = props
  const { sedList, setSed, setValidation, t, validation } = props

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

  const getSpinner = (text) => {
    return <div className='a-buc-c-sedstart__spinner ml-2'>
      <NavFrontendSpinner type='S' />
      <div className='float-right ml-2'>{t(text)}</div>
    </div>
  }

  const setFiles = (files) => {
    setAttachments(files)
  }

  return <React.Fragment>
    <div className='col-md-12'>
      <Systemtittel>{t('buc:step-startSEDTitle', {
        buc: t(`buc:buc-${buc.type}`),
        sed: _sed || t('buc:form-newSed')
      })}</Systemtittel>
      <hr />
    </div>
    <div className={layout === 'row' ? 'col-md-4' : 'col-md-12'}>
      <Select
        className='a-buc-c-sedstart__sed-select flex-fill'
        id='a-buc-c-sedstart__sed-select-id'
        placeholder={t(placeholders.institution)}
        aria-describedby='help-sed'
        bredde='fullbredde'
        feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
        label={t('buc:form-sed')}
        value={_sed || placeholders.sed}
        onChange={onSedChange}>
        {renderOptions(sedList, 'sed')}
      </Select>
      <div className='mb-3 flex-fill'>
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
      <div className='mb-3 flex-fill'>
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
      <Undertittel className='mb-2'>{t('buc:form-chosenInstitutions')}</Undertittel>
      <InstitutionList t={t} institutions={_institutions.map(item => {
        var [ country, institution ] = item.split(':')
        return {
          country: country,
          institution: institution
        }
      })} locale={locale} type='joined' />
      <div className='mt-4'>
        <Undertittel className='mb-2'>{t('ui:attachments')}</Undertittel>
        {_attachments ? Object.keys(_attachments).map((key, index1) => {
          return _attachments[key].map((att, index2) => {
            return <div key={index1 + '-' + index2}>
              {t('ui:' + key)}: {att.tittel || att.name} ({att.variant})
            </div>
          })
        }) : null}
      </div>
      <div className='selectBoxMessage'>{!loading ? null
        : loading.gettingSedList ? getSpinner('buc:loading-sed')
          : loading.institutionList ? getSpinner('buc:loading-institution')
            : loading.gettingCountryList ? getSpinner('buc:loading-country') : null}
      </div>
    </div>
    <div className={layout === 'row' ? 'col-md-8' : 'col-md-12'}>
      <SEDAttachments t={t} setFiles={setFiles} files={_attachments} />
    </div>
  </React.Fragment>
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
  _sed: PT.string,
  sedList: PT.array,
  setSed: PT.func.isRequired,
  t: PT.func.isRequired
}

export default Step1
