
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
      className={classNames({ 'aksel-select--error': !!props.error })}
      data-testid={props['data-testid'] || props.id}
      style={props.style}
    >
      {props.label && (<label className='aksel-form-field__label aksel-label'>{props.label ?? ''}</label>)}
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
            borderColor: props.error ? 'var(--ax-border-danger)' : 'var(--ax-border-neutral)',
            borderRadius: '4px',
            color: 'var(--ax-text-neutral)',
            backgroundColor: isDisabled ? 'var(--ax-bg-neutral-soft)' : 'var(--ax-bg-default)'
          }),
          indicatorSeparator: (styles: any) => ({
            ...styles,
            backgroundColor: 'var(--ax-border-neutral)'
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
            borderColor: 'var(--ax-border-neutral)',
            backgroundColor: 'var(--ax-bg-neutral-soft)'
          }),
          option: (styles: any, { isDisabled, isFocused, isSelected }) => ({
            ...styles,
            color: isFocused
              ? 'var(--ax-text-neutral-contrast)'
              : isSelected
                ? 'var(--ax-text-neutral-contrast)'
                : 'var(--ax-text-neutral)',
            backgroundColor: isFocused
              ? 'var(--ax-bg-accent-strong)'
              : isSelected
                ? 'var(--ax-bg-accent-strong)'
                : isDisabled
                  ? 'var(--ax-bg-neutral-soft)'
                  : 'var(--ax-bg-neutral-soft)'
          }),
          singleValue: (styles: any) => ({
            ...styles,
            color: 'var(--ax-text-neutral)'
          })
        }}
        {...props}
      />
      {props.error && (
        <div style={{ marginTop: '8px' }} role='alert' aria-live='assertive' className='aksel-error-message'>
          {props.error}
        </div>
      )}
    </div>
  )
}

export default Select
