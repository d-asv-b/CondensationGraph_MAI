FROM node:latest AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:latest
WORKDIR /app
EXPOSE 3000
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
CMD [ "npm", "run", "start" ]