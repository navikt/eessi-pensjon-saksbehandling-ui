import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'

import PsychoPanel from 'components/ui/Psycho/PsychoPanel'
import * as Nav from 'components/ui/Nav'
import countries from 'components/ui/CountrySelect/CountrySelectData'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import FlagList from 'components/ui/Flag/FlagList'
import FileUpload from 'components/ui/FileUpload/FileUpload'
import Icons from 'components/ui/Icons'

import * as bucActions from 'actions/buc'

export const mapStateToProps = (state) => {
  return {
    sedList: state.buc.sedList,
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
  const [_country, setCountry] = useState([])
  const [_institution, setInstitution] = useState([])
  const [_attachments, setAttachments] = useState([])
  const [validation, setValidation] = useState({})

  const { t, actions, sedList, countryList, institutionList, buc, locale, loading, layout = 'row' } = props

  const onForwardButtonClick = () => {
    validateSed(_sed)
    validateInstitution(_institution)
    if (hasNoValidationErrors()) {
      const data = {
        sed: _sed,
        institutions: _institution,
        country: _country,
        attachments: _attachments
      }
      actions.doSomethingWithSED(data)
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

  const validateInstitution = (institutions) => {
    if (_.isEmpty(institutions)) {
      setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
    } else {
      resetValidationState('institutionFail')
    }
  }

  const validateCountry = (country) => {
    if (_.isEmpty(country)) {
      setValidationState('countryFail', t('buc:validation-chooseCountry'))
    } else {
      resetValidationState('countryFail')
    }
  }

  const onCreateInstitution = (value) => {
    setInstitution(value)
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

  const onInstitutionChange = (institutions) => {
    setInstitution(institutions)
    validateInstitution(institutions)
  }

  const onCountryChange = (countryList) => {
    validateCountry(countryList)
    if (!validation.countryFail) {

      let oldCountryList = _.cloneDeep(countryList)
      setCountry(countryList)
      let addedCountries = countryList.filter(country => ! oldCountryList.includes(country))
      let removedCountries = oldCountryList.filter(country => ! countryList.includes(country))

      addedCountries.map(country => {
        actions.getInstitutionListForBucAndCountry(buc.type, country.value)
      })
      removedCountries.map(country => {
        actions.removeInstitutionForCountry(country.value)
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
    let description = t('buc:case-' + value.replace(':', '.'))
    if (description !== 'case-' + value) {
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
        placeholder={t(placeholders.country)}
        id='a-buc-SEDStart-country-select'
        className='multipleSelect'
        aria-describedby='help-country'
        locale={locale}
        value={_country || []}
        hideSelectedOptions={false}
        onChange={onCountryChange}
        optionList={countryObjectList} />
    </div>
  }

  const institutionObjectList = institutionList ? Object.keys(institutionList).map(landkode => {
    let label = _.find(countries[locale], {value: landkode})
    return {
      label: label.label,
      options: institutionList[landkode].map(institution => {
        return {
          label: institution.navn,
          value: institution
        }
      })
    }
  }): []

  const renderInstitution = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:institution')}</label>
      <MultipleSelect
        placeholder={t(placeholders.institution)}
        id='a-buc-SEDStart-institution-select'
        className='multipleSelect'
        aria-describedby='help-institution'
        locale={locale}
        value={_institution || []}
        onChange={onInstitutionChange}
        hideSelectedOptions={false}
        optionList={institutionObjectList} />
    </div>
  }

  const renderSed = () => {
    return <Nav.Select
      id='a-buc-SEDStart-sed-select'
      className='sedList flex-fill'
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
    return <div className='p-case-spinner ml-2'>
      <Nav.NavFrontendSpinner type='S' />
      <div className='float-right ml-2'>{t(text)}</div>
    </div>
  }

  const renderInstitutions = () => {

    let institutions = {}
    if (_institution) {
      _institution.map(institution => {
        if (!institutions.hasOwnProperty(institution.value.landkode)) {
          institutions[institution.value.landkode] = [institution.label]
        } else {
           institutions[institution.value.landkode].push(institution.label)
        }
      })
    }

    return <React.Fragment>
      <Nav.Ingress className='mb-2'>{t('buc:form-chosenInstitutions')}</Nav.Ingress>
      {!_.isEmpty(institutions) ? Object.keys(institutions).map(landkode => {
         return <div className='d-flex align-items-baseline'>
           <FlagList locale={locale} countries={[landkode]} overflowLimit={5} flagPath='../../../../flags/' extention='.png' />
           <span>{landkode}: {institutions[landkode].join(', ')}</span>
         </div>
      }) : <Nav.Normaltekst>{t('buc:form-noInstitutionYet')}</Nav.Normaltekst>}
    </React.Fragment>
  }

  const onFileChange = (files) => {
    setAttachments(files)
  }

  const renderAttachments = () => {
    return <Nav.Lesmerpanel intro={<div className='d-flex'>
      <Icons kind='tilsette'/>
      <span className='ml-3 mb-1'>{t('buc:form-addAttachmentsFromJOARK')}</span>
      </div>}>
        <FileUpload t={t}
         fileUploadDroppableId={'fileUpload'}
         className='fileUpload'
         files={_attachments}
         onFileChange={onFileChange} />
      </Nav.Lesmerpanel>
  }

  const allowedToForward = () => {
    return _sed && hasNoValidationErrors() && !_.isEmpty(_institution)
  }

  const validInstitution = (!validation.countryFail && !validation.institutionFail) && _country && _institution

  return <React.Fragment>
    <Nav.Row className='mb-3'>
      <div className={layout === 'row' ? 'col-md-6' : 'col-md-12'}>
        {renderSed()}
        {renderCountry()}
        {renderInstitution()}
      </div>
      <div className={layout === 'row' ? 'col-md-6' : 'col-md-12'}>
        {renderInstitutions()}
        {renderAttachments()}
        <div className='selectBoxMessage'>{!loading ? null
          : loading.sedList ? getSpinner('buc:loading-sed')
            : loading.institutionList ? getSpinner('buc:loading-institution')
              : loading.countryList ? getSpinner('buc:loading-country') : null}
        </div>
      </div>
      <div className='col-md-12'>
        <Nav.Hovedknapp
          id='a-buc-SEDStart-forward-button'
          className='forwardButton'
          disabled={!allowedToForward()}
          onClick={onForwardButtonClick}>{t('buc:form-orderSED')}</Nav.Hovedknapp>
        <Nav.Flatknapp
          id='a-buc-SEDStart-cancel'
          className='cancelButton'
          onClick={onCancelButtonClick}>{t('ui:cancel')}</Nav.Flatknapp>
      </div>
    </Nav.Row>
  </React.Fragment>
}

SEDStart.propTypes = {
  actions: PT.object,
  loading: PT.object,
  t: PT.func,
  institutionList: PT.object,
  countryList: PT.array,
  sedList: PT.array,
  buc: PT.string,
  locale: PT.string,
  layout: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SEDStart)
