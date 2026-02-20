import RequireAuth from 'src/components/RequireAuth/RequireAuth'
import 'core-js/stable'
import '@navikt/ds-css'
import Pages from 'src/pages'
import {JSX, Suspense, useEffect} from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import {GJENNY, PESYS} from "./constants/constants";
//import {IS_Q} from "src/constants/environment";


const App: React.FC = (): JSX.Element => {

  useEffect(() => {
    //const websiteId = IS_Q ? '0237dde0-bca5-4cce-ad72-236e1365dd3f' : 'fbf07ede-921f-4553-8c13-2570df1b8957'
    //const hostUrl = IS_Q ? 'https://reops-event-proxy.ekstern.dev.nav.no' : 'https://umami.nav.no'

    const script = document.createElement('script')
    script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing.js'
    script.defer = true
    script.setAttribute('data-website-id', '0237dde0-bca5-4cce-ad72-236e1365dd3f')
    script.setAttribute('data-host-url', 'https://reops-event-proxy.ekstern.dev.nav.no')
    script.setAttribute('data-domains', 'pensjon-utland-q2.intern.dev.nav.no')

    document.body.appendChild(script)

    return () => {
      try {
        document.body.removeChild(script)
      } catch {
        /* empty */
      }
    }
  }, [])

  return (
    <Suspense fallback={<span>...</span>}>
      <BrowserRouter>
        <Routes>
          <Route
            path='/' element={
            <RequireAuth>
              <Pages.IndexPage indexType={PESYS}/>
            </RequireAuth>
          }
          />
          <Route
            path='/gjenny' element={
            <RequireAuth context={GJENNY}>
              <Pages.IndexPage indexType={GJENNY}/>
            </RequireAuth>
          }
          />
          <Route
            path='/admin' element={
            <RequireAuth adminOnly={true}>
              <Pages.AdminPage/>
            </RequireAuth>
          }
          />
          <Route path='/notlogged' element={<Pages.Error type='notLogged' />} />
          <Route path='/notinvited' element={<Pages.Error type='notInvited' />} />
          <Route path='/forbidden' element={<Pages.Error type='forbidden' />} />
          <Route path='/*' element={<Pages.Error type='error' />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
