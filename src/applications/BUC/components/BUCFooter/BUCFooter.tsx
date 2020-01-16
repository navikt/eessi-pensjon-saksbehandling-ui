import classNames from 'classnames'
import { RinaUrlPropType, TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { RinaUrl, T } from 'declarations/types'
import './BUCFooter.css'

export interface BUCFooterProps {
  className ?: string;
  rinaUrl?: RinaUrl;
  t: T
}

const BUCFooter: React.FC<BUCFooterProps> = ({
  className, rinaUrl, t
}: BUCFooterProps): JSX.Element => (
  <div className={classNames('a-buc-c-footer', className)}>
    <Ui.Nav.Lenke
      id='a-buc-c-buclist__gotorina-link'
      className='a-buc-c-buclist__gotorina'
      href={rinaUrl}
      target='rinaWindow'
    >
      <div className='d-flex'>
        <Ui.Icons className='mr-2' color='#0067C5' kind='outlink' />
        <span>{t('ui:goToRina')}</span>
      </div>
    </Ui.Nav.Lenke>
  </div>
)

BUCFooter.propTypes = {
  className: PT.string,
  rinaUrl: RinaUrlPropType,
  t: TPropType.isRequired
}
export default BUCFooter
