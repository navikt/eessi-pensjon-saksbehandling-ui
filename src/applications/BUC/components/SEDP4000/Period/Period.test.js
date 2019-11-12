import React from 'react'
import Period from 'applications/BUC/components/SEDP4000/Period/Period'
import _ from 'lodash'
import sampleP4000info from 'resources/tests/sampleP4000info'
jest.mock('eessi-pensjon-ui', () => {
  const Ui = jest.requireActual('eessi-pensjon-ui')
  return {
    ...Ui,
    Nav: {
      ...Ui.Nav,
      Hjelpetekst: ({ children }) => <div className='mock-hjelpetekst'>{children}</div>
    }
  }
})
const samplePeriod = _(sampleP4000info.stayAbroad).find(it => it.type === 'work')

const initialMockProps = {
  actions: {
    openModal: jest.fn(),
    closeModal: jest.fn()
  },
  locale: 'nb',
  period: {
    ...samplePeriod,
    attachments: [{
      name: 'mock.pdf',
      type: 'application/pdf',
      content: 'mokContent',
      size: 123
    }]
  },
  periods: [],
  localErrors: {},
  setPeriod: jest.fn(),
  setPeriods: jest.fn(),
  setLocalError: jest.fn(),
  setLocalErrors: jest.fn(),
  t: jest.fn(t => t)
}

describe('applications/BUC/components/SEDP4000/Period - view/confirm mode', () => {
  it('Renders', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='view' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
  //  expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='view' />)
    expect(wrapper.exists('Period')).toBeTruthy()

    const period = wrapper.find('.a-buc-c-sedp4000-period.view').hostNodes()
    expect(period.exists('.a-buc-c-sedp4000-period__existingPeriod')).toBeTruthy()
    expect(period.find('.a-buc-c-sedp4000-period__existingPeriod-icon Icons').props().kind).toEqual('nav-work')
    expect(period.exists('.a-buc-c-sedp4000-period__existingPeriod-description')).toBeTruthy()

    const periodDescription = period.find('.a-buc-c-sedp4000-period__existingPeriod-description').hostNodes()
    expect(periodDescription.find('.a-buc-c-sedp4000-period__existingPeriod-type UndertekstBold').render().text()).toEqual('buc:p4000-label-category-work')
    expect(periodDescription.find('.a-buc-c-sedp4000-period__existingPeriod-type Flag').props().country).toEqual('MX')
    expect(periodDescription.find('.a-buc-c-sedp4000-period__existingPeriod-type Normaltekst').render().text()).toEqual('mockMM')
    expect(periodDescription.find('.a-buc-c-sedp4000-period__existingPeriod-dates').render().text()).toEqual('buc:p4000-label-period: 01.01.1993 - 01.01.1994 (?)')
    expect(periodDescription.find('.a-buc-c-sedp4000-period__existingPeriod-workActivity').render().text()).toEqual('buc:p4000-label-work-activity2: work period 1 workActivity')
    expect(periodDescription.find('.a-buc-c-sedp4000-period__existingPeriod-attachments').render().text()).toEqual('buc:p4000-label-attachments: mock.pdf')

    const periodButtons = period.find('.a-buc-c-sedp4000-period__existingPeriod-buttons').hostNodes()
    expect(periodButtons.exists('.change')).toBeTruthy()
    expect(periodButtons.exists('.remove')).toBeTruthy()
  })

  it('Change button changes mode from view to edit', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='view' />)
    const periodButtons = wrapper.find('.a-buc-c-sedp4000-period__existingPeriod-buttons').hostNodes()
    periodButtons.find('.change').hostNodes().simulate('click')
    wrapper.update()
    expect(initialMockProps.setPeriod).toHaveBeenCalledWith(initialMockProps.period)
  })

  it('Remove button opens a modal for deletion prompt', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='view' />)
    const periodButtons = wrapper.find('.a-buc-c-sedp4000-period__existingPeriod-buttons').hostNodes()
    periodButtons.find('.remove').hostNodes().simulate('click')
    expect(initialMockProps.actions.openModal).toHaveBeenCalled()
  })
})

describe('applications/BUC/components/SEDP4000/Period - new mode', () => {
  it('Renders', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='new' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    // expect(wrapper).toMatchSnapshot()
  })

  it('Has the right buttons in new mode', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='new' />)
    expect(wrapper.exists('#a-buc-c-sedp4000-period__edit-button-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__save-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__cancel-button-id')).toBeTruthy()
  })

  it('Saves new period', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='new' />)
    wrapper.find('#a-buc-c-sedp4000-period__save-button-id').hostNodes().simulate('click')
    expect(initialMockProps.setPeriods).toHaveBeenCalled()
  })
})

describe('applications/BUC/components/SEDP4000/Period - edit mode', () => {
  it('Renders', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='edit' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    // expect(wrapper).toMatchSnapshot()
  })

  it('Has a period in edit mode', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='edit' />)
    expect(wrapper.exists('Period')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000-period__title').hostNodes().render().text()).toEqual('buc:p4000-title-edit')
  })

  it('Has the right buttons in edit mode', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='edit' />)
    expect(wrapper.exists('#a-buc-c-sedp4000-period__edit-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__save-button-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__cancel-button-id')).toBeTruthy()
  })

  it('Has proper HTML structure in work edit', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('work')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-work')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockMM')
    expect(wrapper.find('#a-buc-c-sedp4000-period__yrkesaktivitet-input-id').hostNodes().props().value).toEqual('work period 1 workActivity')
    expect(wrapper.find('#a-buc-c-sedp4000-period__arbeidgiversnavn-input-id').hostNodes().props().value).toEqual('work period 1 workName')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('work period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in home edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'home')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('home')
    expect(wrapper.find('.a-buc-c-sedp4000-period__alert_home').hostNodes().render().text()).toEqual('buc:p4000-warning-home-period')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-home')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockEE')
    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('home period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in learn edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'learn')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('learn')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-learn')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockGG')
    expect(wrapper.find('#a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input-id').hostNodes().props().value).toEqual('learn period 1 learnInstitution')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('learn period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in other edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'other')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('other')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-other')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockAA')
    expect(wrapper.find('#a-buc-c-sedp4000-period__andre-input-id').hostNodes().props().value).toEqual('other period 1 otherType')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('other period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in daily edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'daily')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('daily')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-daily')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockCC')
    expect(wrapper.find('#a-buc-c-sedp4000-period__betalende-institusjon-input-id').hostNodes().props().value).toEqual('daily period 1 payingInstitution')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('daily period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in sick edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'sick')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('sick')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-sick')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockII')
    expect(wrapper.find('#a-buc-c-sedp4000-period__betalende-institusjon-input-id').hostNodes().props().value).toEqual('sick period 1 payingInstitution')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('sick period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in child edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'child')
    }

    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('child')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-child')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockKK')
    expect(wrapper.find('#a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input-id').hostNodes().props().value).toEqual('Olsen')
    expect(wrapper.find('#a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input-id').hostNodes().props().value).toEqual('Ole')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__omsorgforbarn-fodelsdato-date-id')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('child period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in military edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'military')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('military')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-military')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockOO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('military period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in voluntary edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'voluntary')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('voluntary')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-voluntary')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockSS')
    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('voluntary period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in birth edit', () => {
    const mockProps = {
      ...initialMockProps,
      period: _(sampleP4000info.stayAbroad).find(it => it.type === 'birth')
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('birth')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-title-birth')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-help-date')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id .c-countrySelect__select').hostNodes().render().text()).toEqual('mockQQ')
    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('birth period 1 comment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('throws a validation error when child not properly filled out', () => {
    const mockProps = {
      ...initialMockProps,
      period: { ..._(sampleP4000info.stayAbroad).find(it => it.type === 'child'), childFirstName: undefined },
      mode: 'edit'
    }
    const wrapper = mount(<Period {...mockProps} />)
    wrapper.setProps({
      setLocalErrors: (arg) => {
        wrapper.setProps({ localErrors: arg })
      }
    })
    wrapper.find('#a-buc-c-sedp4000-period__edit-button-id').hostNodes().simulate('click')
    expect(wrapper.find('#a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input-id div.skjemaelement__feilmelding').text()).toEqual('buc:validation-noChildFirstName')
  })
})
