#!/bin/sh

node migrateEnvVars.cjs

exec node ./server.mjs
