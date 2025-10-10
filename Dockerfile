FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /app
ARG GITHUB_TOKEN
COPY .npmrc .npmrc
COPY package.json .
COPY package-lock.json .
RUN npm ci --omit=dev && npm prune --production
COPY server.mjs server.mjs
COPY build build/

CMD ["node", "./server.mjs"]

EXPOSE 8080
