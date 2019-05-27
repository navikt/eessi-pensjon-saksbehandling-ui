import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import MultipleOption from './MultipleOption'
import MultipleValueRemove from './MultipleValueRemove'
import './MultipleSelect.css'

const MultipleSelect = (props) => {
  const [ _values, setValues ] = useState([])
  const [ mounted, setMounted ] = useState(false)

  const {
    id,
    placeholder,
    values,
    creatable = false,
    includeList,
    excludeList,
    optionList = [],
    className,
    error = false,
    components,
    errorMessage,
    onChange,
    hideSelectedOptions
  } = props

  useEffect(() => {
    if (!mounted) {
      setValues(values)
      setMounted(true)
    }
  }, [values, mounted])

  const include = (selectedValues, allValues) => {
    return _.filter(allValues, it => {
      return selectedValues.indexOf(it.value) >= 0
    })
  }

  const exclude = (selectedValues, allValues) => {
    return _.filter(allValues, it => {
      return selectedValues.indexOf(it.value) < 0
    })
  }

  const _onChange = (args) => {
    setValues(args)
    if (typeof onChange === 'function') {
      onChange(args)
    }
  }

  const selectStyle = () => {
    return {
      container: (styles, state) => {
        let { boxShadow, ...rest } = styles
        return {
          ...rest,
          backgroundColor: error ? '#f3e3e3' : '#fff',
          borderRadius: 4,
          borderColor: error ? '1 px solid #ba3a26' : '20px solid #b7b1a9',
          boxShadow: state.isFocused ? '0 0 0 3px #254b6d' : ''
        }
      },
      control: (styles, state) => {
        let { boxShadow, ...rest } = styles
        return {
          ...rest,
          borderColor: error ? '#ba3a26' : '#b7b1a9',
          backgroundColor: error ? '#f3e3e3' : '#fff',
          ':hover': {
            borderColor: '#0067c5',
            transition: 'border-color 200ms cubic-bezier(0.465, 0.183, 0.153, 0.946)'
          }
        }
      }
    }
  }

  let options = includeList ? include(includeList, optionList) : optionList
  options = excludeList ? exclude(excludeList, options) : options

  return <div id={id} className={classNames('c-ui-multipleSelect', className, { 'skjemaelement__feilmelding': error })}>
    {creatable
      ? <CreatableSelect placeholder={placeholder}
        isMulti
        closeMenuOnSelect={false}
        defaultValue={_values}
        options={options}
        id={id ? id + '-select' : null}
        components={{
          Option: MultipleOption,
          MultiValueRemove: MultipleValueRemove,
          ...components }}
        className='multipleSelect'
        classNamePrefix='multipleSelect'
        onChange={_onChange}
        hideSelectedOptions={hideSelectedOptions || false}
        styles={selectStyle()}
        tabSelectsValue={false}
      />
      : <Select placeholder={placeholder}
        isMulti
        closeMenuOnSelect={false}
        defaultValue={_values}
        options={options}
        id={id ? id + '-select' : null}
        components={{
          Option: MultipleOption,
          MultiValueRemove: MultipleValueRemove,
          ...components }}
        className='multipleSelect'
        classNamePrefix='multipleSelect'
        onChange={_onChange}
        hideSelectedOptions={hideSelectedOptions || false}
        styles={selectStyle()}
        tabSelectsValue={false}
      />}
    {error
      ? <div role='alert' aria-live='assertive'>
        <div className='skjemaelement__feilmelding'>
          {errorMessage}
        </div>
      </div>
      : null
    }
  </div>
}

MultipleSelect.propTypes = {
  onChange: PT.func.isRequired,
  value: PT.oneOfType([PT.object, PT.string]),
  style: PT.object,
  includeList: PT.array,
  excludeList: PT.array,
  optionList: PT.array,
  className: PT.string,
  required: PT.string,
  id: PT.string,
  inputProps: PT.object,
  customInputProps: PT.object,
  errorMessage: PT.string,
  styles: PT.object,
  error: PT.bool,
  components: PT.object,
  creatable: PT.bool
}

export default MultipleSelect
