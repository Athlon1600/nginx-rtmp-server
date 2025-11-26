FROM node:24-alpine3.22

WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=8192 --no-warnings"

COPY package*.json ./
RUN npm install

COPY server/ ./server/

EXPOSE 3000

# CMD ["sleep", "1d"]
CMD ["npm", "run", "start"]
