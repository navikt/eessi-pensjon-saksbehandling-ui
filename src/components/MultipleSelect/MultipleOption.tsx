import PT from 'prop-types'
import { Checkbox } from 'nav-frontend-skjema'
import styled from 'styled-components'
import NavHighContrast, { themeKeys } from 'nav-hoykontrast'
import { components, OptionProps } from 'react-select'
import { O } from 'declarations/app.d'

export interface MultipleOptionProps<T> extends OptionProps<T, true> {
  highContrast: boolean
  id: string | undefined
}

const OptionCheckbox = styled(Checkbox)`
   &:not(:disabled) {
     cursor: pointer
   }
   label {
      &:hover {
       color: ${({ theme }) => theme[themeKeys.INVERTED_FONT_COLOR]} !important;
     }
   }
`

const MultipleOption = <T extends O = O>(props: MultipleOptionProps<T>): JSX.Element => {
  const { data, id, highContrast, isSelected } = props
  const _id: string = (id ?? '') + '-' + data.value

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
    <components.Option {...props}>
      <NavHighContrast highContrast={highContrast}>
        <OptionCheckbox
          data-test-id={'c-multipleoption__checkbox-' + _id}
          id={'c-multipleoption__checkbox-' + _id}
          label={data.label}
          onChange={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          checked={isSelected}
        />
      </NavHighContrast>
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
