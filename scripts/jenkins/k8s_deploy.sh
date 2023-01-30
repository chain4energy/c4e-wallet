#!/bin/bash

env=''
ns=''

print_usage() {
  printf "./k8s_deploy.sh {ENVIRONMENT}\nAccepted param values: testnet, devnet, mainnet\n"
}

if [ -z "$1" ]
then
  printf "Not enough arguments passed"
  print_usage
  exit 1
fi

case "$1" in
  testnet)
    env='testnet' && ns='testnet' ;;
  devnet)
    env='devnet' && ns='dev' ;;
  mainnet)
    env='mainnet' && ns='mainnet' ;;
  *)
    print_usage
    exit 1 ;;
esac

# Create all resources
kubectl apply -k deployments/k8s/overlays/$env

# Delete old pod
kubectl get pod -n $ns | grep c4e-web-app | awk '{print $1}' | xargs kubectl delete pod -n $ns