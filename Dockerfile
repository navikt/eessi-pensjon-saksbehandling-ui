FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY node_modules/ node_modules/
COPY server.mjs server.mjs
COPY build build/

RUN npm r -g npm

CMD ["node", "./server.mjs"]

EXPOSE 8080
