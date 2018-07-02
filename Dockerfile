FROM node:8.9.4-alpine

EXPOSE 80
WORKDIR /app

COPY package.json package-lock.json .npmrc src/server src/server.js /app/
COPY build /app/build/
COPY node_modules /app/node_modules

CMD ["npm", "run", "start:prod"]
