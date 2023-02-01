![GitHub last commit](https://img.shields.io/github/last-commit/athlon1600/nginx-rtmp-server)
![Top language](https://img.shields.io/github/languages/top/athlon1600/nginx-rtmp-server)

# Video Streaming Server

See a demo of what this is here - https://demo.streamplanet.tv/

## Installation

Download all the files first:

```shell
git clone https://github.com/Athlon1600/nginx-rtmp-server.git
```

Next, you need docker.

**Windows**  
If you are testing this from your local windows computer, download Docker from here:
https://docs.docker.com/docker-for-windows/install/

**Linux**  
On your linux machine, just run this command on your fresh box

```shell
bash <(wget -O - https://raw.githubusercontent.com/Athlon1600/nginx-rtmp-server/master/install.sh)
```

Once installed, run this command inside the folder with the files:

```shell
docker-compose up --build -d
```

and that is it!

You could then login to any of the two "services" using:  
```shell
docker exec -it rtmp /bin/bash
docker exec -it api_server /bin/sh
```

## Monitoring

```shell
docker logs rtmp --tail 100
docker logs api_server --tail 100
```

## Caddy

Useful for providing automatic HTTPS - one-click installation:

```shell
curl -sS https://webi.sh/caddy | sh
```

Modify `.env` and `etc/Caddyfile` accordingly, and then run:

```shell
caddy run --config ./etc/Caddyfile
```

## Technical Notes

Powered by RTMP module for nginx.  
https://www.nginx.com/products/nginx/modules/rtmp-media-streaming/

The original codebase stopped receiving updates years ago:  
https://github.com/arut/nginx-rtmp-module

We will be using this fork instead:  
https://github.com/sergey-dryabzhinsky/nginx-rtmp-module

## Projects using this library

- https://watchseinfeld.net

## Links

- https://www.nginx.com/products/nginx/modules/rtmp-media-streaming/
- https://github.com/arut/nginx-rtmp-module/wiki/Directives
- https://groups.google.com/g/nginx-rtmp/
- https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/Introduction/Introduction.html
