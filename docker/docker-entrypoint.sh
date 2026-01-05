#!/bin/sh
set -e

# Replace environment variables in config.js
envsubst '${API_BASE_URL}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

# Execute the original Nginx command
exec "$@"