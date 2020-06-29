import classNames from 'classnames'
import Icons from 'components/Icons/Icons'
import { RinaUrl } from 'declarations/types'
import { linkLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import Lenke from 'nav-frontend-lenker'
import './BUCFooter.css'

export interface BUCFooterProps {
  className ?: string;
}

export interface BUCFooterSelector {
  rinaUrl: RinaUrl | undefined
}

const mapState = (state: State): BUCFooterSelector => ({
  rinaUrl: state.buc.rinaUrl
})
const BUCFooter: React.FC<BUCFooterProps> = ({
  className
}: BUCFooterProps): JSX.Element => {
  const { t } = useTranslation()
  const { rinaUrl }: BUCFooterSelector = useSelector<State, BUCFooterSelector>(mapState)
  if (!rinaUrl) {
    return <div />
  }
  return (
    <div className={classNames('a-buc-c-footer', className)}>
      <Lenke
        data-amplitude='buc.list.rinaurl'
        id='a-buc-c-buclist__gotorina-link'
        className='a-buc-c-buclist__gotorina'
        href={rinaUrl}
        target='rinaWindow'
        onClick={linkLogger}
      >
        <div className='d-flex'>
          <Icons className='mr-2' color='#0067C5' kind='outlink' />
          <span>{t('ui:goToRina')}</span>
        </div>
      </Lenke>
    </div>
  )
}

BUCFooter.propTypes = {
  className: PT.string
}
export default BUCFooter
