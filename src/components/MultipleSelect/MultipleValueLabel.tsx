import React from 'react'
import { components } from 'react-select'
import { MultiValueGenericProps } from 'react-select/src/components/MultiValue'

const MultipleValueLabel = (props: MultiValueGenericProps<any>) => (
  <components.MultiValueLabel {...props} className='c-multipleSelect-multipleValueLabel'>
    <div className='label'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{props.data.label}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  </components.MultiValueLabel>
)

export default MultipleValueLabel
