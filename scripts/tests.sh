#!/usr/bin/env bash

set -euo pipefail

echo "--- Report Git Version"
git --version

# Buildkite does a git clean *before* checking out the commit to be built, which may leave cruft.
echo "--- Really Prepare Build Folder..."
git clean -ffxd

echo "--- Testing Wealth Server"
echo "--- Install Node Modules"
npm install

echo "--- Running tests"
cmd="npm test"
eval $cmd
rc=$?
if [[ $rc != 0 ]]
then
    exit $rc
fi