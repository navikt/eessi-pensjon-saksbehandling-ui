EESSI Pensjon Frontend UI
===============================

This is the web application module for the EESSI Penjson, developed in [ReactJS](https://reactjs.org).

## INSTALL 

run `npm install` if it's the first time you run this app, or everytime there is some code changes.

## TEST

There are only Selenium tests for now.

Make sure you have the latest chromedriver.exe on the PATH so that Selenium can launch Chrome.

You run tests with `./run-test.sh [testName]` (Mac/Linux), where `testName` is the js filename (without .js) under the tests folder.

## LINT

Run `run-lint.bat` (Windows) or `./run-lint.sh` (Mac/Linux) to lint the code.

## RUN 

Make sure you have the eessi-pensjon-frontend-api application running on port 8080.

Note: The `"proxy": "http://localhost:8080"` directive on package.json proxy-passes AJAX calls to this server at port 8080.
If you change the eessi-pensjon-frontend-api application port, thne change this line in package.json.

### Development with Hot reloading

Run `run-dev.sh` or `run-dev.bat`. This command will run 'npm run start:*' scripts, 
and start the app on port 3000
(to change, do `set PORT={wantedPort}` before in Windows, or `export PORT={wantedPort}` in Linux/Mac).

Open `http://localhost:3000/` in a browser, if it didn't open one already.

Any changes made to JS, CSS and LESS files will trigger a page reload.

### Production

Run  `run-build.bat` (Windows) or `./run-build.sh` (Mac/Linux). It will compile less and JS code, and build a minimized package ready for production deployment.

### Docker

The apps docker image builds on [pus-decorator](https://github.com/navikt/pus-decorator). Use Dockerfile_sbs and Dockerfile_fss to build images for sbs and fss respectively. The dockerfiles sets some options as defined in [pus-decorator-README](https://github.com/navikt/pus-decorator/blob/master/README.md).
The image uses the proxy_[fss/sbs].json files to define proxy paths to eessi-pensjon-frontend-api-[fss/sbs].


## Troubleshoot

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #eessi-pensjonpub.
