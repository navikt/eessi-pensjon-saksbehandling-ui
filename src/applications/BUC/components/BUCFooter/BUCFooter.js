import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { Icons, Nav } from 'eessi-pensjon-ui'
import './BUCFooter.css'

const BUCFooter = ({ className, rinaUrl, t }) => (
  <div className={classNames('a-buc-footer', className)}>
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
