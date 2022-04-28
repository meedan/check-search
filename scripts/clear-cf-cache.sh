#!/bin/bash
if [ "$#" -ne 1 ] ; then
    echo "Missing required environment argument. Must be qa or live."
    exit 0
fi

if [[ "$1" == "qa" ]]; then
    echo "Clearing QA check-search cache at CloudFlare..."
    curl --fail --output "/dev/null" --silent --show-error -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${CF_CACHE_TOKEN}" -H "Content-Type: application/json" \
        --data '{"files":["https://qa-search.checkmedia.org/","https://qa-search.checkmedia.org/config.js"]}'
elif [[ "$1" == "live" ]]; then
    echo "Clearing Live check-search cache at CloudFlare..."
    curl --fail --output "/dev/null" --silent --show-error -X POST "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
        -H "Authorization: Bearer ${CF_CACHE_TOKEN}" -H "Content-Type: application/json" \
        --data '{"files":["https://search.checkmedia.org/","https://search.checkmedia.org/config.js"]}'
else
    echo "Invalid environment given. Must be qa or live."
fi

exit 0
