# Build Next.js static export and copy to mounted volume at /site (see docker-compose.yml).
FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_ANALYTICS_INGEST_KEY=""
ENV NEXT_PUBLIC_ANALYTICS_INGEST_KEY=$NEXT_PUBLIC_ANALYTICS_INGEST_KEY
ARG NEXT_PUBLIC_AHREFS_KEY=""
ENV NEXT_PUBLIC_AHREFS_KEY=$NEXT_PUBLIC_AHREFS_KEY
ARG NEXT_PUBLIC_GOOGLE_ADS_ID=""
ENV NEXT_PUBLIC_GOOGLE_ADS_ID=$NEXT_PUBLIC_GOOGLE_ADS_ID

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

CMD ["sh", "-c", "npm run build && cp -r out/. /site/"]
