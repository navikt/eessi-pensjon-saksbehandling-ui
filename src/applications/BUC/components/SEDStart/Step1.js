import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { CountryData, Nav, MultipleSelect, WaitingPanel } from 'eessi-pensjon-ui'
import SEDAttachments from 'applications/BUC/components/SEDAttachments/SEDAttachments'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'

const placeholders = {
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry',
  vedtakId: 'buc:form-enterVedtakId'
}

const Step1 = ({
  actions, _attachments, buc, _countries, countryList, currentSed, _institutions, institutionList, institutionNames,
  layout = 'row', loading, locale, _sed, sedCanHaveAttachments, setAttachments, setCountries, setInstitutions,
  sedList, sedNeedsVedtakId, setSed, setValidation, setVedtakId, t, validation, vedtakId
}) => {
  const countryData = CountryData.getCountryInstance(locale)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState(false)
  const countryObjectList = (countryList ? countryData.filterByValueOnArray(countryList) : [])
  const countryValueList = _countries ? countryData.filterByValueOnArray(_countries) : []
  const notHostInstitution = institution => institution.id !== 'NO:DEMO001'
  const institutionObjectList = []
  if (institutionList) {
    Object.keys(institutionList).forEach(landkode => {
      if (_countries.indexOf(landkode) >= 0) {
        const label = countryData.findByValue(landkode)
        institutionObjectList.push({
          label: label.label,
          options: institutionList[landkode].filter(notHostInstitution).map(institution => {
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

  useEffect(() => {
    if (_.isArray(sedList) && sedList.length === 1 && !_sed) {
      setSed(sedList[0])
    }
  }, [sedList, _sed, setSed])

  const validateSed = (sed) => {
    if (!sed || sed === placeholders.sed) {
      setValidationState('sedFail', t('buc:validation-chooseSed'))
      return false
    } else {
      resetValidationState('sedFail')
      return true
    }
  }

  const validateInstitutions = (institutions) => {
    if (_.isEmpty(institutions)) {
      setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
      return false
    } else {
      resetValidationState('institutionFail')
      return true
    }
  }

  const validateCountries = (country) => {
    if (_.isEmpty(country)) {
      setValidationState('countryFail', t('buc:validation-chooseCountry'))
      return false
    } else {
      resetValidationState('countryFail')
      return true
    }
  }

  const validateVedtakId = (vedtakId) => {
    if (sedNeedsVedtakId() && !_.isNumber(vedtakId)) {
      setValidationState('vedtakFail', t('buc:validation-chooseVedtakId'))
      return false
    } else {
      resetValidationState('vedtakFail')
      return true
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
    const newInstitutions = institutions ? institutions.map(item => {
      return item.value
    }) : []
    validateInstitutions(newInstitutions)
    setInstitutions(newInstitutions)
  }

  const onCountriesChange = (countries) => {
    const newCountries = countries ? countries.map(item => {
      return item.value
    }) : []
    const oldCountriesList = _.cloneDeep(_countries)
    const addedCountries = newCountries.filter(country => !oldCountriesList.includes(country))
    const removedCountries = oldCountriesList.filter(country => !newCountries.includes(country))
    addedCountries.map(country => {
      return actions.getInstitutionsListForBucAndCountry(buc.type, country)
    })
    removedCountries.forEach(country => {
      const newInstitutions = _institutions.filter(item => {
        var [_country] = item.split(':')
        return country !== _country
      })
      setInstitutions(newInstitutions)
    })
    setCountries(newCountries)
    validateCountries(newCountries)
  }

  const onVedtakIdChange = (e) => {
    let vedtakId
    try {
      vedtakId = parseInt(e.target.value, 10)
    } catch (e) {}
    validateVedtakId(vedtakId)
    setVedtakId(vedtakId)
  }

  const renderOptions = (options, type) => {
    let _options = [{
      key: placeholders[type],
      value: t(placeholders[type])
    }]

    if (_.isString(options)) {
      _options = [..._options, options]
    } else if (_.isArray(options)) {
      _options = [..._options, ...options]
    }

    return _options.map(el => {
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

  const getSpinner = (text) => {
    return (
      <WaitingPanel className='a-buc-c-sedstart__spinner' size='S' message={t(text)} />
    )
  }

  const setFiles = (files) => {
    setSeeAttachmentPanel(false)
    setAttachments(files)
  }

  return (
    <div className='a-buc-sedstart-step1 w-100'>
      <div className='col-md-12'>
        <Nav.Systemtittel>{
          !currentSed
            ? t('buc:step-startSEDTitle', {
              buc: t(`buc:buc-${buc.type}`),
              sed: _sed || t('buc:form-newSed')
            })
            : t('buc:step-replySEDTitle', {
              buc: t(`buc:buc-${buc.type}`),
              sed: buc.seds.find(sed => sed.id === currentSed).type
            })
        }
        </Nav.Systemtittel>
        <hr />
      </div>
      <div className={layout === 'row' ? 'col-md-6 pr-3' : 'col-md-12'}>
        <Nav.Select
          className='a-buc-c-sedstart__sed-select flex-fill'
          id='a-buc-c-sedstart__sed-select-id'
          disabled={loading.gettingSedList}
          aria-describedby='help-sed'
          bredde='fullbredde'
          feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
          label={t('buc:form-sed')}
          value={_sed || placeholders.sed}
          onChange={onSedChange}
        >
          {!loading.gettingSedList
            ? renderOptions(sedList, 'sed')
            : <option>{t('buc:loading-sed')}</option>}
        </Nav.Select>
        {sedNeedsVedtakId() ? (
          <div className='mb-3'>
            <Nav.Input
              id='a-buc-c-sedstart__vedtakid-input-id'
              className='a-buc-c-sedstart__vedtakid-input'
              label={t('buc:form-vedtakId')}
              bredde='fullbredde'
              value={vedtakId || ''}
              onChange={onVedtakIdChange}
              placeholder={t(placeholders.vedtakId)}
              feil={validation.vedtakFail ? { feilmelding: t(validation.vedtakFail) } : null}
            />
          </div>
        ) : null}
        {!currentSed
          ? (
            <>
              <div className='mb-3 flex-fill'>
                <MultipleSelect
                  ariaLabel={t('ui:country')}
                  label={t('ui:country')}
                  className='a-buc-c-sedstart__country-select'
                  id='a-buc-c-sedstart__country-select-id'
                  disabled={loading.gettingCountryList}
                  placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t(placeholders.country)}
                  aria-describedby='help-country'
                  values={countryValueList}
                  hideSelectedOptions={false}
                  onSelect={onCountriesChange}
                  options={countryObjectList}
                />
              </div>
              <div className='mb-3 flex-fill'>
                <MultipleSelect
                  ariaLabel={t('ui:institution')}
                  label={t('ui:institution')}
                  className='a-buc-c-sedstart__institution-select'
                  id='a-buc-c-sedstart__institution-select-id'
                  disabled={loading.institutionList}
                  placeholder={loading.institutionList ? getSpinner('buc:loading-institution') : t(placeholders.institution)}
                  aria-describedby='help-institution'
                  values={institutionValueList}
                  onSelect={onInstitutionsChange}
                  hideSelectedOptions={false}
                  options={institutionObjectList}
                />
              </div>
              <Nav.Undertittel className='mb-2'>{t('buc:form-chosenInstitutions')}</Nav.Undertittel>
              <InstitutionList
                t={t}
                institutionNames={institutionNames}
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
            </>
          ) : null}
        {sedCanHaveAttachments() ? (
          <div className='mt-4'>
            <Nav.Undertittel className='mb-2'>{t('ui:attachments')}</Nav.Undertittel>
            <SEDAttachmentsTable attachments={_attachments} t={t} />
          </div>
        ) : null}
      </div>
      {sedCanHaveAttachments() ? (
        <div className={layout === 'row' ? 'col-md-6' : 'col-md-12'}>
          <Nav.Undertittel className='mb-3'>
            {t('ui:attachments')}
          </Nav.Undertittel>
          <SEDAttachments
            t={t}
            onSubmit={setFiles}
            files={_attachments}
            open={seeAttachmentPanel}
            onOpen={() => setSeeAttachmentPanel(true)}
          />
        </div>
      ) : null}
    </div>
  )
}

Step1.propTypes = {
  actions: PT.object.isRequired,
  _attachments: PT.object,
  buc: PT.object.isRequired,
  countryList: PT.array,
  institutionList: PT.object,
  institutionNames: PT.object,
  layout: PT.string,
  loading: PT.object.isRequired,
  locale: PT.string.isRequired,
  sed: PT.object,
  _sed: PT.string,
  sedList: PT.array,
  setSed: PT.func.isRequired,
  t: PT.func.isRequired
}

export default Step1
