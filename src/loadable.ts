import Loadable from 'react-loadable'
import Spinner from 'nav-frontend-spinner'

const MyLoadable = (opts: any) => {
  return Loadable({
    ...opts,
    loading: Spinner,
    delay: 200,
    timeout: 10000
  })
}
export default MyLoadable
