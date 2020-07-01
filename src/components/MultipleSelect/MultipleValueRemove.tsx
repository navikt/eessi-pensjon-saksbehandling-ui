import React from 'react'
import { components } from 'react-select'
import { MultiValueRemoveProps } from 'react-select/src/components/MultiValue'
import FilledRemoveCircle from 'assets/icons/filled-version-remove-circle'

const MultipleValueRemove = (props: MultiValueRemoveProps<any>) => (
  <components.MultiValueRemove {...props} className='c-multipleSelect-multipleValueRemove'>
    <FilledRemoveCircle />
  </components.MultiValueRemove>
)

export default MultipleValueRemove
