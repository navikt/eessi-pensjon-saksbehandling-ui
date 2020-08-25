import classNames from 'classnames'
import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import MultipleValueRemove from 'components/MultipleSelect/MultipleValueRemove'
import _ from 'lodash'
import { Feilmelding } from 'nav-frontend-typografi'
import { guid } from 'nav-frontend-js-utils'
import { theme, themeKeys, themeHighContrast } from 'nav-styled-component-theme'
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
  menuPortalTarget ?: any,
  onSelect?: (e: ValueType<any>) => void
  options?: Array<T>
  placeholder?: JSX.Element | string
  values?: Array<T>
}

const MultipleSelectDiv = styled.div`
  .skjemaelement__feilmelding {
    .multipleSelect__control {
      border: 1px solid ${({ theme }) => theme.redError};
    }
  }
`

const MultipleSelect: React.FC<MultipleSelectProps<any>> = ({
  ariaLabel, className, creatable = false, disabled = false, error,
  highContrast = false, hideSelectedOptions = false,
  id, isLoading = false, label, menuPortalTarget, onSelect, options = [], placeholder, values = []
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
          menuPortalTarget={menuPortalTarget || document.body}
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
              borderColor: _theme[themeKeys.MAIN_BORDER_COLOR],
              borderStyle: 'solid',
              color: _theme[themeKeys.MAIN_FONT_COLOR],
              backgroundColor: _theme[themeKeys.MAIN_BACKGROUND_COLOR]
            }),
            multiValue: (styles: any) => ({
              ...styles,
              borderRadius: '20px',
              borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
              borderColor: _theme[themeKeys.MAIN_BORDER_COLOR],
              borderStyle: 'solid',
              padding: '0.25rem',
              backgroundColor: _theme[themeKeys.ALTERNATIVE_BACKGROUND_COLOR],
              color: _theme[themeKeys.MAIN_FONT_COLOR],
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center'
            }),
            singleValue: (styles: any) => ({
              ...styles,
              color: _theme[themeKeys.MAIN_FONT_COLOR]
            }),
            indicatorSeparator: (styles: any) => ({
              ...styles,
              backgroundColor: _theme[themeKeys.MAIN_BORDER_COLOR]
            }),
            menu: (styles: any) => ({
              ...styles,
              zIndex: 500
            }),
            menuList: (styles: any) => ({
              ...styles,
              borderWidth: _theme.type === 'themeHighContrast' ? '2px' : '1px',
              borderColor: _theme[themeKeys.MAIN_BORDER_COLOR],
              borderStyle: 'solid',
              backgroundColor: _theme[themeKeys.MAIN_BACKGROUND_COLOR]
            }),
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
                  : _theme[themeKeys.MAIN_BACKGROUND_COLOR]
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
