import {JSX} from 'react'
import { Checkbox } from '@navikt/ds-react'
import { components, OptionProps } from 'react-select'
import { Option } from 'src/declarations/app.d'
import styles from './MultipleOption.module.css'

export interface MultipleOptionProps<T> extends OptionProps<T, true> {
  id: string | undefined
}

const MultipleOption = <T extends Option = Option>(props: MultipleOptionProps<T>): JSX.Element => {
  const { data, id, isSelected } = props
  const _id: string = (id ?? '') + '-' + data.value

  const Option = components.Option as any
  return (
    <Option {...props}>
      <Checkbox
        data-testid={'c-multipleoption--checkbox-' + _id}
        id={'c-multipleoption--checkbox-' + _id}
        onChange={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        checked={isSelected}
      >
        <span className={styles.label}>{data.label}</span>
      </Checkbox>
    </Option>
  )
}

MultipleOption.displayName = 'MultipleOption'
export default MultipleOption
