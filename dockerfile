FROM node:22.9-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
COPY test ./test

RUN npm ci && npm cache clean --force

RUN npm run build

CMD if [ ! -f /app/migrations_applied ]; then \
      npm run build && \
      npx typeorm-ts-node-commonjs migration:run -d ./dist/typeorm/data-source.js && \
      touch /app/migrations_applied; \
    fi && \
    npm run start:prod


EXPOSE 3000