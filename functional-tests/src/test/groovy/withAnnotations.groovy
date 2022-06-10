import geb.spock.GebReportingSpec

import modules.CheckboxModule

import pages.app.EntryPage
import pages.app.ConfirmationPage
                 
import spock.lang.Unroll
import spock.lang.Narrative
import spock.lang.Title

import org.junit.Test


import org.openqa.selenium.JavascriptExecutor
import org.openqa.selenium.WebDriver

//import org.junit.jupiter.api.Test





@Narrative('''Basic functionality test''')

@Title("Load the Containers Sample application, check some elements, interact with the DB")


class withAnnotations extends GebReportingSpec {


   def boolean annotate(String data, String level, WebDriver driver) {
        final JavascriptExecutor jse = (JavascriptExecutor) driver;
        jse.executeScript("browserstack_executor: {\"action\": \"annotate\", \"arguments\": {\"data\": \""+ data + "\", \"level\": \"" + level + "\"}}");
        return true
    }



  def "Go to Entry Page and verify the title" () {
    given: "Starting from the Entry Page"
        waitFor {to EntryPage}

        annotate("And email will be sent to the emaill address #### with pwd ${System.getenv('LICENSE_PLATE')} " ,"info",driver)
        assert Header1.text() == "Simple Demo App"   //Check the title


    when: "Click on the Drop down to expand the drop down options, select #Greeting  and click Submit button"
        GreetingDropdown.click()
        $("li",'data-value':testGreeting).click()
        sleep(1000)
        waitFor{SubmitButton.click()}

    then: "verify we load the confimation page and Verify the Hello greeting appears in the Previous Greeting selection list"
       assert(waitFor{at ConfirmationPage})
       //sleep(300)
       assert waitFor{(MyGreeting.text().contains(testGreeting))}

    and: "Return to the Entry page by clicking the Confirmation button"
    waitFor{SubmitButton.click()}

    then: "Confirm we have arrived to the Entry page and confirm the current greeting and the previous one have been saved and it is displayed"    
        assert(waitFor{at EntryPage})
        //sleep(500)

        if (waitFor{PreviousGreetings.$("td")[2].text().contains(testGreeting)}){
          println("Create Debug annotation")
          annotate("It contains the greeting" ,"debug",driver)
        }
        else{
          println("Create Error annotation")
          annotate("Fails the greeting" ,"error",driver)
        }
        assert waitFor{PreviousGreetings.$("td")[2].text().contains(testGreeting)}

        if (iteration>1){
            if (waitFor{PreviousGreetings.$("td")[5].text().contains(testPreviousGreeting)}){
                println("Create Debug annotation")
                annotate("It contains the previous greeting" ,"debug",driver)
            }
            else{
              println("Create Error annotation")
              annotate("Fails the [revious greeting" ,"error",driver)
            }

        assert waitFor{PreviousGreetings.$("td")[5].text().contains(testPreviousGreeting)}    
        }

    where:
       testGreeting      | testPreviousGreeting | iteration
       "Aloha"           | _                    | 1 
       "Hello"           | "Aloha"              | 2
       "Bonjour"         | "Hello"              | 3
       "Konichiwa"       | "Bonjour"            | 4
       "Howdy"           | "Konichiwa"          | 5

     }

}
