#!/bin/bash
./node_modules/.bin/cucumber-js src/tests/**/*.feature -f ./node_modules/cucumber-pretty --tags $1
