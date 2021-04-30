#!/usr/bin/env bash

sudo apt-get update

## Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

## Install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
