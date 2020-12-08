FROM node:alpine3.12

RUN apk update && apk add --no-cache \
    git && \
    rm -rf /tmp/* /var/cache/apk/* \
    && mkdir /app

WORKDIR /app

RUN git clone https://github.com/serverwrangler/watchdog-prometheus-exporter.git /app && \
    npm install

ENV WATCHDOG_PATH='http://10.33.9.18/data.xml'

CMD npm start

EXPOSE 8000
