FROM navikt/java:8

COPY build/libs/eessi-fagmodul-frontend*.jar /app/app.jar

ENV JAVA_OPTS -Dspring.profiles.active=prod
