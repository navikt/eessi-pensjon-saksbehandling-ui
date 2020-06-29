import React from 'react'
import { components } from 'react-select'
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue'
import Icons from '../Icons/Icons'

const MultipleValueRemove = (props: MultiValueRemoveProps<any>) => (
  <components.MultiValueRemove {...props} className='c-multipleSelect-multipleValueRemove'>
    <Icons kind='close' />
  </components.MultiValueRemove>
)

export default MultipleValueRemove
