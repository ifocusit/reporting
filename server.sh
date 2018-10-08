#!/bin/bash

COMMAND_LINE_OPTIONS_HELP='
Command line options:
    -b          launch gradle build of the server part
    -h          Print this help menu

Examples:
    Start the server
        '`basename $0`'

    Build the server part and start it
        '`basename $0`' -b
'

while getopts ":bh:" option; do
    case "${option}" in
        "b")
            reporting-server/gradlew build || exit 1
            ;;
        "h")
            echo "Usage: `basename $0` -h for help";
            echo "$COMMAND_LINE_OPTIONS_HELP"
            exit 1;
            ;;
    esac
done
shift $((OPTIND-1))

java -jar reporting-server/build/libs/reporting-server-0.0.1-SNAPSHOT.jar
