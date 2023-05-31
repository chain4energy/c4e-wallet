#!/bin/bash
IMAGE_VERSION=IMAGE_TAG

env=''
registry=''

print_usage() {
  printf "./build_image.sh {ENVIRONMENT}\nAccepted param values: testnet, devnet, mainnet\n"
}

if [ -z "$1" ]
then
  printf "Not enough arguments passed"
  print_usage
  exit 1
fi

case "$1" in
  testnet)
    env='testnet' && registry='g99vzm03.gra7.container-registry.ovh.net' ;;
  devnet)
    env='devnet' && registry='g99vzm03.gra7.container-registry.ovh.net' ;;
  mainnet)
    env='mainnet' && registry='g99vzm03.gra7.container-registry.ovh.net' ;;
  *)
    print_usage
    exit 1 ;;
esac

# Build docker image
#cd deployments/docker >> /dev/null && docker build --network=host --no-cache -t $registry/c4e-chain/c4e-web-app:$env-$IMAGE_VERSION . >> /dev/null && cd - >> /dev/null
cd deployments/docker >> /dev/null && docker build --network=host -t $registry/c4e-chain/c4e-web-app:$env-$IMAGE_VERSION ../../  >> /dev/null && cd - >> /dev/null
echo $registry/c4e-chain/c4e-web-app:$env-$IMAGE_VERSION