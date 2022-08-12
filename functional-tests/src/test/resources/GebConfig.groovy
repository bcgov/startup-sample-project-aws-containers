/*
	This is the Geb configuration file.
	
	See: http://www.gebish.org/manual/current/#configuration
*/

import org.openqa.selenium.Dimension
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.firefox.FirefoxOptions
import org.openqa.selenium.ie.InternetExplorerDriver
import org.openqa.selenium.edge.EdgeDriver
import org.openqa.selenium.safari.SafariDriver
import org.openqa.selenium.remote.RemoteWebDriver
import org.openqa.selenium.remote.DesiredCapabilities
import org.openqa.selenium.remote.LocalFileDetector

def env = System.getenv()

// Setting the baseUrl, it is the url used by the automation as root page
if (System.getenv('LICENSE_PLATE') == null) {// LICENSE_PLATE is se as env variable in the browserStackTest.yml file.
	baseUrl = "http://localhost:4000/"   //When running the container in your local machine, otherwise is set in the GitHub action
}
else {
	baseUrl= "https://startup-sample-project.${env['LICENSE_PLATE']}-dev.nimbus.cloud.gov.bc.ca/"


}

println "BaseURL ===> $baseUrl" //printing the baseUrl used by the test

waiting {
	timeout = 20  //seconds, if nothing happens stop the run 
	retryInterval = 1
}

atCheckWaiting = [20, 1]

environments {
	// run via “./gradlew chromeTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver
	chrome {

		driver = { 
			//	def capabilities = org.openqa.selenium.remote.DesiredCapabilities.chrome()	
			//	capabilities.setCapability("PageLoadStrategy","normal")
			ChromeOptions o = new ChromeOptions()

			o.addArguments('--allow-running-insecure-content')
			o.addArguments('--allow-insecure-localhost')	
			o.setExperimentalOption('useAutomationExtension', false)
			o.addArguments('--safebrowsing-disable-download-protection')
			o.addArguments("--disable-dev-shm-usage"); // overcome limited resource problems

			Map<String, Object> prefs = new HashMap<String, Object>()
			prefs.put('download.default_directory', downloadDir)
			prefs.put('safebrowsing.enabled', false)
			prefs.put('download.extensions_to_open', 'cfg')
			prefs.put('download.prompt_for_download', false)
			o.setExperimentalOption('prefs', prefs)
     	
			new ChromeDriver(o)
		}
	}


// run via “./gradlew remotechromeTest”
 remoteChrome {
	 	//The BrowserStack url with the corresponding credentials to run the test on one of their browsers
        remoteURL = "https://${env['BROWSERSTACK_USERNAME']}:${env['BROWSERSTACK_ACCESS_KEY']}@hub-cloud.browserstack.com/wd/hub";

        driver = {
			//Check https://www.browserstack.com/automate/capabilities, it will generate the capabilities for you
			chromeOptions = new ChromeOptions()
			chromeOptions.setCapability("os", "WINDOWS")
			chromeOptions.setCapability("os_version", "11");
			chromeOptions.setCapability("browser_version", "99.0");
			chromeOptions.setCapability("browserstack.local", "false");
			chromeOptions.setCapability("browserstack.selenium_version", "3.14.0");
			chromeOptions.setCapability("build", "0.1")
		   	chromeOptions.setCapability("project", "Automating SEA Testing")

            new RemoteWebDriver(new URL(remoteURL),chromeOptions)
					
            //def drvr = new RemoteWebDriver(new URL(remoteURL), capabilities)
            //drvr.setFileDetector(new LocalFileDetector())  //this option allows to tranfers files from local to BrowserStack
        }
    }


	// run via “./gradlew chromeHeadlessTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver
	chromeHeadless {
		driver = {
			ChromeOptions o = new ChromeOptions()
			o.addArguments('headless')
			//o.addArguments('disable-gpu') 
			//o.addArguments('no-sandbox')
			o.addArguments('window-size=1980,1080')
			new ChromeDriver(o)
		}
	}
	
	// run via “./gradlew firefoxTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/FirefoxDriver
	// See also https://www.guru99.com/gecko-marionette-driver-selenium.html


	firefox {
		driver = { new FirefoxDriver() }
	}
		
	firefoxHeadless {
		driver = {
			FirefoxOptions o = new FirefoxOptions()
			o.addArguments("-headless")
			new FirefoxDriver(o)
		}
	}
/*	
	// run via “./gradlew ieTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/InternetExplorerDriver
	ie {
		def d = new DesiredCapabilities();
		d.setCapability(InternetExplorerDriver.INTRODUCE_FLAKINESS_BY_IGNORING_SECURITY_DOMAINS,true);
		d.setCapability(InternetExplorerDriver.IGNORE_ZOOM_SETTING,true);
		d.setCapability(InternetExplorerDriver.NATIVE_EVENTS,false);
		d.setCapability(InternetExplorerDriver.REQUIRE_WINDOW_FOCUS,true);
		
		driver = { new InternetExplorerDriver(d) }	
	}

	// run via “./gradlew edgeTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki
	edge {
		driver = { new EdgeDriver() }
	}

	// run via “./gradlew safariTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki
	safari {
		driver = { new SafariDriver() }
	}
*/	
}

// To run the tests with all browsers just run “./gradlew test”

baseNavigatorWaiting = true

cacheDriverPerThread = true
quitCachedDriverOnShutdown = true 

