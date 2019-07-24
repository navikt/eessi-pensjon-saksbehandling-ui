import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Checkbox } from 'components/Nav'

const MultipleOption = (props) => {
  const { data, selectProps, innerProps, isSelected, isFocused } = props

  return <div id={selectProps.id + '-' + data.value}>
    <div className={classNames('c-ui-multipleOption', {
      selected: isSelected,
      focused: isFocused
    })} {...innerProps}>
      <Checkbox label={data.label} onChange={() => {}} checked={isSelected} />
    </div>
  </div>
}

MultipleOption.propTypes = {
  data: PT.object,
  selectProps: PT.object,
  innerProps: PT.object,
  isSelected: PT.bool,
  isFocused: PT.bool
}

export default MultipleOption
