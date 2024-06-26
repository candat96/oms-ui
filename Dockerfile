FROM node:21-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN npm install -g pnpm@9.1.3

COPY . .

RUN pnpm install

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build --production

FROM node:21-alpine AS deploy

WORKDIR /app

ENV NODE_ENV production

ENV NEXT_TELEMETRY_DISABLED 1

ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs

RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
