#!/bin/bash

file=".env"

while IFS="=" read key val
do
  # display $line or do something with $line
  if [ -n "$val" ]; then
    eval "$key"=$val
  fi
done < "$file"

cat << EOF
{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "essential": true,
      "name": "application",
      "image": "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT:$IMAGE_TAG",
      "memory": 256,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
        }
      ]
    }
  ]
}
EOF
