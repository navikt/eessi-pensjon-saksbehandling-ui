import Loadable from 'react-loadable'
import { WaitingPanel } from 'eessi-pensjon-ui'

const MyLoadable = (opts: any) => {
  return Loadable(Object.assign({
    loading: WaitingPanel,
    delay: 200,
    timeout: 10000
  }, opts))
}
export default MyLoadable
