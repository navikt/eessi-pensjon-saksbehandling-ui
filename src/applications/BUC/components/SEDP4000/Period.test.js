import React from 'react'
import Period from './Period'

const t = jest.fn((translationString) => { return translationString })
const initialMockProps = {
  actions: {
    openModal: jest.fn(),
    closeModal: jest.fn()
  },
  locale: 'nb',
  period: {
    id: 1,
    country: {
      label: 'Norge',
      value: 'NO'
    },
    startDate: { day: '1', month: '1', year: '1970' },
    endDate: { day: '1', month: '1', year: '1980' },
    type: 'military',
    place: 'mockPlace',
    comment: 'mockComment',
    attachments: [{
      name: 'mock.pdf',
      type: 'application/pdf',
      content: 'mokContent',
      size: 123
    }]
  },
  t: t,
  setPeriod: jest.fn()
}

describe('applications/BUC/components/SEDP4000/Period - view/confirm mode', () => {
  it('Renders', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='view' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'work',
        workActivity: 'mockWorkActivity',
        workPlace: 'mockWorkPlace',
        workName: 'mockWorkName'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='view' />)
    expect(wrapper.exists('Period')).toBeTruthy()

    const period = wrapper.find('.a-buc-c-sedp4000-period.view').hostNodes()
    expect(period.exists('.existingPeriod')).toBeTruthy()
    expect(period.find('.existingPeriod Icons').props().kind).toEqual('nav-work')
    expect(period.exists('.existingPeriodDescription')).toBeTruthy()

    const periodDescription = period.find('.existingPeriodDescription').hostNodes()
    expect(periodDescription.find('.existingPeriodType UndertekstBold').render().text()).toEqual('buc:p4000-category-work')
    expect(periodDescription.find('.existingPeriodType Flag').props().country).toEqual('NO')
    expect(periodDescription.find('.existingPeriodType Normaltekst').render().text()).toEqual('Norge')
    expect(periodDescription.find('.existingPeriodDates').render().text()).toEqual('buc:p4000-period: 01.01.1970 - 01.01.1980')
    expect(periodDescription.find('.existingPeriodDates').render().text()).toEqual('buc:p4000-period: 01.01.1970 - 01.01.1980')
    expect(periodDescription.find('.existingPeriodWorkActivity').render().text()).toEqual('buc:p4000-work-title: mockWorkActivity')
    expect(periodDescription.find('.existingPeriodPlace').render().text()).toEqual('buc:p4000-place: mockWorkPlace')
    expect(periodDescription.find('.existingPeriodAttachments').render().text()).toEqual('buc:p4000-attachments: mock.pdf')

    const periodButtons = period.find('.existingPeriodButtons').hostNodes()
    expect(periodButtons.exists('.change')).toBeTruthy()
    expect(periodButtons.exists('.remove')).toBeTruthy()
  })

  it('Change button changes mode from view to edit', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='view' />)
    const periodButtons = wrapper.find('.a-buc-c-sedp4000-period.view .existingPeriodButtons').hostNodes()
    periodButtons.find('.change').hostNodes().simulate('click')
    wrapper.update()
    expect(initialMockProps.setPeriod).toHaveBeenCalledWith(initialMockProps.period)
  })

  it('Remove button opens a modal for deletion prompt', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='view' />)
    const periodButtons = wrapper.find('.a-buc-c-sedp4000-period.view .existingPeriodButtons').hostNodes()
    periodButtons.find('.remove').hostNodes().simulate('click')
    expect(initialMockProps.actions.openModal).toHaveBeenCalled()
  })
})

describe('applications/BUC/components/SEDP4000/Period - new/edit mode', () => {
  it('Renders', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='edit' />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has a period in edit mode', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='edit' />)
    expect(wrapper.exists('Period')).toBeTruthy()
    expect(wrapper.find('.a-buc-c-sedp4000-period__title').hostNodes().render().text()).toEqual('buc:p4000-period-edit')
  })

  it('Has the right buttons in new mode', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='new' />)
    expect(wrapper.exists('#a-buc-c-sedp4000-period__edit-button-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__save-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__cancel-button-id')).toBeTruthy()
  })

  it('Has the right buttons in edit mode', () => {
    const wrapper = mount(<Period {...initialMockProps} mode='edit' />)
    expect(wrapper.exists('#a-buc-c-sedp4000-period__edit-button-id')).toBeTruthy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__save-button-id')).toBeFalsy()
    expect(wrapper.exists('#a-buc-c-sedp4000-period__cancel-button-id')).toBeTruthy()
  })

  it('Has proper HTML structure in work edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'work',
        workActivity: 'mockWorkActivity',
        workPlace: 'mockWorkPlace',
        workName: 'mockWorkName'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('work')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-work')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    // expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id').hostNodes().props().value).toEqual('NO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__arbeidgiverssted-textarea-id').hostNodes().props().value).toEqual('mockWorkPlace')
    expect(wrapper.find('#a-buc-c-sedp4000-period__yrkesaktivitet-input-id').hostNodes().props().value).toEqual('mockWorkActivity')
    expect(wrapper.find('#a-buc-c-sedp4000-period__arbeidgiversnavn-input-id').hostNodes().props().value).toEqual('mockWorkName')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in home edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'home'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('home')
    expect(wrapper.find('.a-buc-c-sedp4000-period__alert_home').hostNodes().render().text()).toEqual('buc:p4000-warning-home-period')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-home')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    // expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id').hostNodes().props().value).toEqual('NO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__bosted-place-textarea-id').hostNodes().props().value).toEqual('mockPlace')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in learn edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'learn',
        learnInstitution: 'mockLearnInstitution'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('learn')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-learn')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    // expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id').hostNodes().props().value).toEqual('NO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__opplaeringsinstitusjonsnavn-input-id').hostNodes().props().value).toEqual('mockLearnInstitution')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in other edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'other',
        otherType: 'mockOtherType'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('other')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-other')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    // expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id').hostNodes().props().value).toEqual('NO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__andre-input-id').hostNodes().props().value).toEqual('mockOtherType')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in daily edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'daily',
        payingInstitution: 'mockPayingInstitution'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('daily')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-daily')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    // expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id').hostNodes().props().value).toEqual('NO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__betalende-institusjon-input-id').hostNodes().props().value).toEqual('mockPayingInstitution')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in sick edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'sick',
        payingInstitution: 'mockPayingInstitution'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('sick')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-sick')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    // expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id').hostNodes().props().value).toEqual('NO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__betalende-institusjon-input-id').hostNodes().props().value).toEqual('mockPayingInstitution')

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in child edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'child',
        childFirstName: 'mockChildFirstName',
        childLastName: 'mockChildLastName',
        childBirthDate: { day: '1', month: '1', year: '2000' }
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('child')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-child')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    // expect(wrapper.find('#a-buc-c-sedp4000-period__land-select-id').hostNodes().props().value).toEqual('NO')
    expect(wrapper.find('#a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input-id').hostNodes().props().value).toEqual('mockChildLastName')
    expect(wrapper.find('#a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input-id').hostNodes().props().value).toEqual('mockChildFirstName')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__omsorgforbarn-fodelsdato-date-id')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in military edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'military'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('military')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-military')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in voluntary edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'voluntary'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('voluntary')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-voluntary')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })

  it('Has proper HTML structure in birth edit', () => {
    const mockProps = { ...initialMockProps,
      period: { ...initialMockProps.period,
        type: 'birth'
      }
    }
    const wrapper = mount(<Period {...mockProps} mode='edit' />)
    expect(wrapper.find('#a-buc-c-sedp4000-period__kategori-select').hostNodes().props().value).toEqual('birth')
    expect(wrapper.find('.a-buc-c-sedp4000-period__subtitle').hostNodes().render().text()).toEqual('buc:p4000-period-title-birth')
    expect(wrapper.find('.a-buc-c-sedp4000-period__description').hostNodes().render().text()).toEqual('buc:p4000-period-date-description')

    expect(wrapper.exists('.a-buc-c-sedp4000-period__startDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__endDate')).toBeTruthy()
    expect(wrapper.exists('.a-buc-c-sedp4000-period__uncertainDate-checkbox')).toBeTruthy()

    expect(wrapper.find('#a-buc-c-sedp4000-period__comment-id').hostNodes().props().value).toEqual('mockComment')
    expect(wrapper.exists('#a-buc-c-sedp4000-period__vedlegg-fileupload-id')).toBeTruthy()
  })
})
