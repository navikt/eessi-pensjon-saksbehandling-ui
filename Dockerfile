FROM node:8.9.4-alpine

EXPOSE 80

WORKDIR /app
COPY package.json package-lock.json .npmrc /app/

RUN npm install

COPY ./ /app/
RUN npm run build

CMD ["npm", "run", "start_express"]
