EESSI Pensjon Fagmodul Frontend
===============================

This project has:
* A frontend module, in `src/main/js`, that uses [React](https://reactjs.org) and [Node](https://nodejs.org).
* A backend module, in `src/main/kotlin` that uses Kotlin.

## Development with Hot reloading

Make sure you have ADEO_MAVEN_URL, ADEO_MEVEN_USERNAME and ADEO_MAVEN_PASSWORD in your env.
Run in your IDE the `Application.kt` file with VM options `-Dspring.profiles.active=local`.

It will start the service in port 8080.

Now go to src/main/js, run `npm install` if never ran before (or if there is package changes).
Run also `npm run less` if there is no CSS files, to create them.

The `"proxy": "http://localhost:8080"` directive on package.json proxy-passes React ajax calls to the server at port 8080.

Run `run-dev.sh` or `run-dev.bat`. It starts React UI on port 3000
(to change, do `set PORT={wantedPort}` before in Windows, or `export PORT={wantedPort}` in Linux/Mac).

Open `http://localhost:3000/` for the homepage.

Any changes made to React files will trigger a reload. API access is still working.

## Production

Go to src/main/js, run `npm install` if never ran before (or if there is package changes).
Run `npm run build`. It will run less, compile the frontend, and copy everything into a resources folder.

Run ``Application.kt` as described above. Open `http://localhost:8080/` for the homepage.

## Running unit tests

Run `npm run test` to execute the Selenium unit tests.

Make sure you have the latest chromedriver.exe on the PATH so that Selenium can launch Chrome.

## Linting

Run `npm run lint` for linting the JS files.

## Troubleshoot

### backend complains about certificate access to other 3rd party https urls

On any page of https://(.*).nais.preprod.local, click on the certificate, download it as a file (say C:\Temp\nais-preprod.cer)

Launch the kse explorer, the JAR executable file (at F:\programvare\kse-51), load cacerts from your JAVA_HOME\lib\security.

Import the downloaded certificate into cacerts, save it (if you don't have permissions, save it in Temp, then copy over).

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan rettes mot:

* David Steinsland, david.steinsland@nav.no

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #eessi-pensjonpub.
