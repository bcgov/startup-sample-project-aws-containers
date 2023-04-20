# Sample Containers app BDD test
## Description
Under `functional_test` folder you will find a set of scripts to run an automated test on the startup sample aws containers app. You may want to use it as a template to incorporate automated test to your app.

The app is written in groovy using the geb/spock framework. This framework makes the test easy to read and to follow.

## Run the test locally with containers app running locally
By locally we mean that you have the containers app running on a container on your machine at the address `baseUrl = "http://localhost:4000/"`.

To run the test, open terminal and navigate to `.../functional-test` and execute 

`./gradlew chromeTest --tests="FirstTest"`


Note: the ChromeDriver version set in `build.gradle` needs to match the Chrome version you are using. Same for other browsers you may use


## Run the test locally with your app running in AWS and using BrowserStack
In this case the app has been successfully deployed in AWS (check the Readme file at the root of this project). The test scripts are running locally in your machine firing a remote browser, in this case on the BrowserStack cloud, and the browser is opening the containers app page stored in AWS
n

For this configuration you need 
- The sample containers app installed in AWS. You also need the license plate (check `startup-sample-project-aws-containers/functional-tests/Readme.md` for more information)

- An account with BrowserStack, once you have the account, you will access the values of `User Name` and `Access Key`. To run the test locally, you will need to type in terminal the following commands to add their values in your environment

  `export LICENSE_PLATE=[LICENSE PLATE]`
  
  `export BROWSERSTACK_USERNAME=[BrowserStack user name]`
  
  `export BROWSERSTACK_ACCESS_KEY=[BrowserStack Access key]`

once set, navigate to `../functional-test` and execute run the following command on your terminal

`./gradlew remoteChromeTest --tests="FirstTest"`


Note: You need to set LICENSE_PLATE as an env variable, as it is part of the URL of the containers app when the app is running in AWS. If the app is running locally on your machine (see section `Run the test locally with containers app running locally`), then GebConfig.groovy will default to "http://localhost:4000/"`  (it assumes that LICENSE_PLATE has not been set as env variable and is therefore null)

Note: The specific capabilities of the browser that you are firing in BrowserStack are defined in GebConfig.groovy in the remoteChrome environment. The BrowserStack username and Access key are not hardcoded but retrieved through environmental variables

## Run the test scripts on GitHub CI/CD pipeline using actions firing a browser in BrowserStack cloud 
Currently the GitHub action `startup-sample-project-aws-containers/.github/workflows/browserStackTest.yml` will run the tests in GitHub controlling the browser hosted on Browser stack and connecting to the containers app stored in AWS.

To run it you will nee to set the following repository variables in GitHub. They are the same ones that are required to install the app in AWS (check `startup-sample-project-aws-containers/functional-tests/Readme.md` for more information)

- LICENSEPLATE
- AWS_ACCOUNTS_ECR_READ_ACCESS
- AWS_ECR_URI

And the following environmental variables
- TERRAFORM_DEPLOY_ROLE_ARN for the dev environment.
- TERRAFORM_DEPLOY_ROLE_ARN for the test environment.

You will need also to set up GitHub secrets to run the test using BrowserStack servers (workflow TestBrowserStack.yml)
- BROWSERSTACK_ACCESS_KEY
- BROWSERSTACK_USERNAME
- MAIL_ADDRESS
- MAIL_PASSWORD
- MAIL_SERVER
- MAIL_USERNAME


The last four secrets need to be set to email the test results to the account of your choice.


## Run the test scripts on GitHub CI/CD pipeline (not using BrowseStack)
The GitHub action `startup-sample-project-aws-containers/.github/workflows/AutomationTestUbuntu.yml` will run the tests in GitHub. This is similar to running the test in your local machine, the caveat is that in your local machine you have full control of the Browser version. Using this GitHub action, you instantiate the latest Ubuntu Docker image, so probably you will need to adjust the ChromeDriver version to match the Chrome version used by the Docker image.

So, if the tests fail with the following error 

`org.openqa.selenium.SessionNotCreatedException: session not created: This version of ChromeDriver only supports Chrome version 100`

it means you need to update the ChromeDriver version. This is set in the file `build.gradle`. As example
`chromeDriverVersion = '102.0.5005.61'`

  Note: Same approach applies to other browsers.

As currently configured, to successfully run this workflow you need to set the following github secrets 

- MAIL_ADDRESS
- MAIL_PASSWORD
- MAIL_SERVER
- MAIL_USERNAME


The results of the test will be zipped, encrypted and emailed to the address set in ${{secrets.MAIL_ADDRESS}}.

Decrypting and unzipping the file will create a folder named `functional-tests` that contains the test reports (see `Reports` section below)



## Running using other browsers
- **ChromeHeadless**: 

  The current configuration allows you to run the test locally in ChromeHeadless mode with the command

  `./gradlew chromeHeadlessTest --tests="FirstTest"`

- **Firefox**: 

  `./gradlew firefoxTest --tests="FirstTest"`

  for the headless version

  `./gradlew firefoxHeadlessTest --tests="FirstTest"`


- **Using BrowserStack**: 

  If you run the test in BrowserStack, the capabilities of the browser are defined in the remoteChrome environment. You may want to add more environments to the list. The following command will run the test in all the environments 

  `./gradlew Test --tests="FirstTest"`


## Reports
After every run, you will find two useful reports at


`~/functional-tests/build/reports/spock`

and at 
`~/functional-tests/build/reports/tests/chromeTest`
(there is a folder for each environment defined in `GebConfig.groovy`)

The information provided by both reports overlaps, however there are some details. Visually, I find the spock report more pleasant, however, the reports under test allows to view logs messages you may have `println` to terminal, very useful in debugging mode.  

## Useful links:

<http://www.gebish.org/manual/current>

<http://spockframework.org/>

<http://groovy-lang.org/>

<https://inviqa.com/blog/bdd-guide>

<https://github.com/SeleniumHQ/selenium/wiki>


Integrate with geb/spock
https://github.com/mudassarsyed/geb-spock-mvn-browserstack
​
Github actions integration
https://www.browserstack.com/docs/automate/selenium/github-actions#action-setup-env


Check https://github.com/renatoathaydes/spock-reports for compatibility among java, Groovy, Spock and spock-reports

Check https://github.com/AOEpeople/geb-spock-reports/blob/master/README.md for compatibility among geb-spock-reports,	spock-reports,	spock-core,	Groovy and JUnit
