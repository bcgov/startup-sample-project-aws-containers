# Sample Startup Project

## A starter greeting template for cloud demo deployments

---

## Introduction

Welcome to your new project.  This is a basic starter project with a NodeJS app connected to a DynamoDB database for you to modify and expand to fit your needs.

## License

    Copyright 2020 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


## Amazon Web Services Terraform Deployment

### Deployment Steps

1. Build the docker image: ``docker build -t startup-sample .``
2. Login to ECR. ``aws ecr get-login --no-include-email --region ca-central-1``. This command outputs a docker login command. Copy, paste, and execute the entire output.
3. Create a repository for the image. ``aws ecr create-repository --region ca-central-1 --repository-name startup-sample``
4. Tag the docker image with the url of the repository from the previous step. ``docker tag startup-sample <<AWS ACCOUNTID>>.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``
5. Push the image to ECR: ``docker push <<AWS ACCOUNTID>.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``
6. ``cd terraform/aws``
7. terraform apply
8. You will be prompted for the ``client_app_image``. Provide the value from the previous step. ex: ``<<AWS ACCOUNTID>.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``

In the server.js file, ``app.use(requireHttps);`` is commented out until HTTPS and Amazon Certificate Manager (ACM) are added to the Terraform. 