#!make

-include .env

export $(shell sed 's/=.*//' .env)
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')
export COMMIT_SHA?=$(shell git rev-parse --short=7 HEAD)
# original IMAGE_TAG=${DEPLOY_DATE}-${COMMIT_SHA}
export IMAGE_TAG=${COMMIT_SHA}

define deployTag
"${PROJECT}-${DEPLOY_DATE}"
endef

##############################################################
# Define default environment variables for local development #
##############################################################
export PROJECT := $(or $(PROJECT),ssp)
export DB_USER := $(or $(DB_USER),development)
export DB_PASSWORD := $(or $(DB_PASSWORD),development)
export DB_NAME := $(or $(DB_NAME),development)
export DB_SERVER := $(or $(DB_SERVER),mongodb)


# export ACCOUNT_ID := $(aws sts get-caller-identity | jq '.Account')

#################
# Status Output #
#################

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | ACCOUNT ID: $(ACCOUNT_ID) "
	@echo " | S3 BUCKET: $(S3_BUCKET) "
	@echo " | PROJECT: $(PROJECT) "
	@echo " | REGION: $(REGION) "
	@echo " | PROFILE: $(PROFILE) "
	@echo " | DEPLOY ENV: $(DEPLOY_ENV) "
	@echo " | MERGE BRANCH: $(MERGE_BRANCH) "
	@echo " | GIT LOCAL BRANCH: $(GIT_LOCAL_BRANCH) "
	@echo " | COMMIT_SHA: $(COMMIT_SHA) "
	@echo " | IMAGE_TAG: $(IMAGE_TAG) "
	@echo " +---------------------------------------------------------+ "

# If no .env file exists in the project root dir, run `make setup-development-env` and fill in credentials
pipeline-deploy-dev: | pipeline-build pipeline-push pipeline-deploy-prep pipeline-deploy-version

local:  | build-local run-local ## Task-Alias -- Run the steps for local development

#####################
# Local Development #
#####################

build-local: ## -- Target : Builds the local development containers.
	@echo "+\n++ Make: Building local Docker image ...\n+"
	@docker-compose -f docker-compose.dev.yml build

run-local: ## -- Target : Runs the local development containers.
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up

run-local-db: ## -- Target : Runs the local development containers.
	@echo "+\n++ Make: Running db locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up mongodb

close-local: ## -- Target : Closes the local development containers.
	@echo "+\n++ Make: Closing local container ...\n+"
	@docker-compose -f docker-compose.dev.yml down

local-client-workspace:
	@docker exec -it $(PROJECT)-client bash

local-server-workspace:
	@docker exec -it $(PROJECT)-server bash

local-database-workspace:
	@docker exec -it $(PROJECT)-mongodb bash

local-db-seed:
	@docker exec -it $(PROJECT)-server npm run db:seed

local-db-migration:
	@docker exec -it $(PROJECT)-server npm run db:migration

local-server-tests:
	@docker exec -it $(PROJECT)-server npm test


####################
# Utility commands #
####################

# Provision required infrastructure/services for deployment in AWS.
setup-aws-infrastructure:
	@echo "Provisioning services in AWS...\n+"
	@terraform init terraform/aws
# 	@todo add client_app_image var to below
	@terraform apply terraform/aws

# Set an AWS profile for pipeline
setup-aws-profile:
	@echo "+\n++ Make: Setting AWS Profile...\n+"
	@aws configure set aws_access_key_id $(AWS_ACCESS_KEY_ID) --profile $(PROFILE)
	@aws configure set aws_secret_access_key $(AWS_SECRET_ACCESS_KEY) --profile $(PROFILE)
	@aws configure set aws_session_token $(AWS_SESSION_TOKEN) --profile $(PROFILE)

setup-development-env:
	@echo "+\n++ Make: Preparing project for dev environment...\n+"
	@cp .config/.env.example ./.env


##########################################
# Pipeline build and deployment commands #
##########################################

pipeline-build:
	@echo "+\n++ Performing build of Docker images...\n+"
	@echo "Building images with: $(GIT_LOCAL_BRANCH)"
	@docker-compose -f docker-compose.yml build

pipeline-push:
	@echo "+\n++ Pushing image to container registry...\n+"
	@aws --region $(REGION) --profile $(PROFILE) ecr get-login-password | docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com
	@docker tag $(PROJECT):$(GIT_LOCAL_BRANCH) $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(IMAGE_TAG)
	@docker push $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(IMAGE_TAG)
	@export DEPLOYMENT_IMAGE="$(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(IMAGE_TAG)"

pipeline-deploy-version:
	@echo "+\n++ Deploying to ECS...\n+"
# 	@aws --profile $(PROFILE) configure set region $(REGION)
# 	@aws --profile $(PROFILE) s3 cp $(call deployTag).zip s3://$(S3_BUCKET)/$(PROJECT)/$(call deployTag).zip
# 	@aws --profile $(PROFILE) elasticbeanstalk create-application-version --application-name $(PROJECT) --version-label $(call deployTag) --source-bundle S3Bucket="$(S3_BUCKET)",S3Key="$(PROJECT)/$(call deployTag).zip"
# 	@aws --profile $(PROFILE) elasticbeanstalk update-environment --application-name $(PROJECT) --environment-name $(DEPLOY_ENV) --version-label $(call deployTag)
	@terraform apply --var app_image=... // re-runs plan now that image is defined...should be no-op for most things, except ECS task, service, and some other bits.

pipeline-healthcheck:
	@aws --profile $(PROFILE) elasticbeanstalk describe-environments --application-name $(PROJECT) --environment-name $(DEPLOY_ENV) --query 'Environments[*].{Status: Status, Health: Health}'

##########################################
# GH deployment commands #
##########################################

gh-pipeline-push:
	@echo "+\n++ Pushing image to Dockerhub...\n+"
	# @$(shell aws ecr get-login --no-include-email --region $(REGION) --profile $(PROFILE))
	@aws --region $(REGION) ecr get-login-password | docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com
	@docker tag $(PROJECT):$(GIT_LOCAL_BRANCH) $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(IMAGE_TAG)
	@docker push $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(IMAGE_TAG)

gh-pipeline-deploy-prep:
	@echo "+\n++ Creating Dockerrun.aws.json file...\n+"
	@.build/build_dockerrun.sh > Dockerrun.aws.json

gh-pipeline-deploy-version:
	@echo "+\n++ Deploying to Elasticbeanstalk...\n+"
	@zip -r $(call deployTag).zip  Dockerrun.aws.json
	@aws configure set region $(REGION)
	@aws s3 cp $(call deployTag).zip s3://$(S3_BUCKET)/$(PROJECT)/$(call deployTag).zip
	@aws elasticbeanstalk create-application-version --application-name $(PROJECT) --version-label $(call deployTag) --source-bundle S3Bucket="$(S3_BUCKET)",S3Key="$(PROJECT)/$(call deployTag).zip"
	@aws elasticbeanstalk update-environment --application-name $(PROJECT) --environment-name $(DEPLOY_ENV) --version-label $(call deployTag)

##########################################
# IMG Promotion commands #
##########################################
pipeline-promote-prep:
	@echo "--------------------------------------------------------------------------------";
	@echo "NOTE: This requires the PROMOTE_FROM_TAG and PROMOTE_TO_TAG be set in .build/image_promote.sh"
	@echo "--------------------------------------------------------------------------------";
	@echo "\nPromoting to Image Registry...\n"
	@.build/promote_img.sh

pipeline-promote-staging:
	@echo "+\n++ Promoting to Elasticbeanstalk [STAGING]...\n+"
	@zip -r $(call deployTag)_staging.zip  Dockerrun.aws.json
	@aws --profile $(PROFILE) configure set region $(REGION)
	@aws --profile $(PROFILE) s3 cp $(call deployTag)_staging.zip s3://$(S3_BUCKET)/$(PROJECT)/$(call deployTag)_staging.zip
	@aws --profile $(PROFILE) elasticbeanstalk create-application-version --application-name $(PROJECT) --version-label $(call deployTag) --source-bundle S3Bucket="$(S3_BUCKET)",S3Key="$(PROJECT)/$(call deployTag)_staging.zip"
	@aws --profile $(PROFILE) elasticbeanstalk update-environment --application-name $(PROJECT) --environment-name startup-sample-project-staging --version-label $(call deployTag)

pipeline-promote-prod:
	@echo "+\n++ Promoting to Elasticbeanstalk [PRODUCTION]...\n+"
	@zip -r $(call deployTag)_prod.zip  Dockerrun.aws.json
	@aws --profile $(PROFILE) configure set region $(REGION)
	@aws --profile $(PROFILE) s3 cp $(call deployTag)_prod.zip s3://$(S3_BUCKET)/$(PROJECT)/$(call deployTag)_prod.zip
	@aws --profile $(PROFILE) elasticbeanstalk create-application-version --application-name $(PROJECT) --version-label $(call deployTag) --source-bundle S3Bucket="$(S3_BUCKET)",S3Key="$(PROJECT)/$(call deployTag)_prod.zip"
	@aws --profile $(PROFILE) elasticbeanstalk update-environment --application-name $(PROJECT) --environment-name startup-sample-project-prod --version-label $(call deployTag)

##########################################
# Git tagging aliases #
##########################################

tag-dev:
	@git tag -fa dev -m "Deploying $(BRANCH):$(IMAGE_TAG) to dev env" $(IMAGE_TAG)
	@git push --force origin refs/tags/dev:refs/tags/dev
