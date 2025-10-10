FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY server.mjs server.mjs
COPY build build/

CMD ["node", "./server.mjs"]

EXPOSE 8080
