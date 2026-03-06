import {JSX} from 'react'
import classNames from 'classnames'
import MultipleValueLabel from 'src/components/MultipleSelect/MultipleValueLabel'
import MultipleValueRemove from 'src/components/MultipleSelect/MultipleValueRemove'
import _ from 'lodash'
import Select, { OptionsOrGroups, GroupBase, OnChangeValue, PropsValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import MultipleOption from './MultipleOption'
import { Option } from 'src/declarations/app'

export interface MultipleSelectProps<T>{
  ariaLabel ?: string
  className ?: string
  creatable ?: boolean
  error ?: string
  hideSelectedOptions ?: boolean
  id : string
  isDisabled ?: boolean
  isLoading?: boolean
  isSearchable ?: boolean
  label: string | JSX.Element
  menuPortalTarget?: any,
  onSelect?: (e: Array<T>) => void
  options?: OptionsOrGroups<T, GroupBase<T>>
  size ?: 'medium' | 'small'
  values?: PropsValue<T>
}

const MultipleSelect = <T extends Option> ({
  ariaLabel, className, creatable = false, error, hideSelectedOptions = false, id,
  isDisabled = false, isLoading = false, isSearchable = true, label, menuPortalTarget, onSelect,
  options = [], size = 'medium', values = []
}: MultipleSelectProps<T>): JSX.Element => {
  const Component = creatable ? CreatableSelect : Select
  const inputId = id

  const customProps: any = {
    id
  }

  const onSelectChange = (e: OnChangeValue<T, true>) => {
    if (_.isFunction(onSelect)) {
      onSelect(e as Array<T>)
    }
  }

  return (
    <div
      className={classNames(className)}
      data-testid='c-multipleSelect'
    >
      {label && (<label className='aksel-form-field__label aksel-label' htmlFor={inputId}>{label}</label>)}
      <Component
        inputId={id || undefined}
        className='multipleSelect'
        classNamePrefix='multipleSelect'
        aria-label={ariaLabel}
        isDisabled={isDisabled}
        isMulti
        isLoading={isLoading}
        isSearchable={isSearchable}
        menuPortalTarget={menuPortalTarget || document.body}
        closeMenuOnSelect={false}
        value={values}
        options={options}
        placeholder=''
        components={{
          Option: (optionProps) => <MultipleOption<T> {...optionProps} {...customProps} />,
          MultiValueRemove: (optionProps) => <MultipleValueRemove {...optionProps} {...customProps} />,
          MultiValueLabel: (optionProps) => <MultipleValueLabel {...optionProps} {...customProps} />
        }}
        onChange={onSelectChange}
        hideSelectedOptions={hideSelectedOptions || false}
        styles={{
          container: (styles: any) => ({
            ...styles,
            marginTop: '8px',
            minHeight: size === 'small' ? '35px' : '48px'
          }),
          control: (styles: any) => ({
            ...styles,
            minHeight: size === 'small' ? '35px' : '48px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: error ? 'var(--ax-border-danger)' : 'var(--ax-border-neutral)',
            backgroundColor: isDisabled ? 'var(--ax-bg-neutral-soft)' : 'var(--ax-bg-default)',
            borderRadius: '4px',
            color: 'var(--ax-text-neutral)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--ax-border-neutral-strong)'
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
            borderColor: 'var(--ax-border-neutral-strong)',
            borderStyle: 'solid',
            padding: '0rem 0.25rem',
            backgroundColor: 'var(--ax-bg-default)',
            color: 'var(--ax-text-neutral)',
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
            borderColor: 'var(--ax-border-neutral-strong)',
            borderStyle: 'solid',
            backgroundColor: 'var(--ax-bg-neutral-soft)'
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
          option: (styles: any, { isFocused, isSelected }: any) => ({
            ...styles,
            padding: '0.5rem',
            color: isFocused
              ? 'var(--ax-text-neutral-contrast)'
              : isSelected
                ? 'var(--ax-text-neutral-contrast)'
                : 'var(--ax-text-neutral)',
            backgroundColor: isFocused
              ? 'var(--ax-bg-accent-strong)'
              : isSelected
                ? 'var(--ax-bg-accent-strong)'
                : 'var(--ax-bg-default)'
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--ax-text-neutral)'
          })
        }}
        tabSelectsValue={false}
      />

      {error && (
        <div style={{ marginTop: '8px' }} role='alert' aria-live='assertive' className='aksel-error-message'>
          {error}
        </div>
      )}
    </div>
  )
}

export default MultipleSelect
