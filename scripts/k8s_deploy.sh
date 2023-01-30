#!/bin/bash

env=''
ns=''

print_usage() {
  printf "Usage: '-t' - testnet, '-d' - devnet, '-m' - mainnet"
}

while getopts 'tdm' flag; do
  case "${flag}" in
    t) env='testnet' && ns='testnet' ;;
    d) env='devnet' && ns='dev' ;;
    m) env='mainnet' && ns='mainnet' ;;
    *) print_usage
       exit 1 ;;
  esac
done

# Create all resources
kubectl apply -k deployments/k8s/overlays/$env

# Delete old pod
kubectl get pod -n $ns | grep c4e-web-app | awk '{print $1}' | xargs kubectl delete pod -n $ns