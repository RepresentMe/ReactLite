#!/bin/bash

echo "Deploying to staging..."

ssh -t -t centos@share-test.represent.me <<EOF
sudo swapoff -a
sudo swapon -a
cd /var/www/html
git fetch
git fetch --tags
git reset --hard "staging"
npm install
npm run build
exit
EOF
