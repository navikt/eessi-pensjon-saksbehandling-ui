FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY node_modules/ node_modules/
COPY server server/
COPY build build/

CMD ["node", "./server/server.js"]

EXPOSE 8080
