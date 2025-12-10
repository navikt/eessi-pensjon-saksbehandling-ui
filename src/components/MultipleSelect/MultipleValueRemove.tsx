import { XMarkOctagonFillIcon } from '@navikt/aksel-icons'
import styles from './MultipleValueRemove.module.css'

const MultipleValueRemove = (props: any) => {
  const { isDisabled, innerProps } = props

  const visibility = isDisabled ? 'hidden' : 'visible'
  return (
    <div
      {...innerProps}
      style={{}}
      data-testid='c-multipleselect-multiplevalueremove'
      className={styles.flexDiv}
    >
      <XMarkOctagonFillIcon style={{ visibility }} />
    </div>

  )
}
export default MultipleValueRemove
