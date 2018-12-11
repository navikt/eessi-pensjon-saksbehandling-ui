import React from 'react'
export default () => <div id='header'>
  <div class='hodefot'>
    <header class='siteheader' role='banner'>
      <div class='site-coltrols-toolbar site-controls-toolbar'>
        <div class='container'>
          <div class='row navbar'>
            <div class='col-md-12'>
              <div class='settings'>
                <ul class='nav'>
                  <li id='text-size-accessibility' tabindex='0'>
                    <span class='link-btn' aria-label='Hold Ctrl-tasten nede (Cmd-tasten på Mac). Trykk samtidig på + for å forstørre eller - for å forminske.'>Skriftstørrelse</span>
                    <div class='text-size-tooltip hidden'>
                      <p>Hold Ctrl-tasten nede (Cmd-tasten på Mac). Trykk samtidig på + for å forstørre eller - for å forminske.</p>
                      <span class='arrow' />
                    </div>
                  </li>
                </ul>
              </div>
              <div class='login-container'>
                <div id='login-details' class='hidden'>
                  <span id='name-container'>
                    <img id='idporten-ikon-innlogging' alt='Innlogget via ID-porten' src='https://appres-t1.nav.no/_public/beta.nav.no/built-navno/img/navno/gfx/icons/idporten_ikon.png?_ts=165b436fbf8' />
                    <span id='name' />
                  </span>
                  <div class='logout-tooltip hidden'>
                    <a href='' onClick={e => e.preventDefault()} class='lukk hidden' aria-label='Lukk informasjon om logg ut'> × </a>
                    <p>Du er logget inn på alle offentlige tjenester med ID-porten.</p>
                    <p> Husk å <strong>logge ut</strong> når du er ferdig.</p>
                    <span class='arrow' />
                  </div>
                </div>
                <div id='auth-btns'>
                  <a id='login' class='hidden knapp mini btn-auth btn-login' href='https://tjenester-t1.nav.no/esso/UI/Login?goto=https://tjenester-t1.nav.no/dittnav&amp;service=level4Service'>Logg inn</a>
                  <a id='logout' data-ga='Header' class='hidden btn-auth knapp mini hoved btn-logout' href='https://tjenester-q0.nav.no/test-logout/'>Logg ut</a>
                </div>
                <div class='login-tooltip hidden'>
                  <p>Logg inn på Ditt NAV</p>
                  <span class='arrow' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='sitelogo sitelogo-large'>
        <div class='container'>
          <a href='https://www-t1.nav.no' title='Hjem' data-ga='Header/Logo'>
            <img src='https://appres-t1.nav.no/_public/beta.nav.no/images/logo.png?_ts=1512923c9b0' alt='NAV-logo' />
          </a>
        </div>
      </div>
      <div class='sitelogo sitelogo-small'>
        <a href='https://www-t1.nav.no' title='Hjem'>
          <img src='https://appres-t1.nav.no/_public/beta.nav.no/images/logo.png?_ts=1512923c9b0' alt='NAV-logo' />
        </a>
      </div>
    </header>
  </div>
</div>
