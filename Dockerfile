FROM node:9
WORKDIR /var/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --production
RUN npm install -g nodemon

COPY src src
COPY component component
COPY logger logger
COPY config.js config.js

ENTRYPOINT ["npm", "start", "--"]
