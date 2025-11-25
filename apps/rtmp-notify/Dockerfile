FROM node:24-alpine3.22

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192 --no-warnings"

COPY package*.json ./

RUN npm install
RUN npm install -g pm2

COPY pm2.config.js ./
COPY server/ ./

EXPOSE 3000

# CMD ["sleep", "1d"]
CMD ["pm2-runtime", "start", "pm2.config.js"]
