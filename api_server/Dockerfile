FROM jrottenberg/ffmpeg:7.1-alpine AS ff

FROM node:22-alpine

RUN apk add --no-cache --update libgomp expat

## https://github.com/jrottenberg/ffmpeg/issues/99#issuecomment-396659630
COPY --from=ff /bin/ffmpeg /bin/ffprobe /usr/local/bin/
COPY --from=ff /lib /lib
COPY --from=ff /share /share

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Only needed on production
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
# CMD ["npm", "run", "dev"]

