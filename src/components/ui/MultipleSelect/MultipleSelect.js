import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import MultipleOption from './MultipleOption'
import SingleValue from './SingleValue'
import MultipleErrorStyle from './MultipleErrorStyle'

import './MultipleSelect.css'

const MultipleSelect = (props) => {

  const [ _values, setValues ] = useState([])
  const [ mounted, setMounted ] = useState(false)

  const {
      id,
      placeholder,
      values,
      locale,
      type,
      includeList,
      excludeList,
      optionList = [],
      className,
      styles = {},
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

  let options = includeList ? include(includeList, optionList) : optionList
  options = excludeList ? exclude(excludeList, options) : options

  return <div id={id} className={classNames('c-ui-multipleSelect', className, { 'skjemaelement__feilmelding': error })}>
    <Select placeholder={placeholder}
      isMulti={true}
      closeMenuOnSelect={false}
      defaultValue={_values}
      options={options}
      id={id ? id + '-select' : null}
      components={{
        Option: MultipleOption,
        SingleValue: SingleValue,
        ...components }}
      className='MultipleSelect'
      classNamePrefix='MultipleSelect'
      onChange={_onChange}
      hideSelectedOptions={hideSelectedOptions || false}
      styles={{ ...styles, ...MultipleErrorStyle(error) }}
      tabSelectsValue={false}
    />
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
  locale: PT.string.isRequired,
  style: PT.object,
  includeList: PT.array,
  excludeList: PT.array,
  optionList: PT.array,
  type: PT.string,
  className: PT.string,
  required: PT.string,
  id: PT.string,
  inputProps: PT.object,
  customInputProps: PT.object,
  errorMessage: PT.string,
  styles: PT.object,
  error: PT.bool,
  components: PT.object
}

export default MultipleSelect
