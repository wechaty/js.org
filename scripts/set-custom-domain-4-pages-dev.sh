#!/bin/sh

CF_ACCOUNT_ID=$1
CF_ACCOUNT_EMAIL=$2
GLOBAL_API_KEY=$3

curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects/wechaty-js-org/domains" \
  -H "X-Auth-Email: $CF_ACCOUNT_EMAIL" \
  -H "X-Auth-Key: $GLOBAL_API_KEY" \
  -H "Content-Type: application/json" \
  --data '{"name":"wechaty.js.org"}'

curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT_ID/pages/projects/wechaty-js-org/domains" \
  -H "X-Auth-Email: $CF_ACCOUNT_EMAIL" \
  -H "X-Auth-Key: $GLOBAL_API_KEY"
