#!/usr/bin/env sh

reporting-server/gradlew build || exit 1

java -jar build/libs/reporting-server-0.0.1-SNAPSHOT.jar
