FROM navikt/pus-decorator
ENV APPLICATION_NAME=eessipen
ENV PUBLIC_ZONE=fss
ENV DISABLE_FRONTEND_LOGGER=true
ENV DISABLE_DECORATOR=true
ENV DISABLE_UNLEASH=true
COPY /build /app
ADD decorator.yaml /decorator.yaml
