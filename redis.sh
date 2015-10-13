#!/bin/sh

OUTPUT="$(redis-cli ping)"

if [ "$OUTPUT" = "PONG" ]; then
  echo "redis-server already running."
else
  redis-server
fi
