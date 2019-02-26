EESSI Pensjon Frontend UI
===============================

This is the frontend part of the EESSI Penjson web application, developed in [ReactJS](//reactjs.org).

## INSTALL 

run `npm install` if you just cloned this repo, or everytime there is some code changes.

## TEST

Cucumber/Selenium tests are [on a separate repository, EESSI-Pensjon aotomatic tests](//github.com/navikt/eessi-pensjon-automatic-tests)

Run tests with `./run-test.sh` (Mac/Linux) or `run-test.bat` (Windows).

For coverage report, add a '--coverage' argument.

## LINT

Run `./run-lint.sh` (Mac/Linux) or `run-lint.bat` (Windows) to lint the code.

## RUN 

First, make sure you have an [instance of EESSI-Pensjon frontend API](//github.com/navikt/eessi-pensjon-frontend-api) running on port 8080. If you want to use another port, change the `"proxy": "http://localhost:8080"` directive on package.json.

In order to browse the webapp, you need a valid authentication token. 

### Run in development environment, with hot reloading

Run `run-dev.sh` (Mac/Linux) or `run-dev.bat` (Windows). This will launch a webpack server on port 3000 and launch a brower window/tab. *Note*: To change default port, do `set PORT={wantedPort}` (Windows) or `export PORT={wantedPort}` (Linux/Mac). 

Any changes made to code files will trigger a page reload.

### Run in production environment

Run `./run-build.sh` (Mac/Linux) or `run-build.bat` (Windows). It will process LESS, compact JS code and build a minimized package ready for production.

Now, point your browser to the build/ folder, it should load the index.html page.

### Docker

The apps docker image builds on [pus-decorator](https://github.com/navikt/pus-decorator). Use Dockerfile_sbs and Dockerfile_fss to build images for sbs and fss respectively. The dockerfiles sets some options as defined in [pus-decorator-README](https://github.com/navikt/pus-decorator/blob/master/README.md).
The image uses the proxy_[fss/sbs].json files to define proxy paths to eessi-pensjon-frontend-api-[fss/sbs].

## Troubleshoot

None at the moment

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #eessi-pensjonpub.
