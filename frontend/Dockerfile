# Build Next.js static export and copy to mounted volume at /site (see docker-compose.yml).
FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

CMD ["sh", "-c", "npm run build && cp -r out/. /site/"]
