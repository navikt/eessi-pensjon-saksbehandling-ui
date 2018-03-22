FROM node:8.9.4-alpine

EXPOSE 80
WORKDIR /app

COPY package.json package-lock.json .npmrc /app/
COPY dist /app/dist/
COPY node_modules /app/node_modules

CMD ["npm", "run", "start_express"]
