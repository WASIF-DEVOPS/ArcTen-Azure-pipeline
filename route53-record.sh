#!/bin/bash
set -e

DOMAIN="dev.arcten-leather.volo.pk"
IP="3.83.123.147"

echo "1. Finding Route 53 Hosted Zone ID for ${DOMAIN}..."
ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --dns-name "${DOMAIN}." \
  --query "HostedZones[0].Id" \
  --output text | cut -d'/' -f3)

if [ -z "$ZONE_ID" ] || [ "$ZONE_ID" == "None" ]; then
  echo "Error: Could not find Hosted Zone for ${DOMAIN} in AWS. Make sure you ran 'terraform apply' first!"
  exit 1
fi

echo "Found Hosted Zone ID: $ZONE_ID"

echo "2. Adding A Record pointing to ${IP}..."
aws route53 change-resource-record-sets \
  --hosted-zone-id "$ZONE_ID" \
  --change-batch "{
    \"Changes\": [
      {
        \"Action\": \"UPSERT\",
        \"ResourceRecordSet\": {
          \"Name\": \"${DOMAIN}\",
          \"Type\": \"A\",
          \"TTL\": 300,
          \"ResourceRecords\": [
            {
              \"Value\": \"${IP}\"
            }
          ]
        }
      }
    ]
  }"

echo "3. Updating local WSL hosts file..."
# Remove any old entries for the domain first
sudo sed -i "/${DOMAIN}/d" /etc/hosts
# Add the new entry
echo "${IP} ${DOMAIN}" | sudo tee -a /etc/hosts

echo "SUCCESS! Route 53 A-Record and local WSL hosts updated."
