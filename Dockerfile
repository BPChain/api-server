FROM node:8.4
WORKDIR /var/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
RUN npm install -g nodemon

COPY src src
COPY component component
COPY logger logger
COPY config.js config.js

EXPOSE 2020
ENTRYPOINT ["npm", "start", "--"]
