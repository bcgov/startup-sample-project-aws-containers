import React from "react";
import "@bcgov/bc-sans/css/BCSans.css";
import "./App.css";
import GreetingProvider from "./components/GreetingProvider";
import GreetingList from "./components/GreetingList";
import GreetingSelector from "./components/GreetingSelector";

function App() {
  return (
    <div className="App">
      <GreetingProvider>
        <GreetingSelector />
        <GreetingList />
      </GreetingProvider>
    </div>
  );
}

export default App;
