# EessiFagmodulFrontend

This project was generated with [React](https://reactjs.org) and [Node](https://nodejs.org).

## Development server

First, run `npm install`. 

Run `run-dev.sh` or `run-dev.bat` to start frontend dev server running on port 3000.
Run `run-prod.sh` or `run-prod.bat` to start the frontend API server running on port 80.

The proxy directive on package.json will proxy-pass frontend API calls to the frontend API server.
This way, the dev server at port 3000 can still be hot-changed while still be able to do API calls. 
 
Open `http://localhost:3000/` for the React dev webpage.

## Production server

First, run `npm install`. 

Run `npm run build` to build the project ready for production. 
The build files will be stored in the `build/` directory.

Run `run-prod.sh` or `run-prod.bat` to start the frontend API server running on port 80.
The frontend API server forwards requests to the compiled frontend build/ directory. 

Open `http://localhost:80/` for the React prod webpage.

## Running unit tests

Run `npm run test` to execute the unit tests.

## Linting

Run `npm run lint` for linting the JS files.
