#!/bin/sh

node migrateEnvVars.mjs

exec node ./server.mjs
