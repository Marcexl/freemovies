FROM node:20-alpine
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
COPY nuxt.config.ts ./
COPY tsconfig.json ./

RUN npm ci --include=optional

COPY . .

RUN npm run build

RUN npm prune --production && \
    apk del python3 make g++ && \
    rm -rf /var/cache/apk/*

EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]