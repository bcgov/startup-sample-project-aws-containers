#!/bin/bash

PROFILE=covid
PROJECT=enhanced-travel-screening
PROMOTE_FROM_TAG=9327e64
PROMOTE_TO_TAG=9327e64-prod

MANIFEST=$(aws --profile=${PROFILE} ecr batch-get-image --repository-name ${PROJECT} --image-ids imageTag=${PROMOTE_FROM_TAG} --query 'images[].imageManifest' --output text)

aws ecr put-image --profile=${PROFILE} --repository-name ${PROJECT} --image-tag ${PROMOTE_TO_TAG} --image-manifest "$MANIFEST"

export IMAGE_TAG=${PROMOTE_TO_TAG}

exec .build/build_dockerrun.sh  > Dockerrun.aws.json
#echo "${MANIFEST}"