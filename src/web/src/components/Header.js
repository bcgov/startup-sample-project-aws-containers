import React from "react";
import "@bcgov/bc-sans/css/BCSans.css";
import "./Header.css";

function App() {
  return (
    <div className="Header">
      <div class="banner">
        <a href="https://gov.bc.ca">
          <img
            src="logo.svg"
            alt="Go to the Government of British Columbia website"
          />
        </a>
        <h1>Public Cloud Sample Application</h1>
      </div>
      <div class="other">&nbsp;</div>
    </div>
  );
}

export default App;
