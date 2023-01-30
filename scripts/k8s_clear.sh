#!/bin/bash

env=''

print_usage() {
  printf "Usage: '-t' - testnet, '-d' - devnet, '-m' - mainnet"
}

while getopts 'tdm' flag; do
  case "${flag}" in
    t) env='testnet' ;;
    d) env='devnet' ;;
    m) env='mainnet' ;;
    *) print_usage
       exit 1 ;;
  esac
done

# Create all resources
kubectl delete -k deployments/k8s/overlays/$env





