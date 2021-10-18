import classNames from 'classnames'
import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import MultipleValueRemove from 'components/MultipleSelect/MultipleValueRemove'
import _ from 'lodash'
import { Feilmelding } from 'nav-frontend-typografi'
import { guid } from 'nav-frontend-js-utils'
import { theme, themeKeys, themeHighContrast } from 'nav-hoykontrast'
import PT from 'prop-types'
import Select, { OptionsOrGroups, GroupBase, OnChangeValue, PropsValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'
import MultipleOption from './MultipleOption'
import { O } from 'declarations/app'

const MultipleSelectDiv = styled.div`
  .skjemaelement__feilmelding {
    .multipleSelect__control {
      border: 1px solid ${({ theme }) => theme.redError};
    }
  }
`

export interface MultipleSelectProps<T>{
  ariaLabel ?: string
  className ?: string
  creatable ?: boolean
  error ?: string
  highContrast?: boolean
  hideSelectedOptions ?: boolean
  id ?: string
  isDisabled ?: boolean
  isLoading?: boolean
  isSearchable ?: boolean
  label: string | JSX.Element
  menuPortalTarget?: any,
  onSelect?: (e: Array<T>) => void
  options?: OptionsOrGroups<T, GroupBase<T>>
  placeholder?: JSX.Element | string
  values?: PropsValue<T>
}

const MultipleSelect = <T extends O = O> ({
  ariaLabel, className, creatable = false, error, highContrast = false, hideSelectedOptions = false, id,
  isDisabled = false, isLoading = false, isSearchable = true, label, menuPortalTarget, onSelect, options = [], placeholder, values = []
}: MultipleSelectProps<T>): JSX.Element => {
  const _theme = highContrast ? themeHighContrast : theme

  const onSelectChange = (e: OnChangeValue<T, true>) => {
    if (_.isFunction(onSelect)) {
      onSelect(e as Array<T>)
    }
  }

  const Component = creatable ? CreatableSelect : Select
  const inputId = id || guid()

  const customProps: any = {
    id: id,
    _theme: _theme,
    highContrast: highContrast
  }

  return (
    <MultipleSelectDiv
      className={classNames(className, { skjemaelement__feilmelding: error })}
    >
      <label className='skjemaelement__label' htmlFor={inputId}>{label}</label>
      <Component
        inputId={id || undefined}
        className='multipleSelect'
        classNamePrefix='multipleSelect'
        placeholder={placeholder}
        aria-label={ariaLabel}
        isDisabled={isDisabled}
        isMulti
        isLoading={isLoading}
        isSearchable={isSearchable}
        menuPortalTarget={menuPortalTarget || document.body}
        closeMenuOnSelect={false}
        value={values}
        options={options}
        components={{
          Option: (optionProps) => <MultipleOption<T> {...optionProps} {...customProps} />,
          MultiValueRemove: (optionProps) => <MultipleValueRemove {...optionProps} {...customProps} />,
          MultiValueLabel: (optionProps) => <MultipleValueLabel {...optionProps} {...customProps} />
        }}
        onChange={onSelectChange}
        hideSelectedOptions={hideSelectedOptions || false}
        styles={{
          container: (styles: any, state: any) => ({
            ...styles,
            backgroundColor: _theme[themeKeys.MAIN_BACKGROUND_COLOR],
            borderRadius: _theme[themeKeys.MAIN_BORDER_RADIUS],
            borderColor: !error
              ? `1px solid ${_theme[themeKeys.MAIN_BORDER_COLOR]}`
              : `2px solid ${_theme[themeKeys.REDERROR]}`,
            boxShadow: state.isFocused
              ? `0 0 0 3px ${_theme[themeKeys.MAIN_FOCUS_COLOR]}`
              : (error ? `0 0 0 1px ${_theme[themeKeys.REDERROR]}` : 'none')
          }),
          control: (styles: any) => ({
            ...styles,
            borderWidth: _theme.type === 'themeHighContrast' ? '2px' : (!error ? '1px' : '2px'),
            borderColor: !error ? _theme[themeKeys.MAIN_BORDER_COLOR] : _theme[themeKeys.REDERROR],
            borderStyle: 'solid',
            borderRadius: _theme[themeKeys.MAIN_BORDER_RADIUS],
            color: _theme[themeKeys.MAIN_FONT_COLOR],
            backgroundColor: isDisabled ? _theme[themeKeys.MAIN_DISABLED_COLOR] : _theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: _theme[themeKeys.MAIN_BORDER_COLOR]
          }),
          menu: (styles: any) => ({
            ...styles,
            zIndex: 500
          }),
          multiValue: (styles: any) => ({
            ...styles,
            borderRadius: '20px',
            borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
            borderColor: _theme[themeKeys.MAIN_BORDER_COLOR],
            borderStyle: 'solid',
            padding: '0.25rem',
            backgroundColor: _theme[themeKeys.MAIN_BACKGROUND_COLOR],
            color: _theme[themeKeys.MAIN_FONT_COLOR],
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center'
          }),
          multiValueRemove: (styles: any) => ({
            ...styles,
            padding: '0rem'
          }),
          menuList: (styles: any) => ({
            ...styles,
            borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
            borderColor: _theme[themeKeys.MAIN_BORDER_COLOR],
            borderStyle: 'solid',
            backgroundColor: _theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
          option: (styles: any, { isFocused, isSelected }: any) => ({
            ...styles,
            padding: '0.5rem',
            color: isFocused
              ? _theme[themeKeys.INVERTED_FONT_COLOR]
              : isSelected
                ? _theme[themeKeys.INVERTED_FONT_COLOR]
                : _theme[themeKeys.MAIN_FONT_COLOR],
            backgroundColor: isFocused
              ? _theme[themeKeys.MAIN_FOCUS_COLOR]
              : isSelected
                ? _theme[themeKeys.MAIN_INTERACTIVE_COLOR]
                : _theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR]
          }),
          placeholder: (styles: any) => {
            return {
              ...styles,
              color: _theme[themeKeys.GRAYINACTIVE]
            }
          },
          singleValue: (styles: any) => ({
            ...styles,
            color: _theme[themeKeys.MAIN_FONT_COLOR]
          })
        }}
        tabSelectsValue={false}
      />

      {error && (
        <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
          <Feilmelding>{error}</Feilmelding>
        </div>
      )}
    </MultipleSelectDiv>
  )
}

MultipleSelect.propTypes = {
  ariaLabel: PT.string,
  className: PT.string,
  creatable: PT.bool,
  error: PT.string,
  hideSelectedOptions: PT.bool,
  id: PT.string,
  isLoading: PT.bool,
  label: PT.oneOfType([PT.element, PT.string]).isRequired,
  onSelect: PT.func,
  options: PT.array,
  placeholder: PT.string,
  values: PT.array
}
export default MultipleSelect
