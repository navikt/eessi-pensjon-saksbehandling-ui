import classNames from 'classnames'
import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import MultipleValueRemove from 'components/MultipleSelect/MultipleValueRemove'
import _ from 'lodash'
import { Feilmelding } from 'nav-frontend-typografi'
import { guid } from 'nav-frontend-js-utils'
import PT from 'prop-types'
import React, { useState } from 'react'
import Select, { ValueType } from 'react-select'
import makeAnimated from 'react-select/animated'
import CreatableSelect from 'react-select/creatable'
import { SelectComponents } from 'react-select/src/components'
import MultipleOption from './MultipleOption'
import './MultipleSelect.css'

const animatedComponents: SelectComponents<any> = makeAnimated()

export interface MultipleSelectProps<T> {
  ariaLabel ?: string;
  className ?: string;
  creatable ?: boolean;
  disabled ?: boolean;
  error ?: string;
  hideSelectedOptions ?: boolean;
  id ?: string;
  isLoading?: boolean;
  label: string | JSX.Element;
  onSelect?: (e: ValueType<any>) => void;
  options?: Array<T>;
  placeholder?: JSX.Element | string;
  values?: Array<T>;
}

const MultipleSelect: React.FC<MultipleSelectProps<any>> = ({
  ariaLabel, className, creatable = false, disabled = false, error, hideSelectedOptions = false,
  id, isLoading = false, label, onSelect, options = [], placeholder, values = []
}: MultipleSelectProps<any>): JSX.Element => {
  const [_values, setValues] = useState<Array<any>>(values)

  const onSelectChange = (e: Array<any>) => {
    if (_.isFunction(onSelect)) {
      onSelect(e)
    }
    setValues(e)
  }

  const selectStyle = () => ({
    container: (styles: any, state: any) => ({
      ...styles,
      backgroundColor: error ? '#BA3A26' : '#fff',
      borderRadius: 4,
      borderColor: error ? '1 px solid #ba3a26' : '20px solid #b7b1a9',
      boxShadow: state.isFocused ? '0 0 0 3px #FFBD66' : (error ? '0 0 0 1px #BA3A26' : '')
    }),
    control: (styles: any) => ({
      ...styles,
      borderColor: error ? '#ba3a26' : '#b7b1a9',
      backgroundColor: '#fff',
      ':hover': {
        borderColor: '#0067c5',
        transition: 'border-color 200ms cubic-bezier(0.465, 0.183, 0.153, 0.946)'
      }
    })
  })

  const Component: typeof React.Component = creatable ? CreatableSelect : Select
  const inputId = id || guid()

  return (
    <div
      id={id}
      className={classNames('c-multipleSelect', className, { skjemaelement__feilmelding: error })}
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
        components={{
          ...animatedComponents,
          Option: MultipleOption,
          MultiValueRemove: MultipleValueRemove,
          MultiValueLabel: MultipleValueLabel
        }}
        onChange={onSelectChange}
        hideSelectedOptions={hideSelectedOptions || false}
        styles={selectStyle()}
        tabSelectsValue={false}
      />

      {error
        ? (
          <div role='alert' aria-live='assertive' className='feilmelding skjemaelement__feilmelding'>
            <Feilmelding>{error}</Feilmelding>
          </div>
        )
        : null}
    </div>
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
