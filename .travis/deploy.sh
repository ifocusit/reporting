#!/bin/bash

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "master" ]; then
    echo "Skipping deploy; just doing a build."
    exit 0
fi

echo "deploying applications..."

function deploy {
    echo "deploying $1 to firebase..."
    ng build --prod --project $1
    firebase deploy --only hosting:$1 --token $FIREBASE_TOKEN --non-interactive
}

# reconnect master to origin
git checkout master

if [ "$TRAVIS_BRANCH" = 'master' ] && [ "$TRAVIS_PULL_REQUEST" = 'false' ]; then
    deploy timbrage
    deploy admin
fi
