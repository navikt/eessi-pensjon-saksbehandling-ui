
import classNames from 'classnames'
import React, {JSX} from 'react'
import ReactSelect, { Props } from 'react-select'

interface SelectProps extends Props {
  error?: string
  label?: string | undefined
  noMarginTop?: boolean
  size?: 'medium' | 'small'
  style ?: any
  'data-testid'?: string
}

const Select: React.FC<SelectProps> = (props: SelectProps): JSX.Element => {
  return (
    <div
      className={classNames({ 'navds-select--error': !!props.error })}
      data-testid={props['data-testid'] || props.id}
      style={props.style}
    >
      {props.label && (<label className='navds-text-field--label navds-label'>{props.label ?? ''}</label>)}
      <ReactSelect
        inputId={props.id}
        isOptionDisabled={(option: any) => option.isDisabled}
        placeholder=''
        styles={{
          container: (styles: any) => ({
            ...styles,
            marginTop: props.noMarginTop ? '0px' : '8px',
            minHeight: props.size === 'small' ? '35px' : '48px'
          }),
          control: (styles: any, { isDisabled }) => ({
            ...styles,
            minHeight: props.size === 'small' ? '35px' : '48px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: props.error ? 'var(--a-select-color-border-error)' : 'var(--a-select-color-border)',
            borderRadius: '4px',
            color: 'var(--a-color-text-primary)',
            backgroundColor: isDisabled ? 'var(--a-surface-subtle)' : 'var(--a-select-color-background)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--a-select-color-border)'
          }),
          menu: (styles: any) => ({
            ...styles,
            zIndex: 500,
            width: 'max-content',
            minWidth: '100%'
          }),
          menuList: (styles: any) => ({
            ...styles,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--a-select-color-border)',
            backgroundColor: 'var(--a-surface-subtle)'
          }),
          option: (styles: any, { isDisabled, isFocused, isSelected }) => ({
            ...styles,
            color: isFocused
              ? 'var(--a-text-on-inverted)'
              : isSelected
                ? 'var(--a-text-on-inverted)'
                : 'var(--a-color-text-primary)',
            backgroundColor: isFocused
              ? 'var(--a-border-focus)'
              : isSelected
                ? 'var(--a-surface-action-selected)'
                : isDisabled
                  ? 'var(--a-text-field-color-background)'
                  : 'var(--a-surface-subtle)'
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--a-color-text-primary)'
          })
        }}
        {...props}
      />
      {props.error && (
        <div style={{ marginTop: '8px' }} role='alert' aria-live='assertive' className='navds-error-message navds-error-message--medium navds-label'>
          {props.error}
        </div>
      )}
    </div>
  )
}

export default Select
