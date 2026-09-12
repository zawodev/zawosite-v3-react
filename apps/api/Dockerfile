FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS pruner
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker

FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy lockfile and package manifests for optimal layer caching
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Copy source code and build project
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @repo/database db:emit
RUN pnpm --filter api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app .

USER nestjs
EXPOSE 4000

CMD ["sh", "-c", "pnpm db:migrate && node apps/api/dist/main.js"]

