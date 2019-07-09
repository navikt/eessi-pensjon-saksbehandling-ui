import React from 'react'
import { Hovedknapp, Panel } from 'components/ui/Nav'
import SEDStart from 'applications/BUC/components/SEDStart/SEDStart'

const SEDNew = (props) => {
  const { t, actions } = props

  const onBUCList = () => {
    actions.resetBuc()
    actions.setMode('list')
  }

  return <React.Fragment>
    <div className='a-buc-buclist__buttons mt-3 mb-3'>
      <Hovedknapp onClick={onBUCList}>{t('ui:back')}</Hovedknapp>
    </div>
    <Panel>
      <SEDStart {...props} />
    </Panel>
  </React.Fragment>
}

export default SEDNew
