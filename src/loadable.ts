import Loadable from 'react-loadable'
import Ui from 'eessi-pensjon-ui'

const MyLoadable = (opts: any) => {
  return Loadable({
    ...opts,
    loading: Ui.WaitingPanel,
    delay: 200,
    timeout: 10000
  })
}
export default MyLoadable
