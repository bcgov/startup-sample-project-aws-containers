# BDDStack

## Description

Automated functional test suite for the https://www.bcdevexchange.org/ microprocurement application. 





## Usage
To run the test suite, open terminal and navigate to `.../functional-test` and execute 
`./gradlew chromeTest --tests="FirstTest" --warning-mode all`


- **Firefox**: 

- **Safari**: Same bugs as in Firefox. I have not tried further.

- **ChromeHeadless**:


## Pitfalls and weirdness




- The file `build.gradle` contains the versions used in this test suite.
In addition, the versions of other important components are:
   - java version "11.0.1" 2018-10-16 LTS
   - gradle v5.0



check https://github.com/renatoathaydes/spock-reports for compatibility among java, Groovy, Spock and spock-reports

check https://github.com/AOEpeople/geb-spock-reports/blob/master/README.md for compatibility among geb-spock-reports,	spock-reports,	spock-core,	Groovy and JUnit


## Questions and issues



## Useful links:

<http://www.gebish.org/manual/current>

<http://spockframework.org/>

<http://groovy-lang.org/>

<https://inviqa.com/blog/bdd-guide>

<https://github.com/SeleniumHQ/selenium/wiki>


