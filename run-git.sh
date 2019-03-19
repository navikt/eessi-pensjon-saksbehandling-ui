#!/bin/bash
VERSION=`git describe --tags`
sed -i "s/%VERSION%/$VERSION/g" build/index.html
