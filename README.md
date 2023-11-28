# Sample Startup Project

[![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md).

---

## Introduction

Welcome to your new project. This is a basic BC Gov AWS "Hello World" starter project to get you started in your cloud journey. It is a NodeJS app connected to a database for you to modify and expand to fit your needs.

The code can be run:

- Locally on your machine
- On the AWS Cloud using GitHub Actions workflows and Terraform scripts

## Running Locally

To run the application locally, you will need:

- [Node.js](https://nodejs.org/) installed
- [Localstack](https://github.com/localstack/localstack) installed and running

### Run the API

Create a `.env` file in the `src/api` folder with the following contents:

```bash
LOCALSTACK_ENDPOINT=<localstack or remote mongodb url>
DYNAMODB_TABLE_NAME=<dynamodb table name>
```

```bash
cd src/api 
npm install
```

The API will run on <http://localhost:5000>.

### Run the Frontend

```bash
cd src/web
npm install
npm start 
```

The frontend will run on <http://localhost:3000>  

## Deploy Application on the AWS Cloud

### Prerequisites for building in the AWS Cloud

This code assumes that you have access to AWS Cloud and that you have created IAM roles linked to your repository and the Github OIDC provider in AWS. These roles will be used by the Terraform scripts to create the infrastructure in AWS. Those roles has to be created by the Ministry teams and then added in your repository. (You can see below how to create them)

Once the project set is created, it will have one or more service accounts associated each of them with different IAM Roles ARN.

These roles ARN, necessary to access AWS Cloud, are set for every Github environment. The values themselves are stored as GitHub environment _Variables_

The required environment Variables are:

- `TERRAFORM_DEPLOY_ROLE_ARN` This is the ARN of IAM Role used to deploy resources through the Github action authenticate with the GitHub OpenID Connect.
  - Create the IAM Policy for `tools` with this [policy](https://github.com/bcgov/startup-sample-project-aws-containers/blob/main/docs/IAM_policies/Registry_Deployment_IAM_Policy.json)
  - Create the IAM Policy for `dev` `test` and `prod`  with this [policy](https://github.com/bcgov/startup-sample-project-aws-containers/blob/main/docs/IAM_policies/App_Deployment_IAM_Policy.json)
  - To access the `TERRAFORM_DEPLOY_ROLE_ARN` you need to create the role beforehand and link them to the previously created policies in each account. Then you have to add the right arn for each Github environment.
  To create the role trust relationship you can use this example:

  ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Federated": "arn:aws:iam::<accound_id>:oidc-provider/token.actions.githubusercontent.com"
                },
                "Action": "sts:AssumeRoleWithWebIdentity",
                "Condition": {
                    "StringLike": {
                        "token.actions.githubusercontent.com:sub": "repo:<Github_organization>/<repo_name>:ref:refs/heads/<Your_branch>"
                    },
                    "ForAllValues:StringEquals": {
                        "token.actions.githubusercontent.com:iss": "https://token.actions.githubusercontent.com",
                        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                    }
                }
            }
        ]
    }

    ```

For the following secret they are global for every account so you can put them as Github repository _Variables_

- `AWS_ACCOUNTS_ECR_READ_ACCESS` - is used to authorize the read access to the ECS from the other AWS accounts (dev, test, prod). It is an array where the individual elements take the format  follows the format `arn:aws:iam::############:root` where `############` is your AWS account number. For example:

    AWS_ACCOUNTS_ECR_READ_ACCESS='["arn:aws:iam::DEV_ACCOUNT_NUMBER:root", "arn:aws:iam::TEST_ACCOUNT_NUMBER:root", "arn:aws:iam::PROD_ACCOUNT_NUMBER:root"]'

- `AWS_ECR_URI` - ECR repository URI. Follows the format `############.dkr.ecr.ca-central-1.amazonaws.com/startup-sample-app` where `############` is your AWS account number.
- `AWS_REGION` - should be `ca-central-1`

### GitHub Actions

The deployment of the sample containers app to the AWS Cloud uses several steps.

- Configure the _Variables_ in your GitHub repository
- Execute a _Pull Request_ to the GitHub repository that includes the changes described in the previous section

#### Deploy

[.github/workflows/deploy.yml](.github/workflows/deploy.yml)

The deploy workflow is triggered by manual dispatch. It will deploy the selected branch to the selected environment.

>NOTE: For this sample application we chose a manual deploy workflow to keep the cost down. In a real world scenario you may want to use an automated workflow.

#### Destroy

[.github/workflows/destroy.yml](.github/workflows/destroy.yml)

The destroy workflow is triggered by manual dispatch. It will destroy the selected branch from the selected environment.

#### Pull Request

[.github/workflows/pull_request.yml](.github/workflows/pull_request.yml)

The pull request workflow is triggered by pull request to any of the `dev`, `test`, or `main` branches. It will run a `terraform plan` and build the frontend.

### Connecting to the client

You will be able to access the client using the address for the cloudfront distribution. You can find it in the output of the terraform script. It will be something like this: `https://d1q2w3e4r5t6y7.cloudfront.net/`

## Contributing

Be aware that pull request from fork will fail due to the lack of access of the secrets variables.  
You are still welcome to participle but for the plan to work before merge it has to be done from within the repository.

:warning: The terraform plan stage will fail in cross account pr workflow :warning:

## License

```text
Copyright 2021 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
