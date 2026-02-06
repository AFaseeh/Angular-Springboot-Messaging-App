ARG NODE_VERSION=24.13.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

# Cache package installation
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]