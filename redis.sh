#!/bin/sh

OUTPUT="$(redis-cli ping)"

if [ "$OUTPUT" = "PONG" ]; then
  echo "redis-server is already running."
else
  redis-server
fi
