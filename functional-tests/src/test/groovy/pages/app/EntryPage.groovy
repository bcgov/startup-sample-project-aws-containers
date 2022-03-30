package pages.app
import geb.Page
//import extensions.AngularJSAware

//class AboutPage extends Page implements AngularJSAware {
//	static at = { angularReady && title.startsWith("BCDevExchange - About Us") }
class EntryPage extends Page {
	static at = { title.startsWith("BC Gov Startup Sample Project") }
	static url = "."
	static content = {
   		Header1 { $("h2",id:"pageHeader") }
		GreetingDropdown {$("div",id:"greetingDropdown")} 
		ChooseFile {$("input",id:"file")} 
		PreviousGreetings {$("table",id:"previousGreetings")}
		SubmitButton{$("button",id:"submitButtonGreeter_js")}


	}

}