FROM node:22.9-alpine

WORKDIR /app

COPY package.init.cjs package.json tsconfig.json tsconfig.build.json nest-cli.json jest.config.json ./
COPY src ./src
COPY test ./test
COPY doc ./doc

RUN node package.init.cjs
RUN npm install && npm cache clean --force
RUN npm run build

CMD npm run start:dev
