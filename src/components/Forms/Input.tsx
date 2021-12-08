import React, { useState } from 'react'
import { TextField } from '@navikt/ds-react'

export interface InputProps {
  ariaLabel ?: string
  className ?: string
  error: string | null | undefined
  namespace: string
  id: string
  label: string
  onChanged: (e: string) => void
  placeholder?: string
  required ?: boolean
  type?: 'number' | 'text' | 'email' | 'password' | 'tel' | 'url' | undefined
  value: string | undefined
}
const Input: React.FC<InputProps> = ({
  ariaLabel,
  className,
  error,
  id,
  label,
  namespace,
  onChanged,
  required = false,
  type = 'text',
  value
}: InputProps) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const [_dirty, _setDirty] = useState<boolean>(false)

  return (
    <TextField
      aria-invalid={!!error}
      aria-label={ariaLabel ?? label}
      className={className}
      data-test-id={namespace + '-' + id}
      error={error}
      id={namespace + '-' + id}
      label={label}
      onBlur={() => {
        if (_dirty) {
          onChanged(_value)
          _setDirty(false)
        }
      }}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        _setValue(e.target.value)
        _setDirty(true)
      }}
      required={required}
      type={type}
      value={_value}
    />
  )
}

export default Input
