package pages.app
import geb.Page
//import extensions.AngularJSAware

//class AboutPage extends Page implements AngularJSAware {
//	static at = { angularReady && title.startsWith("BCDevExchange - About Us") }
class ConfirmationPage extends Page {
	static at = { title.startsWith("BC Gov Startup Sample Project") }

	static url = "./confirmation"
	static content = {
   		MyGreeting{ $("h2",id:"selectedGreeting") }
		SubmitButton{$("a",id:"submitButtonConfirmation_js")}

	}

}