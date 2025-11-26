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
      {label && (<label className='navds-text-field--label navds-label' htmlFor={inputId}>{label}</label>)}
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
            borderColor: error ? 'var(--a-border-danger)' : 'var(--a-border-default)',
            backgroundColor: isDisabled ? 'var(--a-surface-subtle)' : 'var(--a-surface-default)',
            borderRadius: '4px',
            color: 'var(--a-color-text-primary)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--a-border-strong)'
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
            borderColor: 'var(--a-border-strong)',
            borderStyle: 'solid',
            padding: '0rem 0.25rem',
            backgroundColor: 'var(--a-select-color-background)',
            color: 'var(--a-color-text-primary)',
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
            borderColor: 'var(--a-border-strong)',
            borderStyle: 'solid',
            backgroundColor: 'var(--a-surface-subtle)'
          }),
          menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
          option: (styles: any, { isFocused, isSelected }: any) => ({
            ...styles,
            padding: '0.5rem',
            color: isFocused
              ? 'var(--a-text-on-inverted)'
              : isSelected
                ? 'var(--a-text-on-inverted)'
                : 'var(--a-color-text-primary)',
            backgroundColor: isFocused
              ? 'var(--a-border-focus)'
              : isSelected
                ? 'var(--a-surface-action-selected)'
                : 'var(--a-select-color-background)'
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--a-color-text-primary)'
          })
        }}
        tabSelectsValue={false}
      />

      {error && (
        <div style={{ marginTop: '8px' }} role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {error}
        </div>
      )}
    </div>
  )
}

export default MultipleSelect
