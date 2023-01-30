#!/bin/bash
IMAGE_VERSION=v1.0.0-rc0

env=''
registry=''

print_usage() {
  printf "Usage: '-t' - testnet, '-d' - devnet, '-m' - mainnet"
}

while getopts 'tdm' flag; do
  case "${flag}" in
    t) env='testnet' && registry='g99vzm03.gra7.container-registry.ovh.net' ;;
    d) env='devnet' && registry='g99vzm03.gra7.container-registry.ovh.net' ;;
    m) env='mainnet' && registry='g99vzm03.gra7.container-registry.ovh.net' ;;
    *) print_usage
       exit 1 ;;
  esac
done

# Build docker image
cd deployments/docker && docker build --network=host -t $registry/c4e-chain/c4e-web-app:$env-$IMAGE_VERSION . && cd -