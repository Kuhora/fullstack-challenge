FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat


FROM base AS deps
WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/*/package.json ./apps/*/
COPY packages/*/package.json ./packages/*/
RUN yarn install --frozen-lockfile


FROM base AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3002

CMD ["yarn", "workspace", "SERVICE_NAME", "dev"]
