FROM nginx:1.15

COPY default.tmpl /etc/nginx/conf.d/default.tmpl
COPY build/ /usr/share/nginx/html/

CMD /bin/sh -c "envsubst '\${EESSIPENSJONFRONTENDAPI_V1_URL}' < /etc/nginx/conf.d/default.tmpl > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;' || cat /etc/nginx/conf.d/default.conf"
