import React, { useEffect, useState } from 'react'
import { TextField } from '@navikt/ds-react'
import _ from 'lodash'

export interface InputProps {
  ariaLabel ?: string
  className ?: string
  error: string | null | undefined
  namespace: string
  id: string
  hideLabel?: boolean
  label: string
  onChanged: (e: string) => void
  onEnterPress?: (e: string) => void
  size?: 'medium' | 'small'
  placeholder?: string
  style ?: any
  required ?: boolean
  type?: 'number' | 'text' | 'email' | 'password' | 'tel' | 'url' | undefined
  value: string | undefined
}
const Input: React.FC<InputProps> = ({
  ariaLabel,
  className,
  error,
  id,
  hideLabel = false,
  label,
  namespace,
  onChanged,
  onEnterPress,
  required = false,
  placeholder,
  type = 'text',
  size = 'medium',
  style = {},
  value
}: InputProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)

  useEffect(() => { _setValue(value ?? '') }, [value])

  return (
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel ?? label}
      className={className}
      data-testid={namespace + '-' + id}
      error={error}
      id={namespace + '-' + id}
      size={size}
      style={style}
      label={label}
      hideLabel={hideLabel}
      onBlur={() => {
        if (_dirty) {
          onChanged(_value)
          _setDirty(false)
        }
      }}
      onKeyPress={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && _.isFunction(onEnterPress)) {
          onEnterPress(_value)
          _setDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()
        _setValue(e.target.value)
        _setDirty(true)
      }}
      placeholder={placeholder ?? ''}
      required={required}
      type={type}
      value={_value}
    />
  )
}

export default Input
