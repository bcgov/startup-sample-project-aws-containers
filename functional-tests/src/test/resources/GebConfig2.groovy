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
import org.openqa.selenium.remote.DesiredCapabilities


def downloadDir = ""
String homeDir = System.getProperty("user.dir") 

if (System.properties['os.name'].toLowerCase().contains('windows')) {
   	downloadDir = homeDir + "\\src\\test\\resources"
   	downloadedConfigFile = downloadDir +"\\p25configuration.cfg"
    println "${downloadDir} is a Windows folder"
    } 
else {
	downloadDir = homeDir + "/src/test/resources"
	downloadedConfigFile = downloadDir +"/p25configuration.cfg"
    println "${downloadDir} is not Windows folder"
}


waiting {//the value is huge because when uploading the new versions it takes a lot of time
	timeout = 600 //set to 10 minutes
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

			Map<String, Object> prefs = new HashMap<String, Object>()
			prefs.put('download.default_directory', downloadDir)
			prefs.put('safebrowsing.enabled', false)
			prefs.put('download.extensions_to_open', 'cfg')
			prefs.put('download.prompt_for_download', false)
			o.setExperimentalOption('prefs', prefs)
     	
			new ChromeDriver(o)

		}
		 waiting {
  			timeout = 600
  		}
		baseUrl = "http://192.168.66.200/"
		System.setProperty("geb.env.baseIP","192.168.66.200")
		System.setProperty("geb.env.baseMAC","f8:dc:7a:31:bf:2a")
		System.setProperty("geb.env.baseSubNet","255.255.254.0")
		System.setProperty("geb.env.UICSide","A")
		println "BaseURL using ChromeDriver: ${baseUrl}"
		println "--------------------------"

		//quitCachedDriverOnShutdown = false
	}


	// run via “./gradlew chromeOrangeTest”
	chromeOrange {
		driver = {
			ChromeOptions o = new ChromeOptions()
			o.addArguments('--allow-running-insecure-content')
			o.addArguments('--allow-insecure-localhost')	
			o.setExperimentalOption('useAutomationExtension', false)
			o.addArguments('--safebrowsing-disable-download-protection')

			Map<String, Object> prefs = new HashMap<String, Object>()
			prefs.put('download.default_directory', downloadDir)
			prefs.put('safebrowsing.enabled', false)
			prefs.put('download.extensions_to_open', 'cfg')
			prefs.put('download.prompt_for_download', false)
			o.setExperimentalOption('prefs', prefs)
     	
			new ChromeDriver(o)
 
		}
		baseUrl = "http://192.168.66.172/"
		System.setProperty("geb.env.baseIP","192.168.66.172")
		System.setProperty("geb.env.baseMAC","f8:dc:7a:1e:19:7d")
		System.setProperty("geb.env.baseSubNet","255.255.255.0")
		System.setProperty("geb.env.UICSide","B")
		println "BaseURL using ChromeOrangeDriver: ${baseUrl}"
		println "--------------------------"
	}

	// run via “./gradlew chromeHeadlessTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver
	chromeHeadless {

		driver = {
			ChromeOptions o = new ChromeOptions()
			o.addArguments('--headless')
			o.addArguments('--allow-running-insecure-content')
			o.addArguments('--allow-insecure-localhost')	
			o.setExperimentalOption('useAutomationExtension', false)
			
			Map<String, Object> prefs = new HashMap<String, Object>()
			prefs.put('safebrowsing.enabled', false)
			prefs.put('download.extensions_to_open', 'cfg')
			prefs.put('download.prompt_for_download', false)
			o.setExperimentalOption("prefs", prefs)

			new ChromeDriver(o)
		}
		
		baseUrl = "http://192.168.66.200/"
		System.setProperty("geb.env.baseIP","192.168.66.200")
		System.setProperty("geb.env.baseMAC","f8:dc:7a:31:bf:2a")
		System.setProperty("geb.env.baseSubNet","255.255.254.0")
		System.setProperty("geb.env.UICSide","A")
		println "BaseURL using ChromeHeadlessDriver: ${baseUrl}"
		println "--------------------------"
	}
	

	// run via “./gradlew chromeHeadlessOrangeTest”
	// See: https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver
	chromeHeadlessOrange {
		driver = {
			ChromeOptions o = new ChromeOptions()
			o.addArguments('--headless')
			o.addArguments('--allow-running-insecure-content')
			o.addArguments('--allow-insecure-localhost')	
			o.setExperimentalOption('useAutomationExtension', false)
	
			Map<String, Object> prefs = new HashMap<String, Object>()
			prefs.put('safebrowsing.enabled', false)
			prefs.put('download.extensions_to_open', 'cfg')
			prefs.put('download.prompt_for_download', false)
			o.setExperimentalOption("prefs", prefs)

			new ChromeDriver(o)
		}
			baseUrl = "http://192.168.66.172/"
			System.setProperty("geb.env.baseIP","192.168.66.172")
			System.setProperty("geb.env.baseMAC","f8:dc:7a:1e:19:7d")
			System.setProperty("geb.env.baseSubNet","255.255.255.0")
			System.setProperty("geb.env.UICSide","B")
			println "BaseURL using ChromeHeadlessOrangeDriver: ${baseUrl}"
			println "--------------------------"
			
	}

	System.setProperty("geb.env.login", "p25admin")
	System.setProperty("geb.env.pwd", "p25admin")
	System.setProperty("geb.env.pwd2", "p26admin")
	System.setProperty("geb.env.downLoadDir",downloadDir)
	System.setProperty("geb.env.downloadedConfigFile",downloadedConfigFile)

}

// To run the tests with all browsers just run “./gradlew test”

baseNavigatorWaiting = true

// Allows for setting you baseurl in an environment variable.
// This is particularly handy for development and the pipeline
//def env = System.getenv()
//baseUrl = env['BASEURL']

if (!baseUrl) { //In this case the baseURL is set in the environments
	//baseUrl = "https://172.23.123.2/"
	//baseUrl="http://192.168.66.200/"
}

println "BaseURL: ${baseUrl}"
println "--------------------------"

cacheDriverPerThread = true
quitCachedDriverOnShutdown = true 
