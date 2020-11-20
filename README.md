# Sample Startup Project

[![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)

## A starter greeting template for cloud demo deployments

It's essentially a fancier "Hello World" app.  This demo app is current WIP and not to be considered a reference architecture yet.  The Cloud Pathfinder team intends to provide a proper CI/CD pattern and clean up rough edges.  For now it has been used internally for testing purposes.  Stay tuned we intend to have this improved soon.

---

## Introduction

Welcome to your new project.  This is a basic starter project with a NodeJS app connected to a database for you to modify and expand to fit your needs.  It provides scripts for developing and running locally, as well as "Infrastructure-as-Code" using Terraform to allow the app to be easily deployed to public cloud environments.  Currently, AWS is supported, but support for other cloud targets may be added in the future.

## Prerequisites

In order to develop or run the app locally, you will need:

- a `bash`-like terminal environment; testing has primarily been done using MacOS Catalina, Ubuntu Linux, and Windows 10 (WSL2)
- `make`
- `Docker`

In order to deploy to AWS, you will also need:

- `terraform` 12 or newer
- the AWS CLI (on MacOS Catalina, ```brew install awscli```)
- access to an AWS account and mechanism to get temporary (STS) credentials

## Setup

### Install Prerequisites

```bash
# MacOS and Ubuntu 20.04, Windows 10 (WSL2 - Ubuntu 20.04), if make is installed
make local-setup
```

```bash
# MacOS, if make is not installed
./.config/local/darwin.sh
```

```bash
# Ubuntu 20.04, Windows 10 (WSL2 - Ubuntu 20.04), if make is not installed
./.config/local/linux.sh
```

### One-time Setup

```bash
# setup development environment
make setup-development-env
```

### Build and Run Locally using Docker

```bash
make local
```

### VS Code

```bash
# initialize vscode project config
make vscode-copy-config
```

```bash
# open the project in vscode
make vscode
```

### Deploy to AWS

The process for deployment to AWS is a work in progress. This section outlines the process that is used for development and experimentation.

#### Build Deployment Image

The image that is built using the local build step is not intended for remote deployment, so before we can deploy to a remote environment, we need to build an suitable image.  The command below will do this.

```shell script
make pipeline-build
```

#### Provision Image Repository

Once we have a deployment image, we need to push the image to repository where the runtime container engine will be able to access it, so we need to create a repository.  The command below will set up a repository for us.

> You will need to *Log into AWS* before running the command below and make your credentials visible to your command shell via environment variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN`.
>_Note_: The `make` command below calls `terraform` behind the scenes and you will be prompted whether to proceed with creation of the repository.  Answer `yes' at the prompt to proceed.  

```shell script
make setup-image-repository
```

#### Push image

Next, we can push the image to the repository that was created above using the command below.

```shell script
make pipeline-push
```

#### Provision AWS infrastructure and Deploy App

The next step is to provision the services that are needed to run the app in AWS.  The command below will do this by calling Terraform.  When the procedure is completed, it will have created all the services, and the application will be deployed.

> _Note_: You may wish to "refresh" your AWS credentials (login in again using AWS console and update environment variables) at this point, as the provisioning step takes some time and credentials are time-bound.
> _Note_: You will see some of the steps you completed are run again.  These are mostly "no-ops" and shouldn't add much time to the process. Nothing to see here...

```shell script
make setup-aws-infrastructure
```

Once the process completes, it will print a URL that can be pasted into your browser.  It may take a few moments, but you will be able to access to app at the printed URL.

#### Cleanup/Teardown

The task of decommissioning the app and its infrastructure, can be done in one step as shown below.

```shell script
make cleanup-aws-infrastructure
```

## License

Copyright 2020 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
