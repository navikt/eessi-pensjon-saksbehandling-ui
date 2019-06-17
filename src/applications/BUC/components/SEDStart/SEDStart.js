import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'

import * as Nav from 'components/ui/Nav'
import countries from 'components/ui/CountrySelect/CountrySelectData'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import FlagList from 'components/ui/Flag/FlagList'
import SEDAttachments from '../SEDAttachments/SEDAttachments'

import * as bucActions from 'actions/buc'

export const mapStateToProps = (state) => {
  return {
    buc: state.buc.buc,
    sedList: state.buc.sedList,
    sed: state.buc.sed,
    countryList: state.buc.countryList,
    institutionList: state.buc.institutionList,
    loading: state.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(bucActions, dispatch) }
}

const placeholders = {
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry'
}

const SEDStart = (props) => {
  const [_sed, setSed] = useState(undefined)
  const [_countries, setCountries] = useState([])
  const [_institutions, setInstitutions] = useState([])
  const [_attachments, setAttachments] = useState({})
  const [validation, setValidation] = useState({})

  const { t, sakId, actions, sedList, countryList, institutionList, aktoerId, buc, sed, locale, loading, layout = 'row' } = props

  useEffect(() => {
    if (_.isEmpty(countryList) && !loading.gettingCountryList) {
      actions.getCountryList()
    }
    if (_.isEmpty(sedList) && !loading.gettingSedList) {
      actions.getSedList(buc)
    }
  }, [actions, loading, countryList, sedList, buc])

  // when sed is successfully created
  useEffect(() => {
    if (sed) {
      actions.resetSed()
      actions.fetchBucs(aktoerId)
      actions.fetchBucsInfo(aktoerId)
      actions.setMode('list')
    }
  }, [sed, aktoerId, actions])

  const onForwardButtonClick = () => {
    validateSed(_sed)
    validateInstitutions(_institutions)
    if (hasNoValidationErrors()) {
      // convert institution ids to proper institution objects
      let institutions = []
      _institutions.forEach(item => {
        Object.keys(institutionList).forEach(landkode => {
          let found = _.find(institutionList[landkode], { id: item })
          if (found) {
            institutions.push({
              country: found.landkode,
              institution: found.akronym,
              name: found.navn
            })
          }
        })
      })

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

  const onCancelButtonClick = () => {
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
    let newInstitutions = institutions.map(item => {
      return item.value
    })
    validateInstitutions(newInstitutions)
    setInstitutions(newInstitutions)
  }

  const onCountriesChange = (countryList) => {
    let newCountries = countryList.map(item => {
      return item.value
    })
    validateCountries(newCountries)
    if (!validation.countryFail) {
      let oldCountriesList = _.cloneDeep(_countries)
      setCountries(newCountries)
      let addedCountries = newCountries.filter(country => !oldCountriesList.includes(country))
      let removedCountries = oldCountriesList.filter(country => !newCountries.includes(country))
      addedCountries.map(country => {
        return actions.getInstitutionsListForBucAndCountry(buc.type, country)
      })
      removedCountries.map(country => {
        return actions.removeInstitutionForCountry(country)
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

  const countryObjectList = countryList ? _.filter(countries[locale], it => {
    return countryList.indexOf(it.value) >= 0
  }) : []

  const renderCountry = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:country')}</label>
      <MultipleSelect
        className='a-buc-c-sedstart__country-select'
        id='a-buc-c-sedstart__country-select-id'
        placeholder={t(placeholders.country)}
        aria-describedby='help-country'
        locale={locale}
        value={_countries || []}
        hideSelectedOptions={false}
        onChange={onCountriesChange}
        optionList={countryObjectList} />
    </div>
  }

  const institutionObjectList = institutionList ? Object.keys(institutionList).map(landkode => {
    let label = _.find(countries[locale], { value: landkode })
    return {
      label: label.label,
      options: institutionList[landkode].map(institution => {
        return {
          label: institution.navn,
          value: institution.id
        }
      })
    }
  }) : []

  const renderInstitution = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:institution')}</label>
      <MultipleSelect
        className='a-buc-c-sedstart__institution-select'
        id='a-buc-c-sedstart__institution-select-id'
        placeholder={t(placeholders.institution)}
        aria-describedby='help-institution'
        locale={locale}
        value={_institutions || []}
        onChange={onInstitutionsChange}
        hideSelectedOptions={false}
        optionList={institutionObjectList} />
    </div>
  }

  const renderSed = () => {
    return <Nav.Select
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
    </Nav.Select>
  }

  const getSpinner = (text) => {
    return <div className='a-buc-c-sedstart__spinner ml-2'>
      <Nav.NavFrontendSpinner type='S' />
      <div className='float-right ml-2'>{t(text)}</div>
    </div>
  }

  const renderInstitutions = () => {
    let institutions = {}
    if (_institutions) {
      _institutions.forEach(item => {
        Object.keys(institutionList).forEach(landkode => {
          let found = _.find(institutionList[landkode], { id: item })
          if (found) {
            if (!institutions.hasOwnProperty(landkode)) {
              institutions[landkode] = [found.navn]
            } else {
              institutions[landkode].push(found.navn)
            }
          }
        })
      })
    }

    return <React.Fragment>
      <Nav.Ingress className='mb-2'>{t('buc:form-chosenInstitutions')}</Nav.Ingress>
      {!_.isEmpty(institutions) ? Object.keys(institutions).map((landkode, index) => {
        let institutionLabel = institutions[landkode].join(', ')
        return <div key={index} className='d-flex align-items-baseline'>
          <FlagList locale={locale} items={[{ country: landkode, label: institutionLabel }]} overflowLimit={5} />
          <span>{landkode}: {institutionLabel}</span>
        </div>
      }) : <Nav.Normaltekst>{t('buc:form-noInstitutionYet')}</Nav.Normaltekst>}
    </React.Fragment>
  }

  const setFiles = (files) => {
    setAttachments(files)
  }

  const renderAttachments = () => {
    return <div className='mt-4'>
      <Nav.Ingress className='mb-2'>{t('ui:attachments')}</Nav.Ingress>
      {_attachments ? Object.keys(_attachments).map((key, index1) => {
        return _attachments[key].map((att, index2) => {
          return <div key={index1 + '-' + index2}>{key}: {att}</div>
        })
      }) : null}
    </div>
  }

  const allowedToForward = () => {
    return _sed && hasNoValidationErrors() && !_.isEmpty(_institutions) && !loading.creatingSed
  }

  return <Nav.Row className='a-buc-c-sedstart'>
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
      <div>
        <Nav.Hovedknapp
          id='a-buc-c-sedstart__forward-button-id'
          className='a-buc-c-sedstart__forward-button'
          disabled={!allowedToForward()}
          spinner={loading.creatingSed}
          onClick={onForwardButtonClick}>
          {loading.creatingSed ? t('buc:loading-creatingSED') : t('buc:form-orderSED')}
        </Nav.Hovedknapp>
        <Nav.Flatknapp
          id='a-buc-c-sedstart__cancel-button-id'
          className='a-buc-c-sedstart__cancel-button'
          onClick={onCancelButtonClick}>{t('ui:cancel')}</Nav.Flatknapp>
      </div>
    </div>
    <div className={layout === 'row' ? 'col-md-8' : 'col-md-12'}>
      <SEDAttachments t={t} setFiles={setFiles} files={_attachments} />
    </div>
  </Nav.Row>
}

SEDStart.propTypes = {
  actions: PT.object,
  loading: PT.object,
  t: PT.func,
  institutionList: PT.object,
  countryList: PT.array,
  sedList: PT.array,
  buc: PT.object,
  locale: PT.string,
  layout: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SEDStart)
