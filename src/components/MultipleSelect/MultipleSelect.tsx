import classNames from 'classnames'
import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import MultipleValueRemove from 'components/MultipleSelect/MultipleValueRemove'
import _ from 'lodash'
import { guid } from 'nav-frontend-js-utils'
import PT from 'prop-types'
import Select, { OptionsOrGroups, GroupBase, OnChangeValue, PropsValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import styled from 'styled-components'
import MultipleOption from './MultipleOption'
import { Option } from 'declarations/app'

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

const MultipleSelect = <T extends Option = Option> ({
  ariaLabel, className, creatable = false, error, hideSelectedOptions = false, id,
  isDisabled = false, isLoading = false, isSearchable = true, label, menuPortalTarget, onSelect, options = [], placeholder, values = []
}: MultipleSelectProps<T>): JSX.Element => {
  const onSelectChange = (e: OnChangeValue<T, true>) => {
    if (_.isFunction(onSelect)) {
      onSelect(e as Array<T>)
    }
  }

  const Component = creatable ? CreatableSelect : Select
  const inputId = id || guid()

  const customProps: any = {
    id: id
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
            backgroundColor: 'var(--navds-color-background)',
            borderRadius: 'var(--navds-border-radius)',
            border: !error
              ? '1px solid var(--navds-color-border)'
              : '2px solid var(--navds-color-error-border)',
            boxShadow: state.isFocused
              ? '0 0 0 3px var(--navds-semantic-color-focus)'
              : (error ? '0 0 0 1px var(--navds-color-error-border)' : 'none')
          }),
          control: (styles: any) => ({
            ...styles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: error ? 'var(--navds-color-text-error)' : 'var(--navds-color-border)',
            backgroundColor: isDisabled ? 'var(--navds-color-disabled)' : 'var(--navds-color-background)',
            borderRadius: 'var(--navds-border-radius)',
            color: 'var(--navds-color-text-primary)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--navds-color-border)'
          }),
          menu: (styles: any) => ({
            ...styles,
            zIndex: 500,
            width: 'max-content',
            minWidth: '100%'
          }),
          multiValue: (styles: any) => ({
            ...styles,
            borderRadius: '20px',
            borderWidth: '1px',
            borderColor: 'var(--navds-color-border)',
            borderStyle: 'solid',
            padding: '0rem 0.25rem',
            backgroundColor: 'var(--navds-color-background)',
            color: 'var(--navds-color-text-primary)',
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
            borderWidth: '1px',
            borderColor: 'var(--navds-color-border)',
            borderStyle: 'solid',
            backgroundColor: 'var(--navds-semantic-color-component-background-alternate)'
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
          option: (styles: any, { isFocused, isSelected }: any) => ({
            ...styles,
            padding: '0.5rem',
            color: isFocused
              ? 'var(--navds-color-text-inverse)'
              : isSelected
                ? 'var(--navds-color-text-inverse)'
                : 'var(--navds-color-text-primary)',
            backgroundColor: isFocused
              ? 'var(--navds-semantic-color-focus)'
              : isSelected
                ? 'var(--navds-semantic-color-interaction-primary-default)'
                : 'var(--navds-semantic-color-component-background-alternate)'
          }),
          placeholder: (styles: any) => {
            return {
              ...styles,
              color: 'var(--navds-color-disabled)'
            }
          },
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--navds-color-text-primary)'
          })
        }}
        tabSelectsValue={false}
      />

      {error && (
        <div role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {error}
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
