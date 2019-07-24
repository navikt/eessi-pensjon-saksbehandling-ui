import React from 'react'
import Icons from 'components/Icons'
import { components } from 'react-select'
const MultipleValueRemove = (props) => {
  return <components.MultiValueRemove {...props} className='c-multipleSelect-multipleValueRemove'>
    <Icons kind='close' />
  </components.MultiValueRemove>
}

export default MultipleValueRemove
