FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY node_modules/ node_modules/
COPY migrateEnvVars.cjs .
#ENTRYPOINT ["node", "migrateEnvVars.cjs"]
CMD ["node", "./migrateEnvVars.cjs"]
COPY server.mjs server.mjs
COPY build build/

CMD ["node", "./server.mjs"]

EXPOSE 8080
