#!/bin/bash
set -ex
output=$1
tag=$2
fe=$(pwd)
dist=$fe/build
git checkout "$tag"
npm install --registry=https://registry.npm.taobao.org
npm run build
cp -r $dist/* $output