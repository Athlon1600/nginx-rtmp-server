# Nginx RTMP Live Streaming Server

![GitHub last commit](https://img.shields.io/github/last-commit/athlon1600/nginx-rtmp-server)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/athlon1600/nginx-rtmp-server/docker-build-push.yml?label=Docker%20build%20and%20push)
![Top language](https://img.shields.io/github/languages/top/athlon1600/nginx-rtmp-server)

Self-host your own streaming server without relying on any external and expensive services (like **Amazon IVS**).

See a working demo here - https://nginx-rtmp.athlon1600.com/

## :whale: Requirements

All you need is Docker.  
On Linux, you can install it with just this one-liner:
```shell
curl -fsSL https://get.docker.com/ | sh
```

## :rocket: Deployment

Whether you are playing with this on your local computer, or hosting it on a real server, the steps are basically the same. Things do change a lot once you actually get thousands of users though.

Start by cloning this repository, and then start the services using Docker:

```shell
git clone https://github.com/Athlon1600/nginx-rtmp-server.git
cd nginx-rtmp-server
docker-compose up --build -d
```

and that is it! 

Assuming you are doing this from your local computer, that should launch two services:

- HTTP Nginx Server on port 8090: http://localhost:8090
- RTMP Ingest Server on port 1935: `rtmp://localhost:1935`

## :movie_camera: Live-streaming to your server

Once the two services are up and running, you can now start streaming to your newly launched RTMP server at this endpoint:

```shell
rtmp://localhost:1935/live/{stream_key}
```

`{stream_key}` can be anything you want. In all the examples below we will be using `test`.

If you are using OBS, point your streaming settings to:

```shell
rtmp://localhost:1935/live/test
```

![OBS Stream Settings](https://i.imgur.com/iH5Zp2Q.png)

You can also stream any mp4-like video file using `ffmpeg` command:

```shell
ffmpeg -stream_loop -1 -nostdin -re -i "./video.mp4" -copy -f flv rtmp://localhost/live/test
```

## :tv: Viewing your live-stream with HLS

Every stream will produce `.m3u8` playlist, that is then made accessible via HTTP protocol,
and can then be consumed by any client that supports HLS protocol 
such as VLC media player, or your web-browser.

That playlist URL will look something like:

```text
http://localhost:8090/hls/test/master.m3u8
```

Where `test` is a "stream key" for that particular stream.

To play it using VLC Media player:

|  |                                                                  |
|---------|------------------------------------------------------------------|
| ![VLC Media Player Open Network Stream](https://i.imgur.com/gSBSZqO.png) | ![VLC Media Player Network URL](https://i.imgur.com/j6P9AGv.png) |

Or you can play it in your web-browser with any HLS supporting video player such as:
- https://hlsjs.video-dev.org

## :lock: Caddy Server

If you want HTTPS support out of the box, you should install and use Caddy web server:

```shell
wget -qO- https://raw.githubusercontent.com/Athlon1600/useful/master/caddy/caddy_linux_amd64.sh | bash
```

Next step is to update `etc/Caddyfile` configuration file, and then run:

```shell
caddy start --config ./etc/Caddyfile
```

## Projects using this library

- https://watchseinfeld.net

## Links

- https://github.com/arut/nginx-rtmp-module/wiki/Directives
- https://hub.docker.com/r/athlon1600/nginx-rtmp
- https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/Introduction/Introduction.html
