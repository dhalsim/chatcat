#!/bin/sh

OUTPUT="$(pgrep mongod)"

if [ "$OUTPUT" = "" ]; then
  mongod
else
  echo "mongo service is already running."
fi
