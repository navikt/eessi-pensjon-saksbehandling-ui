import PT from 'prop-types'
import { Checkbox } from '@navikt/ds-react'
import styled from 'styled-components'
import { components, OptionProps } from 'react-select'
import { Option } from 'src/declarations/app.d'

export interface MultipleOptionProps<T> extends OptionProps<T, true> {
  id: string | undefined
}

const OptionCheckbox = styled(Checkbox)`
   &:not(:disabled) {
     cursor: pointer
   }
   label {
      &:hover {
       color: var(--a-text-on-inverted) !important;
     }
   }
`

const MultipleOption = <T extends Option = Option>(props: MultipleOptionProps<T>): JSX.Element => {
  const { data, id, isSelected } = props
  const _id: string = (id ?? '') + '-' + data.value

  return (
    <components.Option {...props}>
      <OptionCheckbox
        data-testid={'c-multipleoption--checkbox-' + _id}
        id={'c-multipleoption--checkbox-' + _id}
        onChange={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        checked={isSelected}
      >
        {data.label}
      </OptionCheckbox>
    </components.Option>
  )
}

MultipleOption.propTypes = {
  innerProps: PT.any.isRequired,
  isSelected: PT.bool.isRequired,
  isFocused: PT.bool.isRequired
}
MultipleOption.displayName = 'MultipleOption'
export default MultipleOption
