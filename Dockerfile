FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY node_modules/ node_modules/
COPY migrateEnvVars.mjs migrateEnvVars.mjs

COPY server.mjs server.mjs
COPY build build/

##CMD ["node", "./migrateEnvVars.mjs"]
ENTRYPOINT ["node", "migrateEnvVars.mjs"]
#COPY /app/tmp/.env .env
CMD ["node", "./server.mjs"]

EXPOSE 8080
