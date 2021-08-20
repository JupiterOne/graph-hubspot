FROM node:14-alpine

WORKDIR /app

ADD ./package*.json ./

RUN npm install

ADD ./src ./src

EXPOSE 3000
VOLUME ["/app/db"]

ENTRYPOINT [ "node", "./src/server.js" ]
