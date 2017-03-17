#!/bin/bash

echo "Deploying to staging...\n"

ssh centos@share-test.represent.me <<EOF
cd /var/www/html
git reset --hard staging
npm install
npm run build
exit
EOF
