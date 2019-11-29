import classNames from 'classnames'
import { Icons, Nav } from 'eessi-pensjon-ui'
import PT from 'prop-types'
import React from 'react'
import { RinaUrl, T } from 'types'
import './BUCFooter.css'

export interface BUCFooterProps {
  className ?: string;
  rinaUrl?: RinaUrl;
  t: T
}

const BUCFooter = ({ className, rinaUrl, t }: BUCFooterProps) => (
  <div className={classNames('a-buc-c-footer', className)}>
    <Nav.Lenke
      id='a-buc-c-buclist__gotorina-link'
      className='a-buc-c-buclist__gotorina'
      href={rinaUrl}
      target='rinaWindow'
    >
      <div className='d-flex'>
        <Icons className='mr-2' color='#0067C5' kind='outlink' />
        <span>{t('ui:goToRina')}</span>
      </div>
    </Nav.Lenke>
  </div>
)

BUCFooter.propTypes = {
  className: PT.string,
  rinaUrl: PT.string.isRequired,
  t: PT.func.isRequired
}
export default BUCFooter
