#!/bin/bash
dir=`dirname $0`
cd $dir
pnpm build:test
node deploy.ts