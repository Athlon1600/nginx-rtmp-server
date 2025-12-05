[![Build status](https://github.com/Athlon1600/nginx-rtmp-server/actions/workflows/docker-build-push.yml/badge.svg)](https://github.com/Athlon1600/nginx-rtmp-server/actions/workflows/docker-build-push.yml)

# Nginx with RTMP

This is a Docker image that contains:

- nginx (compiled from source)
- RTMP module (https://github.com/sergey-dryabzhinsky/nginx-rtmp-module)
- FFmpeg (optional)

```shell
nginx version: nginx/1.22.1
built by gcc 12.2.0 (Debian 12.2.0-14+deb12u1) 
built with OpenSSL 3.0.17 1 Jul 2025
TLS SNI support enabled
configure arguments: --prefix=/usr/local/nginx --conf-path=/usr/local/nginx/conf/nginx.conf --http-log-path=/var/log/nginx/access.log --error-log-path=/var/log/nginx/error.log --without-http_gzip_module --with-http_ssl_module --with-http_v2_module --with-debug --with-threads --with-ipv6 --add-module=../nginx-rtmp-module-dev
```

```shell
ffmpeg version 7.0.2-static https://johnvansickle.com/ffmpeg/  Copyright (c) 2000-2024 the FFmpeg developers
built with gcc 8 (Debian 8.3.0-6)
configuration: --enable-gpl --enable-version3 --enable-static --disable-debug --disable-ffplay --disable-indev=sndio --disable-outdev=sndio --cc=gcc --enable-fontconfig --enable-frei0r --enable-gnutls --enable-gmp --enable-libgme --enable-gray --enable-libaom --enable-libfribidi --enable-libass --enable-libvmaf --enable-libfreetype --enable-libmp3lame --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-librubberband --enable-libsoxr --enable-libspeex --enable-libsrt --enable-libvorbis --enable-libopus --enable-libtheora --enable-libvidstab --enable-libvo-amrwbenc --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libdav1d --enable-libxvid --enable-libzvbi --enable-libzimg
libavutil      59.  8.100 / 59.  8.100
libavcodec     61.  3.100 / 61.  3.100
libavformat    61.  1.100 / 61.  1.100
libavdevice    61.  1.100 / 61.  1.100
libavfilter    10.  1.100 / 10.  1.100
libswscale      8.  1.100 /  8.  1.100
libswresample   5.  1.100 /  5.  1.100
libpostproc    58.  1.100 / 58.  1.100
```

More info:
- https://github.com/Athlon1600/nginx-rtmp-server

## Usage

First, pull down the image you want to use. For now, we have only two variants - one with FFmpeg preinstalled, and one
without.

- athlon1600/nginx-rtmp:debian
- athlon1600/nginx-rtmp:debian-ffmpeg
- athlon1600/nginx-rtmp:latest points to `debian-ffmpeg`

```shell
docker pull athlon1600/nginx-rtmp:latest
```

And then, you can either run it straight out of the box using the default `nginx.conf` file:

- https://github.com/Athlon1600/nginx-rtmp-server/blob/master/docker/nginx.conf

```shell
docker run --rm -p 80:80 -p 1935:1935 athlon1600/nginx-rtmp:latest
```

or you can specify your own custom `nginx.conf`:

```shell
docker run --rm -p 80:80 -p 1935:1935 -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf:ro athlon1600/nginx-rtmp:latest
```

or use this as a base image within your own custom Dockerfile:

```dockerfile
FROM athlon1600/nginx-rtmp:latest
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 1935

CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
```

## To-do list

- provide Alpine variant
- provide linux/arm64 variant
