import React from 'react'
import { createStore, combineReducers } from 'redux'
import Period from './Period'
import _ from 'lodash'
import MD5 from 'md5.js'

import * as reducers from '../../../reducers'

const initialState = {
  app: {
    username: '12345678910'
  }
}

const reducer = combineReducers({
  ...reducers
})

describe('Period', () => {
  let store, wrapper

  beforeEach(() => {
    store = createStore(reducer, initialState)
    wrapper = shallow(<Period editPeriod={() => {}} store={store} />).dive()
  })

  it('renders successfully', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('hasNoErrors() function', () => {
    expect(wrapper.instance().hasNoErrors({ foo: 'bar' })).toEqual(false)
    expect(wrapper.instance().hasNoErrors({})).toEqual(true)
  })

  it('hasSpecialCases function', () => {
    let francePeriods = [{
      type: 'foo',
      country: { value: 'FR', label: 'Frankrike' }
    }]
    let norwayPeriods = [{
      type: 'foo',
      country: { value: 'NO', label: 'Norge' }
    }]
    expect(wrapper.instance().hasSpecialCases(francePeriods)).toEqual(true)
    expect(wrapper.instance().hasSpecialCases(norwayPeriods)).toEqual(false)
  })

  it('isASpecialCase function', () => {
    let francePeriod = {
      type: 'foo',
      country: { value: 'FR', label: 'Frankrike' }
    }
    let spainPeriod = {
      type: 'foo',
      country: { value: 'ES', label: 'Spania' }
    }
    let norwayPeriod = {
      type: 'foo',
      country: { value: 'NO', label: 'Norge' }
    }
    expect(wrapper.instance().isASpecialCase(francePeriod)).toEqual(true)
    expect(wrapper.instance().isASpecialCase(spainPeriod)).toEqual(true)
    expect(wrapper.instance().isASpecialCase(norwayPeriod)).toEqual(false)
  })

  it('setAttachments function', () => {
    let file = {
      type: 'application/pdf',
      name: 'test.pdf',
      size: 123,
      content: {
        base64: 'base64,qwerty'
      }
    }

    let mockFiles = [_.cloneDeep(file)]

    let md5Hash = new MD5().update('base64,qwerty').digest('hex')

    let mockLocalFile = [{
      ...file,
      content: {
        md5: md5Hash
      }
    }]

    wrapper.instance().setAttachments(mockFiles)

    expect(wrapper.instance().state._period.attachments).toEqual(mockLocalFile)
    expect(store.getState().attachment[md5Hash]).toEqual(file)
  })

  it('eventSetType function', () => {
    let mockValue = 'mockValue'
    wrapper.instance().eventSetType(null, { target: { value: mockValue } })
    expect(wrapper.instance().state._period.type).toEqual(mockValue)
  })

  it('eventSetPerson function', () => {
    let mockKey = 'mockKey'
    let mockValue = 'mockValue'
    wrapper.instance().eventSetPerson(mockKey, null, { target: { value: mockValue } })
    expect(wrapper.prop('person')).toEqual(mockValue)
  })

  it('eventSetProperty function', () => {
    let mockKey = 'mockKey'
    let mockValue = 'mockValue'
    wrapper.instance().eventSetProperty(mockKey, null, { target: { value: mockValue } })
    expect(wrapper.instance().state._period[mockKey]).toEqual(mockValue)
  })

  it('dateSetProperty function', () => {
    let mockKey = 'mockKey'
    let mockValue = new Date()
    wrapper.instance().dateSetProperty(mockKey, null, mockValue)
    expect(wrapper.instance().state._period[mockKey]).toEqual(mockValue.valueOf())
  })

  it('valueSetProperty function', () => {
    let mockKey = 'mockKey'
    let mockValue = 'mockValue'
    wrapper.instance().dateSetProperty(mockKey, null, mockValue)
    expect(wrapper.instance().state._period[mockKey]).toEqual(mockValue)
  })

  it('validatePeriod function', async () => {
    await wrapper.setProps({
      person: {}
    })
    await wrapper.instance().setState({
      _period: {
        type: 'work'
      }
    })
    let errors = wrapper.instance().validatePeriod()

    expect(errors).toHaveProperty('country', 'pinfo:validation-noCountry')
    expect(errors).toHaveProperty('startDate', 'pinfo:validation-noStartDate')
    expect(errors).toHaveProperty('endDate', 'pinfo:validation-noEndDate')
    expect(errors).toHaveProperty('place', 'pinfo:validation-noPlace')
    expect(errors).toHaveProperty('workActivity', 'pinfo:validation-noWorkActivity')
  })

  it('addId function', () => {
    let mockId = '123'
    wrapper.instance().addId(mockId)
    expect(wrapper.instance().state._period.insuranceId).toEqual(mockId)
  })

  it('saveNewPeriod function', async () => {
    let mockPeriod = {
      type: 'work',
      startDate: new Date('January 01, 1970 00:00:00').valueOf(),
      endDate: new Date('December 31, 1979 23:59:59').valueOf(),
      place: 'Oslo',
      country: 'NO',
      workActivity: 'Lærer'
    }
    await wrapper.setProps({
      periods: []
    })
    await wrapper.instance().setState({
      _period: mockPeriod
    })
    wrapper.instance().saveNewPeriod()
    expect(wrapper.instance().state.pinfo.stayAbroad).toStrictEqual([mockPeriod])
  })
})

/**

    }

    requestEditPeriod (period) {
      const { editPeriod, actions } = this.props
      editPeriod(period)
      actions.setMainButtonsVisibility(false)
    }

    saveEditPeriod () {
      const { periods, editPeriod, actions, pinfo, username } = this.props
      const { _period } = this.state

      let errors = this.validatePeriod()
      this.setState({
        localErrors: errors,
        errorTimestamp: new Date().getTime()
      })

      if (this.hasNoErrors(errors)) {
        let newPeriods = _.clone(periods)
        let newPeriod = _.clone(_period)

        newPeriod.id = new Date().getTime()

        let index = _.findIndex(periods, { id: _period.id })

        if (index >= 0) {
          newPeriods.splice(index, 1)
          newPeriods.push(newPeriod)
          if (!this.hasSpecialCases(newPeriods)) {
            actions.setPerson({
              fatherName: undefined,
              motherName: undefined
            })
          }
          actions.setStayAbroad(newPeriods)
          this.setState({
            _period: {}
          })
          editPeriod({})
          actions.setMainButtonsVisibility(true)
          let _pinfo = _.cloneDeep(pinfo)
          _pinfo.stayAbroad = newPeriods
          actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo))
          actions.syncLocalStateWithStorage()
        }
        window.scrollTo(0, 0)
      }
    }

    doCancelPeriod () {
      const { periods, editPeriod, actions } = this.props

      this.setState({
        localErrors: {},
        _period: {},
        errorTimestamp: new Date().getTime()
      })
      editPeriod({})
      if (!this.hasSpecialCases(periods)) {
        actions.setPerson({
          fatherName: undefined,
          motherName: undefined
        })
      }
      actions.setMainButtonsVisibility(true)
      actions.closeModal()
      window.scrollTo(0, 0)
    }

    closeModal () {
      const { actions } = this.props
      actions.closeModal()
    }

    removePeriodRequest (period) {
      const { t, actions } = this.props

      actions.openModal({
        modalTitle: t('pinfo:alert-deletePeriod'),
        modalText: t('pinfo:alert-areYouSureDeletePeriod'),
        modalButtons: [{
          main: true,
          text: t('ui:yes') + ', ' + t('ui:delete').toLowerCase(),
          onClick: this.doRemovePeriod.bind(this, period)
        }, {
          text: t('ui:no') + ', ' + t('ui:cancel').toLowerCase(),
          onClick: this.closeModal.bind(this)
        }]
      })
    }

    cancelPeriodRequest () {
      const { t, actions } = this.props

      actions.openModal({
        modalTitle: t('pinfo:alert-cancelPeriod'),
        modalText: t('pinfo:alert-areYouSureCancelPeriod'),
        modalButtons: [{
          main: true,
          text: t('ui:yes') + ', ' + t('ui:continue').toLowerCase(),
          onClick: this.doCancelPeriod.bind(this)
        }, {
          text: t('ui:no').toLowerCase(),
          onClick: this.closeModal.bind(this)
        }]
      })
    }

    doRemovePeriod (period) {
      const { periods, actions, pinfo, username } = this.props

      let index = _.findIndex(periods, { id: period.id })

      if (index >= 0) {
        let newPeriods = _.clone(periods)
        newPeriods.splice(index, 1)
        if (!this.hasSpecialCases(newPeriods)) {
          actions.setPerson({
            fatherName: undefined,
            motherName: undefined
          })
        }
        actions.setStayAbroad(newPeriods)
        let _pinfo = _.cloneDeep(pinfo)
        _pinfo.stayAbroad = newPeriods
        actions.postStorageFileWithNoNotification(username, constants.PINFO, constants.PINFO_FILE, JSON.stringify(_pinfo))
        actions.syncLocalStateWithStorage()
      }
      actions.closeModal()
    }

    errorMessage () {
      const { localErrors } = this.state
      for (var key in localErrors) {
        if (localErrors[key]) {
          return localErrors[key]
        }
      }
      return undefined
    }

    getPeriodAttachments (period) {
      let { attachments } = this.props
      if (!period.attachments) {
        return []
      }
      return period.attachments.map(element => (
        attachments[element.content.md5]
      )).filter(element => element)
    }

    render () {
      const { t, mode, period, periods, locale, current, first, last, person, showButtons } = this.props
      const { localErrors, _period } = this.state

      let errorMessage = this.errorMessage()

      switch (mode) {
        case 'view':
        case 'confirm':
          return <Nav.Row className={classNames('c-pinfo-stayabroad-period', mode)}>
            <div className={classNames({ 'col-md-6': mode === 'view', 'col-md-12': mode === 'confirm', 'current': current })}>
              <div id={period.id} className='existingPeriod'>
                <div className='icon mr-3 ml-3'>
                  <div className={classNames('topHalf', { line: !first })} />
                  <div className={classNames('bottomHalf', { line: !last })} />
                  <Icons className='iconsvg' kind={'nav-' + period.type} />
                </div>
                <div className='pt-2 pb-2 existingPeriodDescription'>
                  <span className='bold existingPeriodType'>{t('pinfo:stayAbroad-category-' + period.type)}</span>
                  <span>
                    <img className='flagImg ml-2' src={'../../../../../flags/' + period.country.value + '.png'}
                      alt={period.country.label} />
                  </span>
                  <br />
                  <span className='existingPeriodDates'>
                    <span className='bold'>{t('pinfo:stayAbroad-period')}</span>{': '}
                    {moment(period.startDate).format('DD.MM.YYYY')}{' - '}
                    {period.endDate ? moment(period.endDate).format('DD.MM.YYYY') : t('ui:unknown')}
                  </span>
                  <br />
                  <React.Fragment>
                    <span className='bold'>{t('pinfo:stayAbroad-place')}</span>{': '}
                    {period.place}
                    <br />
                  </React.Fragment>
                  {period.type === 'work' ? <React.Fragment>
                    <span className='bold'>{t('pinfo:stayAbroad-work-title')}</span>{': '}
                    {period.workActivity}
                    <br />
                  </React.Fragment> : null }
                  {period.type === 'learn' ? <React.Fragment>
                    <span className='bold'>{t('pinfo:stayAbroad-learn-institution')}</span>{': '}
                    {period.learnInstitution}
                    <br />
                  </React.Fragment> : null }
                  {period.attachments && !_.isEmpty(period.attachments) ? <span className='existingPeriodAttachments'>
                    <span className='bold'>{t('pinfo:stayAbroad-attachments')}</span>{': '}
                    {period.attachments.map(att => { return att.name }).join(', ')}
                  </span> : null}
                </div>
              </div>
            </div>
            {showButtons !== false && mode === 'view' ? <div className='col-md-6 existingPeriodButtons'>
              <Nav.Knapp className='mr-3 existingPeriodButton' onClick={this.requestEditPeriod.bind(this, period)}>
                {t('ui:change')}
              </Nav.Knapp>
              <Nav.Knapp className='existingPeriodButton' onClick={this.removePeriodRequest.bind(this, period)}>
                <span className='mr-2' style={{ fontSize: '1.5rem' }}>×</span>
                {t('ui:remove')}
              </Nav.Knapp>
            </div> : null }
          </Nav.Row>

        case 'edit':
        case 'new':
          return <React.Fragment>
            {errorMessage ? <Nav.AlertStripe className='mt-4 mb-4' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe> : null}
            <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-period-' + mode)}</Nav.Undertittel>
            <Nav.Row className={classNames('c-pinfo-opphold-period', 'mt-4', mode)}>
              <div className='col-md-6'>
                <Nav.Select
                  id='pinfo-opphold-kategori-select'
                  label={t('pinfo:stayAbroad-category')}
                  value={_period.type || ''}
                  onChange={this.setType}>
                  <option value=''>{t('ui:choose')}</option>
                  <option value='work'>{t('pinfo:stayAbroad-category-work')}</option>
                  <option value='home'>{t('pinfo:stayAbroad-category-home')}</option>

                </Nav.Select>
              </div>
            </Nav.Row>
            { _period.type ? <React.Fragment>
              {_period.type === 'home' ? <Nav.AlertStripe className='mt-4 mb-4' type='info'>{t('pinfo:warning-home-period')}</Nav.AlertStripe> : null}
              <Nav.Row>
                <div className='col-md-12'>
                  <Nav.Undertittel className='mt-4 mb-4'>{t(`pinfo:stayAbroad-period-title-${_period.type}`)}</Nav.Undertittel>
                  <Nav.Normaltekst className='mb-4'>{t('pinfo:stayAbroad-period-date-description')}</Nav.Normaltekst>
                </div>
                <div className='col-md-6'>
                  <label className='mr-3 skjemaelement__label'>{t('pinfo:stayAbroad-period-start-date') + ' *'}</label>
                  <DatePicker
                    id='pinfo-opphold-startdato-date'
                    selected={_period.startDate ? new Date(_period.startDate) : null}
                    className='startDate'
                    locale={locale}
                    placeholder={t('ui:dateFormat')}
                    onChange={this.setStartDate}
                    error={localErrors.startDate}
                    errorMessage={t(localErrors.startDate)} />
                </div>
                <div className='col-md-6'>
                  <label className='skjemaelement__label'>{t('pinfo:stayAbroad-period-end-date') + ' *'}</label>
                  <DatePicker
                    id='pinfo-opphold-sluttdato-date'
                    selected={_period.endDate ? new Date(_period.endDate) : null}
                    className='endDate'
                    locale={locale}
                    placeholder={t('ui:dateFormat')}
                    onChange={this.setEndDate}
                    error={localErrors.endDate}
                    errorMessage={t(localErrors.endDate)} />
                </div>
              </Nav.Row>
              <Nav.Row>
                <div className='mt-3 mb-3 col-md-8'>
                  <label className='skjemaelement__label'>{t('pinfo:stayAbroad-country') + ' *'}</label>
                  <CountrySelect
                    id='pinfo-opphold-land-select'
                    locale={locale}
                    includeList={CountryFilter.EEA}
                    value={_period.country || null}
                    onSelect={this.setCountry}
                    error={localErrors.country}
                    errorMessage={t(localErrors.country)}
                  />
                </div>

                {this.isASpecialCase(_period) ? <React.Fragment>

                  <div className='col-md-12 mt-3'>
                    <div className='float-right'>
                      <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                        <span>{t('pinfo:stayAbroad-spain-france-warning', { country: _period.country.label })}</span>
                      </Nav.HjelpetekstBase>
                    </div>
                    <Nav.Input
                      id='pinfo-opphold-farsnavn-input'
                      type='text'
                      label={t('pinfo:stayAbroad-period-fathername')}
                      placeholder={t('ui:writeIn')}
                      value={person.fatherName || ''}
                      onChange={this.setFatherName}
                      feil={localErrors.fatherName ? { feilmelding: t(localErrors.fatherName) } : null}
                    />
                  </div>
                  <div className='col-md-12 mt-3'>
                    <div className='float-right'>
                      <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                        <span>{t('pinfo:stayAbroad-spain-france-warning', { country: _period.country.label })}</span>
                      </Nav.HjelpetekstBase>
                    </div>
                    <Nav.Input
                      id='pinfo-opphold-morsnavn-input'
                      type='text'
                      label={t('pinfo:stayAbroad-period-mothername')}
                      placeholder={t('ui:writeIn')}
                      value={person.motherName || ''}
                      onChange={this.setMotherName}
                      feil={localErrors.motherName ? { feilmelding: t(localErrors.motherName) } : null}
                    />
                  </div>
                </React.Fragment> : null }
                <div className='col-md-12 d-flex align-items-center'>
                  <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-insurance-title')}</Nav.Undertittel>
                  {mode !== 'view' ? <Nav.HjelpetekstBase id='pinfo-stayAbroad-insurance-help'>
                    {t('pinfo:stayAbroad-insurance-title-help')}
                  </Nav.HjelpetekstBase> : null}
                </div>
                <div className='col-md-12'>
                  <Nav.Input
                    id='pinfo-opphold-trygdeordning-navn'
                    label={t('pinfo:stayAbroad-insurance-name')}
                    placeholder={t('ui:writeIn')}
                    value={_period.insuranceName || ''}
                    onChange={this.setInsuranceName}
                    feil={localErrors.insuranceName ? { feilmelding: t(localErrors.insuranceName) } : null}
                  />
                </div>
                <div className='col-md-12'>
                  <Nav.Input
                    id='pinfo-opphold-trygdeordning-id'
                    label={t('pinfo:stayAbroad-insurance-id')}
                    placeholder={t('ui:writeIn')}
                    value={_period.insuranceId || ''}
                    onChange={this.setInsuranceId}
                    feil={localErrors.insuranceId ? { feilmelding: t(localErrors.insuranceId) } : null}
                  />
                  <div className='id-suggestions mb-4'>
                    {periods.map(period => {
                      return period.insuranceId
                    }).filter((id, index, self) => {
                      return id && _period.insuranceId !== id && self.indexOf(id) === index
                    }).map(id => {
                      return <Nav.EtikettBase key={id} className='mr-3' type='fokus' onClick={this.addId.bind(this, id)}><b>{id}</b></Nav.EtikettBase>
                    })}
                  </div>
                </div>
                <div className='col-md-12'>
                  <Nav.Select
                    id='pinfo-opphold-trygdeordning-type'
                    label={t('pinfo:stayAbroad-insurance-type')}
                    value={_period.insuranceType || ''}
                    onChange={this.setInsuranceType}
                    feil={localErrors.insuranceType ? { feilmelding: t(localErrors.insuranceType) } : null}>
                    <option value=''>{t('ui:choose')}</option>
                    <option value={t('pinfo:stayAbroad-insurance-type-01')}>{t('pinfo:stayAbroad-insurance-type-01')}</option>
                    <option value={t('pinfo:stayAbroad-insurance-type-02')}>{t('pinfo:stayAbroad-insurance-type-02')}</option>
                    <option value={t('pinfo:stayAbroad-insurance-type-03')}>{t('pinfo:stayAbroad-insurance-type-03')}</option>
                  </Nav.Select>
                </div>
                <div className='col-md-12'>
                  <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-home-title')}</Nav.Undertittel>
                </div>
                <div className='col-md-12'>
                  <Nav.Textarea
                    id='pinfo-opphold-bosted-place-textarea'
                    label={t('pinfo:stayAbroad-place') + ' *'}
                    placeholder={t('ui:writeIn')}
                    value={_period.place || ''}
                    style={{ minHeight: '100px' }}
                    maxLength={100}
                    onChange={this.setPlace}
                    feil={localErrors.place ? { feilmelding: t(localErrors.place) } : null}
                  />
                </div>

              </Nav.Row>
              {_period.type === 'work' ? <React.Fragment>
                <Nav.Row>
                  <div className='col-md-12'>
                    <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-work-title')}</Nav.Undertittel>
                  </div>
                </Nav.Row>
                <Nav.Row>
                  <div className='col-md-12 col-xs-12'>
                    <Nav.Input
                      id='pinfo-opphold-yrkesaktivitet-input'
                      label={t('pinfo:stayAbroad-work-activity') + ' *'}
                      placeholder={t('ui:writeIn')}
                      value={_period.workActivity || ''}
                      onChange={this.setWorkActivity}
                      feil={localErrors.workActivity ? { feilmelding: t(localErrors.workActivity) } : null}
                    />
                  </div>
                </Nav.Row>
                <Nav.Row>
                  <div className='col-md-12 col-xs-12'>
                    <Nav.Input
                      id='pinfo-opphold-arbeidgiversnavn-input'
                      label={t('pinfo:stayAbroad-work-name')}
                      placeholder={t('ui:writeIn')}
                      value={_period.workName || ''}
                      onChange={this.setWorkName}
                      feil={localErrors.workName ? { feilmelding: t(localErrors.workName) } : null}
                    />
                  </div>
                </Nav.Row>
                <Nav.Row >
                  <div className='col-md-12 col-xs-12'>
                    <Nav.Textarea
                      id='pinfo-opphold-arbeidgiverssted-textarea'
                      label={t('pinfo:stayAbroad-work-place')}
                      placeholder={t('ui:writeIn')}
                      value={_period.workPlace || ''}
                      style={{ minHeight: '100px' }}
                      maxLength={100}
                      onChange={this.setWorkPlace}
                      feil={localErrors.workPlace ? { feilmelding: t(localErrors.workPlace) } : null}
                    />
                  </div>
                </Nav.Row>
              </React.Fragment> : null}
              {_period.type === 'child' ? <Nav.Row>
                <div className='col-md-12'>
                  <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-child-title')}</Nav.Undertittel>
                </div>
                <div className='col-md-6'>
                  <Nav.Input
                    id='pinfo-opphold-barnasfornavn-input'
                    label={t('pinfo:stayAbroad-child-firstname')}
                    placeholder={t('ui:writeIn')}
                    value={_period.childFirstName || ''}
                    onChange={this.setChildFirstName}
                    feil={localErrors.childFirstName ? { feilmelding: t(localErrors.childFirstName) } : null}
                  />
                </div>
                <div className='col-md-6'>
                  <Nav.Input
                    id='pinfo-opphold-barnasetternavn-input'
                    label={t('pinfo:stayAbroad-child-lastname')}
                    value={_period.childLastName || ''}
                    placeholder={t('ui:writeIn')}
                    onChange={this.setChildLastName}
                    feil={localErrors.childLastName ? { feilmelding: t(localErrors.childLastName) } : null}
                  />
                </div>
                <div className='col-md-6'>
                  <label className='skjemaelement__label'>{t('pinfo:stayAbroad-child-birthdate')}</label>
                  <DatePicker
                    id='pinfo-opphold-barnasfodselsdato-date'
                    selected={_period.childBirthDate ? new Date(_period.childBirthDate) : null}
                    className='childBirthDate'
                    locale={locale}
                    placeholder={t('ui:dateFormat')}
                    onChange={this.setChildBirthDate}
                    error={localErrors.childBirthDate}
                    errorMessage={t(localErrors.childBirthDate)} />
                </div>
              </Nav.Row> : null}
              {_period.type === 'learn' ? <Nav.Row>
                <div className='col-md-12'>
                  <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-learn-title')}</Nav.Undertittel>
                </div>
                <div className='col-md-12'>
                  <Nav.Input
                    id='pinfo-opphold-opplaeringsinstitusjonsnavn-input'
                    label={t('pinfo:stayAbroad-learn-institution') + ' *'}
                    value={_period.learnInstitution || ''}
                    placeholder={t('ui:writeIn')}
                    onChange={this.setLearnInstitution}
                    feil={localErrors.learnInstitution ? { feilmelding: t(localErrors.learnInstitution) } : null}
                  />
                </div>
              </Nav.Row> : null}
              <Nav.Row>
                <div className='col-md-12'>
                  <Nav.Undertittel className='mt-4 mb-4'>{t('pinfo:stayAbroad-attachment-title')}</Nav.Undertittel>
                </div>
                <div className='col-md-12'>
                  <FileUpload
                    id={'pinfo-opphold-vedlegg-fileupload-' + period.id}
                    accept={['application/pdf', 'image/jpeg', 'image/png']}
                    className='fileUpload'
                    t={t}
                    ref={f => { this.fileUpload = f }}
                    fileUploadDroppableId={'fileUpload'}
                    files={this.getPeriodAttachments(_period)}
                    onFileChange={this.setAttachments} />
                </div>
              </Nav.Row>
              <Nav.Row>
                <div className='mt-4 mb-4 col-md-12'>
                  {'* ' + t('mandatoryField')}
                </div>
              </Nav.Row>
              <Nav.Row>
                <div className='mt-4 mb-4 col-md-12'>
                  {mode === 'edit' ? <Nav.Knapp
                    id='pinfo-opphold-endre-button'
                    className='editPeriodButton'
                    onClick={this.saveEditPeriod.bind(this)}>
                    {t('pinfo:form-saveEditPeriod')}
                  </Nav.Knapp> : null}
                  {mode === 'new' ? <Nav.Hovedknapp
                    id='pinfo-opphold-lagre-button'
                    className='addPeriodButton'
                    onClick={this.saveNewPeriod.bind(this)}>
                    {t('pinfo:form-saveNewPeriod')}
                  </Nav.Hovedknapp> : null}
                  <Nav.KnappBase
                    type='flat'
                    id='pinfo-opphold-avbryt-button'
                    className='ml-4 cancelPeriodButton'
                    onClick={this.cancelPeriodRequest.bind(this)}>
                    {t('pinfo:form-cancelPeriod')}
                  </Nav.KnappBase>
                </div>
              </Nav.Row>
            </React.Fragment> : null}
            {errorMessage ? <Nav.AlertStripe className='mt-4 mb-4' type='advarsel'>{t(errorMessage)}</Nav.AlertStripe> : null}
          </React.Fragment>
        default:
          return null
      }
    }
  }

  Period.propTypes = {
    period: PT.object,
    periods: PT.array,
    actions: PT.object.isRequired,
    editPeriod: PT.func.isRequired,
    showButtons: PT.bool,
    t: PT.func
  }

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Period)
*/
