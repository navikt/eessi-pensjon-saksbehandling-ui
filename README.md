# EessiFagmodulFrontend

This project has:
* A frontend module, in `src/main/js`, that uses [React](https://reactjs.org) and [Node](https://nodejs.org).
* A backend module, in `src/main/kotlin` that uses Kotlin.

## Development React UI, development node server

This is the best setup for development of React UI and the node server.

First, run `npm install`. 

Run `run-dev-react.sh` or `run-dev-react.bat`. It starts React UI on port 3000.

Run `run-dev-node.sh` or `run-dev-node.bat`. It starts node server on port 80, with no connection to 3rd party services. 
The node server will return sample responses for development purposes only.

The proxy directive on package.json proxy-passes React ajax calls to the node server at port 80.
This way, React app at port 3000 can still be hot-changed and be able to use node API in a dev environment.
 
Open `http://localhost:3000/` for the React homepage.

## Development React UI, production node server

This is the best setup for integration development of the node server against 3rd party services.

First, run `npm install`. 

Run `run-dev-react.sh` or `run-dev-react.bat`. It starts React UI on port 3000.

Run `run-prod.sh` or `run-prod.bat`. It starts node server on port 80, with connection to 3rd party services. 

Open `http://localhost:3000/` for the React homepage.

## Production

This is the best setup for production, but can also be launched locally.

First, run `npm install`. 

Run `npm run build` to compact React project for production. 
The build files will be placed in the `build/` directory.

Run `run-prod.sh` or `run-prod.bat`. It starts the node server on port 80, with connection to 3rd party services. 
The node server will connect to OAuth2 and other 3rd party services.

Open `http://localhost:80/` for the React webpage.

## Running unit tests

Run `npm run test` to execute the unit tests.

## Linting

Run `npm run lint` for linting the JS files.
