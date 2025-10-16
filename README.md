![](https://github.com/navikt/eessi-pensjon-saksbehandling-ui/workflows/Bygg%20og%20deploy%20Q2/badge.svg)
![](https://github.com/navikt/eessi-pensjon-saksbehandling-ui/workflows/Manuell%20deploy/badge.svg)


EESSI Pensjon Saksbehandling UI
===============================

This is the EESSI Pensjon web application for saksbehandlers, developed in [ReactJS](//reactjs.org).

## TL;DR

    git clone git@github.com:navikt/eessi-pensjon-saksbehandling-ui.git 
    npm install
    
    If you work on a mac:
        npm i -S fsevents 
    npm run start

## SETUP

Make sure you have installed: 

* [Git](//git-scm.com)
* [Node.js](//nodejs.org) 
* [NPM](//npmjs.com) (normally comes with the Node.js package above)

Also, make sure you have read access to [github.com/navikt](//github.com/navikt)

##  Legg til .npmrc
Lag et personlig access token på github: https://github.com/settings/tokens/new

Oppdaterer .npmrc filen med det nye tokenet
@navikt:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=ghp_DITT_PERSONLIG_TOKEN

## DOWNLOAD

To clone this repo, go into your local working directory, and run (HTTPS) 

    git clone https://github.com/navikt/eessi-pensjon-saksbehandling-ui.git
    
or (GIT+SSH)
    
    git clone git@github.com:navikt/eessi-pensjon-saksbehandling-ui.git 

With HTTPS you may have to provide username/password, with git+ssh your private key can be used for authentication.

You should see a {workDir}/eessi-pensjon-saksbehandling-ui directory with the source code. 

## INSTALL 

Installing reads `package.json` and `package-lock.json` to gather all dependency modules, downloads them from npm repository site and saves them in `node_modules` directory.
 
To install, run: 

    npm install
     
if you just cloned this repository, or everytime there is code update that changes `package.json` or `package-lock.json`. This commend installs the dependencis for the project. 

`package.json` is the file where project dependencies (and dev dependencies) are listed.

`package-lock.json` is the file that locks dependency versions into this project's version.

In the end, you should see a npm summary output with all dependency packages installed, and an audit report. 

## AUDIT 

This step is optional and not necessary if you are planning to do only local development. 

If you are planning to do a production build, it is recommended to run npm audit to check if all 3rd party dependencies have no vulnerabilities.

To run the audit, do:

    npm audit 
 
Ideally it should output:  

    found 0 vulnerabilities
    
If vulnerabilites are found, run:
    
    npm audit fix     

If the vulnerabilities can't be fixed, npm lists them and tells the user to solve them manually. 

This happens when the other libraries depend on a (now vulnerable) dependency version, but the library author hasn't updated it yet.

To circumvent that, we can force npm to ignore that specified (and vulnerable) version and install instead a different version. 

To do that, check `package.json` for a `resolutions` key and add the dependency package. For example: 
  
     "resolutions": {
         "acorn": "^7.1.1",
         "minimist": "1.2.3",
         "extend": "3.0.2",
         "cryptiles": "4.1.2"
     }

Is telling npm to install the 3.0.2 version of the `extend` library, even if somewhere in the `package-lock.json` there 
is a dependency that requires a difference version. 

To Perform these overrides, run: 

    npm run npx

## TEST

Run tests with
 
    npm run test
    
This runs all tests in watch mode, that is, after all tests finished the console is watching for changes in code so it can re-run tests again. 

To run a subset of tests, add a pattern on the -t flag, as in
 
    npm run test -t actions/buc
    
For coverage report, run
 
    npm run test:coverage
    
Coverage tests don't run in watch mode.

## RUN 

To start the app locally in development mode, run 
     
    npm run start
     
This will launch a webpack server on port 3000 and launch a window/tab in your predefined browser.

Code will run in watch mode, so any changes made to code files will trigger a page reload.
 
If you want to change the default port, add as a env var (Windows)
 
    set PORT={wantedPort}
     
or (Linux/Mac)

    export PORT={wantedPort}

### BUILD

To build the app ready for production, run 

    npm run build
    
You do not need to do this locally. This is the production version, with minimized code.

Yet, you can see how it looks. Run

    serve -s build

then visit `localhost:5000` to see the production-ready version of this webpage.

## Troubleshoot

If you're on Mac and get a lot of warnings mentioning `gyp: No Xcode or CLT version detected!` try this:

```shell script
sudo rm -rf $(xcode-select -print-path)
xcode-select --install
```

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #eessi-pensjonpub.
