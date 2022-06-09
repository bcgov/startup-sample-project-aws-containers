package modules

import geb.Module

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.RemoteWebDriver
import org.openqa.selenium.JavascriptExecutor;
import java.net.URL;


import org.openqa.selenium.Dimension
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.chrome.ChromeOptions


import org.openqa.selenium.remote.DesiredCapabilities
import org.openqa.selenium.remote.LocalFileDetector






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
class CheckboxModule extends Module {







    def check() {
        this.value(true)
    }

    def uncheck() {
        this.value(false)
    }

    def isChecked() {
        this.value() == true
    }    
    
    def isUnchecked() {
        !isChecked()
    }

    def annotate(String data, String level, WebDriver driver) {
        final JavascriptExecutor jse = (JavascriptExecutor) driver;
        jse.executeScript("browserstack_executor: {\"action\": \"annotate\", \"arguments\": {\"data\": \""+ data + "\", \"level\": \"" + level + "\"}}");
    }

}