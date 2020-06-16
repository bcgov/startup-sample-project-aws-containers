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

:warning: If you are using AWS Temporary Credentials, it is best to refresh them so they don't expire before the Terraform completes.

1. Build the docker image: 

   ``docker build -t startup-sample .``

2. Login to ECR: 

   ``set AWSACCOUNTID=<<AWS ACCOUNTID>>``

   ``aws ecr get-login-password --region ca-central-1 | docker login --username AWS --password-stdin $AWSACCOUNTID.dkr.ecr.ca-central-1.amazonaws.com``
   

3. Create a repository for the image:

   ``aws ecr create-repository --region ca-central-1 --repository-name startup-sample``

4. Ensure that the ECS Service Role exists:

   ``aws iam create-service-linked-role --aws-service-name ecs.amazonaws.com`` (this only needs to be done once)

5. Tag the docker image with the url of the repository from the previous step:

   ``docker tag startup-sample $AWSACCOUNTID.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``

6. Push the image to ECR:

   ``docker push $AWSACCOUNTID.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``

7. ``cd terraform/aws``
8. ``terraform init``
9. ``terraform apply -var client_app_image=$AWSACCOUNTID.dkr.ecr.ca-central-1.amazonaws.com/startup-sample``
10. The output will display a URL to the Application Load Balancer. Note that it will take several seconds before the load balancer registers the container as healthy. To check the status, navigate to [LoadBalancerTargetGroups](https://ca-central-1.console.aws.amazon.com/ec2/v2/home?region=ca-central-1#TargetGroups:sort=targetGroupName), select the 'startup-sample-group' and look for the 'healthy' status.

In the server.js file, ``app.use(requireHttps);`` is commented out until HTTPS and Amazon Certificate Manager (ACM) are added to the Terraform. 


