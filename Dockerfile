FROM node:8.4
WORKDIR /var/app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
RUN npm install -g nodemon

COPY src src
COPY schemas schemas
COPY components components

EXPOSE 2020
ENTRYPOINT ["npm", "start", "--"]
