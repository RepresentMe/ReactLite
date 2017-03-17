#!/bin/bash

echo "Deploying to staging..."

ssh -t -t centos@share-test.represent.me <<EOF
cd /var/www/html
git fetch
git fetch --tags
git reset --hard "staging"
npm install
npm run build
exit
EOF
