#!/bin/bash

echo "Deploying to production..."

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
npm run build --prefix ../
aws s3 sync ../build s3://react-collections
