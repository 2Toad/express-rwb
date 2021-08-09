FROM node:14.17.4-alpine

RUN npm i -g npm@7.20.3

RUN mkdir -p /usr/src/express-api && chown -R node:node /usr/src/express-api

WORKDIR /usr/src/express-api

USER node

COPY --chown=node:node package.json package-lock.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000
