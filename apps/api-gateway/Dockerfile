# Base
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat bash

# Dependencies
FROM base AS deps
COPY package.json yarn.lock ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages/*/package.json ./packages/*/
RUN yarn install --frozen-lockfile

# Development
FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3001
CMD ["yarn", "workspace", "api-gateway", "dev"]
