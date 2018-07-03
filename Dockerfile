FROM navikt/java:8

COPY build/libs/eessi-fagmodul-frontend*.jar /app/app.jar

# COPY package.json package-lock.json .npmrc src/server.js /app/
# COPY src/server /app/server/
# COPY build /app/build/
# COPY node_modules /app/node_modules
# CMD ["npm", "run", "start:prod"]
