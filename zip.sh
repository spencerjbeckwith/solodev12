#!/bin/bash

set -e
npm test
npm run atlas
npm run build
echo "Ready to zip..."

rm -rf package package.zip
mkdir -p package/assets
cp index.html package/index.html
cp Jersey10-Regular.ttf package/Jersey10-Regular.ttf
cp -r assets/sounds package/assets/sounds
cp -r dist package/dist
cd package && zip -r ../package.zip .
echo "Built package.zip"