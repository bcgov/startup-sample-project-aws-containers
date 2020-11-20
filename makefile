#!make

-include .env

UNAME := $(shell uname)

export $(shell sed 's/=.*//' .env)
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
export DEPLOY_DATE?=$(shell date '+%Y%m%d%H%M')
export COMMIT_SHA?=$(shell git rev-parse --short=7 HEAD)
export IMAGE_TAG=${COMMIT_SHA}-${DEPLOY_DATE}

##############################################################
# Define default environment variables for local development #
##############################################################
export PROJECT := $(or $(PROJECT),ssp)
export PROFILE := $(or $(PROFILE),ssp-dev)
export DB_USER := $(or $(DB_USER),development)
export DB_PASSWORD := $(or $(DB_PASSWORD),development)
export DB_NAME := $(or $(DB_NAME),development)
export DB_SERVER := $(or $(DB_SERVER),mongodb)

export ACCOUNT_ID := $(shell aws sts get-caller-identity 2>/dev/null | jq '.Account')
export DEPLOYMENT_IMAGE := "$(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com/$(PROJECT):$(IMAGE_TAG)"

#################
# Status Output #
#################

print-status:
	@echo " +---------------------------------------------------------+ "
	@echo " | Current Settings                                        | "
	@echo " +---------------------------------------------------------+ "
	@echo " | ACCOUNT ID: $(ACCOUNT_ID) "
	@echo " | PROJECT: $(PROJECT) "
	@echo " | REGION: $(REGION) "
	@echo " | PROFILE: $(PROFILE) "
	@echo " | GIT LOCAL BRANCH: $(GIT_LOCAL_BRANCH) "
	@echo " | COMMIT_SHA: $(COMMIT_SHA) "
	@echo " | IMAGE_TAG: $(IMAGE_TAG) "
	@echo " +---------------------------------------------------------+ "

# If no .env file exists in the project root dir, run `make setup-development-env` and fill in credentials
pipeline-deploy-dev: | pipeline-build pipeline-push pipeline-deploy-prep pipeline-deploy-version

local:  | local-build local-run local-logs ## Task-Alias -- Run the steps for local development

#####################
# Local Development #
#####################

local-build: ## -- Target : Builds the local development containers.
	@echo "+\n++ Make: Building local Docker image ...\n+"
	@docker-compose -f docker-compose.dev.yml build

local-run: ## -- Target : Runs the local development containers.
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up -d

local-run-db: ## -- Target : Runs the local development containers.
	@echo "+\n++ Make: Running db locally ...\n+"
	@docker-compose -f docker-compose.dev.yml up mongodb

local-close: ## -- Target : Closes the local development containers.
	@echo "+\n++ Make: Closing local container ...\n+"
	@docker-compose -f docker-compose.dev.yml down

local-restart: ## -- Target : Closes the local development containers.
	@echo "+\n++ Make: Closing local container ...\n+"
	@docker-compose -f docker-compose.dev.yml restart

local-logs: ## -- Target : tail logs from local development containers.
	@echo "+\n++ Make: Running locally ...\n+"
	@docker-compose -f docker-compose.dev.yml logs -f

local-client-workspace:
	@docker exec -it $(PROJECT)-client sh

local-server-workspace:
	@docker exec -it $(PROJECT)-server sh

local-database-workspace:
	@docker exec -it $(PROJECT)-mongodb bash

local-db-seed:
	@docker exec -it $(PROJECT)-server npm run db:seed

local-db-migration:
	@docker exec -it $(PROJECT)-server npm run db:migration

local-server-tests:
	@docker exec -it $(PROJECT)-server npm test

local-setup:
	@echo "+\n++ Make: Installing system dependencies...\n+"
ifeq ($(UNAME), Linux)
	@.config/local/linux.sh
endif
ifeq ($(UNAME), Darwin)
	@.config/local/darwin.sh
endif

#######################
# VS Code Development #
#######################

vscode:
	@code .

vscode-copy-config:
	@mkdir -p .vscode && cp -a .config/vscode/* .vscode/

####################
# Utility commands #
####################

check_aws_login:
	@echo AWS ACCOUNT_ID: ${ACCOUNT_ID}

setup-image-repository: check_aws_login
	@cd terraform/ecr && terraform init && terraform apply

setup-aws-ecs-linked-role: check_aws_login
	@echo "Creating ECS service linked role."
	-@aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com

# Provision required infrastructure/services for deployment in AWS.
setup-aws-infrastructure: pipeline-push setup-aws-ecs-linked-role
	@echo "Provisioning services in AWS...\n+"
	@aws ecs put-account-setting --name containerInstanceLongArnFormat --value enabled
	@aws ecs put-account-setting --name serviceLongArnFormat --value enabled
	@aws ecs put-account-setting --name taskLongArnFormat --value enabled
	@terraform init terraform/aws
	@terraform apply -var client_app_image=$(DEPLOYMENT_IMAGE) terraform/aws

# De-provision infrastructure/services in AWS.
cleanup-aws-infrastructure: check_aws_login
	@echo "De-provisioning services in AWS...\n+"
	@terraform init terraform/aws
	@terraform destroy terraform/aws

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

pipeline-push: setup-aws-profile setup-image-repository
	@echo "+\n++ Pushing image to container registry...\n+"
	@aws --region $(REGION) --profile $(PROFILE) ecr get-login-password | docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.$(REGION).amazonaws.com
	@docker tag $(PROJECT):$(GIT_LOCAL_BRANCH) $(DEPLOYMENT_IMAGE)
	@docker push $(DEPLOYMENT_IMAGE)
	@echo "DEPLOYMENT_IMAGE is $(DEPLOYMENT_IMAGE)"

pipeline-deploy-version:
	@echo "+\n++ Deploying to ECS...\n+"
	@terraform apply --var app_image=... // re-runs plan now that image is defined...should be no-op for most things, except ECS task, service, and some other bits.
