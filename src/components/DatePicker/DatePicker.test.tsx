import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import DatePicker, { DatePickerProps } from './DatePicker'

describe('components/DatePicker', () => {
  let wrapper: ReactWrapper
  const initialMockProps: DatePickerProps = {
    ids: {
      day: 'mock-day-id',
      month: 'mock-month-id',
      year: 'mock-year-id'
    },
    onChange: jest.fn()
  }

  beforeEach(() => {
    wrapper = mount(<DatePicker {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Correctly validates day', () => {
    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '99' } })
    })
    wrapper.update()
    expect(initialMockProps.onChange).toHaveBeenCalledWith({ day: '99' })
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '-1' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '0' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '10' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeFalsy()

    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '50' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeTruthy();

    (initialMockProps.onChange as jest.Mock).mockReset()
    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '31' } })
    })
    wrapper.update()
    expect(initialMockProps.onChange).toHaveBeenCalledWith({ day: '31' });

    (initialMockProps.onChange as jest.Mock).mockReset()
    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '3' } })
    })
    wrapper.update()
    expect(initialMockProps.onChange).toHaveBeenCalledWith({ day: '31', month: '3' })
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeFalsy();

    (initialMockProps.onChange as jest.Mock).mockReset()
    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '4' } })
    })
    wrapper.update()
    expect(initialMockProps.onChange).toHaveBeenCalledWith({ day: '31', month: '4' })
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '29' } })
    })
    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '2' } })
    })
    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '2001' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '2000' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeFalsy()

    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '2001' } })
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '28' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeFalsy()
  })

  it('Correctly validates month', () => {
    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: 'MM' } })
    })
    wrapper.update()
    expect(initialMockProps.onChange).toHaveBeenCalledWith({ month: 'MM' })
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '-1' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '0' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '1' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeFalsy()

    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '12' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeFalsy()

    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '13' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeTruthy()
  })

  it('Correctly validates year', () => {
    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: 'YYYY' } })
    })
    wrapper.update()
    expect(initialMockProps.onChange).toHaveBeenCalledWith({ year: 'YYYY' })
    expect(wrapper.exists('.DatePickerYearInput .skjemaelement__input--harFeil')).toBeTruthy()

    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '0' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerYearInput .skjemaelement__input--harFeil')).toBeFalsy()

    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '2000' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerYearInput .skjemaelement__input--harFeil')).toBeFalsy()

    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '3000' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerYearInput .skjemaelement__input--harFeil')).toBeFalsy()
  })

  it('Renders input errors correctly', () => {
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeFalsy()
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeFalsy()
    expect(wrapper.exists('.DatePickerYearInput .skjemaelement__input--harFeil')).toBeFalsy()

    act(() => {
      wrapper.find('.DatePickerDayInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '99' } })
    })
    wrapper.update()
    act(() => {
      wrapper.find('.DatePickerMonthInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: '99' } })
    })
    wrapper.update()
    act(() => {
      wrapper.find('.DatePickerYearInput .skjemaelement__input').hostNodes().simulate('change', { target: { value: 'xxx' } })
    })
    wrapper.update()
    expect(wrapper.exists('.DatePickerDayInput .skjemaelement__input--harFeil')).toBeTruthy()
    expect(wrapper.exists('.DatePickerMonthInput .skjemaelement__input--harFeil')).toBeTruthy()
    expect(wrapper.exists('.DatePickerYearInput .skjemaelement__input--harFeil')).toBeTruthy()
  })

  it('Renders total errors correctly', () => {
    expect(wrapper.exists('.feilmelding')).toBeFalsy()
    wrapper.setProps({ error: 'ERROR' })
    expect(wrapper.exists('.feilmelding')).toBeTruthy()
    expect(wrapper.find('.feilmelding').hostNodes().text()).toEqual('ERROR')
  })
})
