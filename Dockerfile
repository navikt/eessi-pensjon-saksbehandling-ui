FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY node_modules/ node_modules/
COPY migrateEnvVars.mjs migrateEnvVars.mjs
COPY server.mjs server.mjs
COPY build build/

RUN chmod +x entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
