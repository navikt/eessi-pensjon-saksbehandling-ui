import classNames from 'classnames'
import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import MultipleValueRemove from 'components/MultipleSelect/MultipleValueRemove'
import _ from 'lodash'
import { Feilmelding } from 'nav-frontend-typografi'
import { guid } from 'nav-frontend-js-utils'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useState } from 'react'
import Select, { ValueType } from 'react-select'
import makeAnimated from 'react-select/animated'
import CreatableSelect from 'react-select/creatable'
import { SelectComponents } from 'react-select/src/components'
import styled, { ThemeProvider } from 'styled-components'
import MultipleOption from './MultipleOption'

const animatedComponents: SelectComponents<any> = makeAnimated()

export interface MultipleSelectProps<T> {
  ariaLabel ?: string
  className ?: string
  creatable ?: boolean
  disabled ?: boolean
  error ?: string
  highContrast?: boolean
  hideSelectedOptions ?: boolean
  id ?: string
  isLoading?: boolean
  label: string | JSX.Element
  onSelect?: (e: ValueType<any>) => void
  options?: Array<T>
  placeholder?: JSX.Element | string
  values?: Array<T>
}

const MultipleSelectDiv = styled.div`
  .multipleSelect__indicator-separator {
    background-color: ${({ theme } : any) => theme.navMorkGra};
  }
  .skjemaelement__feilmelding {
    .multipleSelect__control {
      border: 1px solid ${({ theme } : any) => theme.redError};
    }
  }
`

const MultipleSelect: React.FC<MultipleSelectProps<any>> = ({
  ariaLabel, className, creatable = false, disabled = false, error,
  highContrast = false, hideSelectedOptions = false,
  id, isLoading = false, label, onSelect, options = [], placeholder, values = []
}: MultipleSelectProps<any>): JSX.Element => {
  const [_values, setValues] = useState<Array<any>>(values)
  const _theme = highContrast ? themeHighContrast : theme

  const onSelectChange = (e: Array<any>) => {
    if (_.isFunction(onSelect)) {
      onSelect(e)
    }
    setValues(e)
  }

  const Component: typeof React.Component = creatable ? CreatableSelect : Select
  const inputId = id || guid()

  return (
    <ThemeProvider theme={_theme}>
      <MultipleSelectDiv
        id={id}
        className={classNames(className, { skjemaelement__feilmelding: error })}
      >
        <label className='skjemaelement__label' htmlFor={inputId}>{label}</label>
        <Component
          id={id ? id + '-select' : null}
          className='multipleSelect'
          classNamePrefix='multipleSelect'
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled}
          isMulti
          isLoading={isLoading}
          animatedComponents
          closeMenuOnSelect={false}
          value={_values}
          options={options}
          selectProps={{
            theme: _theme
          }}
          components={{
            ...animatedComponents,
            Option: MultipleOption,
            MultiValueRemove: MultipleValueRemove,
            MultiValueLabel: MultipleValueLabel
          }}
          onChange={onSelectChange}
          hideSelectedOptions={hideSelectedOptions || false}
          styles={{
            control: (styles: any) => ({
              ...styles,
              borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
              borderColor: _theme.type === 'themeHighContrast' ? _theme.white : _theme.navGra60,
              borderStyle: 'solid',
              color: _theme['main-font-color'],
              backgroundColor: _theme['main-background-color']
            }),
            multiValue: (styles: any) => ({
              ...styles,
              borderRadius: '20px',
              borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
              borderColor: _theme.type === 'themeHighContrast' ? _theme.white : _theme.navGra60,
              borderStyle: 'solid',
              padding: '0.25rem',
              backgroundColor: _theme['main-background-other-color'],
              color: _theme['main-font-color'],
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center'
            }),
            singleValue: (styles: any) => ({
              ...styles,
              color: _theme['main-font-color']
            }),
            menu: (styles: any) => ({
              ...styles,
              zIndex: 500
            }),
            menuList: (styles: any) => ({
              ...styles,
              borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
              borderColor: _theme.type === 'themeHighContrast' ? _theme.white : _theme.navGra60,
              borderStyle: 'solid',
              backgroundColor: _theme['main-background-color']
            }),
            option: (styles: any, { isFocused, isSelected }: any) => ({
              ...styles,
              padding: '0.5rem',
              color: isFocused
                ? _theme['main-background-color']
                : isSelected
                  ? _theme['main-background-color']
                  : _theme['main-font-color'],
              backgroundColor: isFocused
                ? _theme['main-focus-color']
                : isSelected
                  ? _theme['main-interactive-color']
                  : _theme['main-background-color']
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
    </ThemeProvider>
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
  values: PT.array.isRequired
}
export default MultipleSelect
