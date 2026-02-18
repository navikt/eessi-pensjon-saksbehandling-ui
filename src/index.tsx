
import RequireAuth from 'src/components/RequireAuth/RequireAuth'
import 'core-js/stable'
import '@navikt/ds-css'
import Pages from 'src/pages'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import i18n from './i18n'

import store from './store'
import {GJENNY, PESYS} from "./constants/constants";
import {pdfjs} from "react-pdf";
import { HelmetProvider, Helmet } from '@dr.pogodin/react-helmet';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)
root.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <Suspense fallback={<span>...</span>}>
        <BrowserRouter>
          <HelmetProvider>
            <Helmet>
              <script
                defer
                src="https://cdn.nav.no/team-researchops/sporing/sporing.js"
                data-host-url="https://umami.nav.no"
                data-website-id="0237dde0-bca5-4cce-ad72-236e1365dd3f"
                data-domains="pensjon-utland-q2.intern.dev.nav.no"
              >
              </script>
          </Helmet>
          </HelmetProvider>
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
    </Provider>
  </I18nextProvider>
)
