#!make

-include .env

UNAME := $(shell uname)

export $(shell sed 's/=.*//' .env)
export GIT_LOCAL_BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)

##############################################################
# Define default environment variables for local development #
##############################################################
export PROJECT := $(or $(PROJECT),ssp)
export PROFILE := $(or $(PROFILE),ssp-dev)
export DB_USER := $(or $(DB_USER),development)
export DB_PASSWORD := $(or $(DB_PASSWORD),development)
export DB_NAME := $(or $(DB_NAME),development)
export DB_SERVER := $(or $(DB_SERVER),mongodb)

#####################
# Local Development #
#####################

local:  | local-build local-run local-logs ## Task-Alias -- Run the steps for local development

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

###########
# Utility #
###########

setup-development-env:
	@echo "+\n++ Make: Preparing project for dev environment...\n+"
	@cp .config/.env.example ./.env